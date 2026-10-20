import type { IncomingMessage, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";

type VercelRequest = IncomingMessage & { body?: unknown };
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

type ContactSubmission = {
  name: string;
  email: string;
  projectType: string;
  message: string;
  captchaToken: string;
};

const projectTypes = new Set([
  "Website / Frontend build",
  "React / Next.js application",
  "AI-powered feature or chatbot",
  "Something else",
]);
const expectedAction = "contact";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseBody(body: unknown): Record<string, unknown> | null {
  if (typeof body === "string") {
    try {
      const parsed: unknown = JSON.parse(body);
      return isRecord(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
  return isRecord(body) ? body : null;
}

function parseSubmission(body: unknown): ContactSubmission | null {
  const fields = parseBody(body);
  if (!fields) return null;

  const name = typeof fields.name === "string" ? fields.name.trim() : "";
  const email = typeof fields.email === "string" ? fields.email.trim() : "";
  const projectType = typeof fields.projectType === "string" ? fields.projectType : "";
  const message = typeof fields.message === "string" ? fields.message.trim() : "";
  const captchaToken =
    typeof fields.captchaToken === "string" ? fields.captchaToken.trim() : "";

  if (
    !name ||
    name.length > 120 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    !projectTypes.has(projectType) ||
    message.length < 10 ||
    message.length > 5000 ||
    !captchaToken ||
    captchaToken.length > 8192
  ) {
    return null;
  }

  return { name, email, projectType, message, captchaToken };
}

function normalizeHostname(value: string) {
  return value.trim().toLowerCase().replace(/\.$/, "");
}

function sanitizeProviderMessage(
  message: string,
  sensitiveValues: string[]
): string {
  let sanitized = message
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[^\x20-\x7E]/g, "?")
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[redacted email]")
    .replace(/\b(?:Bearer\s+)?(?:AIza[0-9A-Za-z_-]{20,}|[0-9A-Za-z_-]{32,})\b/g, "[redacted credential]");

  for (const value of sensitiveValues.filter(Boolean)) {
    sanitized = sanitized.split(value).join("[redacted]");
  }

  return sanitized.slice(0, 300);
}

async function getEmailProviderMessage(response: Response): Promise<string> {
  let body: string;
  try {
    body = await response.text();
  } catch {
    return "Provider error response could not be read.";
  }

  try {
    const parsed: unknown = JSON.parse(body);
    if (isRecord(parsed)) {
      const nestedError = isRecord(parsed.error) ? parsed.error.message : undefined;
      for (const value of [parsed.message, parsed.error, parsed.text, nestedError]) {
        if (typeof value === "string") return value;
      }
      return "Provider returned an unrecognized error response.";
    }
  } catch {
    return body || "Provider returned an empty error response.";
  }

  return body || "Provider returned an empty error response.";
}

function logContactEvent(
  requestId: string,
  stage: string,
  details: Record<string, string | number | boolean> = {}
): void {
  console.info(JSON.stringify({ requestId, stage, ...details }));
}

function respond(
  response: VercelResponse,
  status: number,
  error: string
): void {
  response.status(status).json({ error });
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  const requestId = randomUUID();
  res.setHeader("X-Request-Id", requestId);
  logContactEvent(requestId, "request_received", {
    method: req.method ?? "UNKNOWN",
  });

  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      logContactEvent(requestId, "request_rejected", { reason: "method_not_allowed" });
      respond(res, 405, "method_not_allowed");
      return;
    }

    const submission = parseSubmission(req.body);
    if (!submission) {
      logContactEvent(requestId, "input_validation_failed", {
        reason: "invalid_request",
      });
      respond(res, 400, "invalid_request");
      return;
    }
    logContactEvent(requestId, "input_validation_completed");

    const {
      RECAPTCHA_PROJECT_ID: projectId,
      RECAPTCHA_API_KEY: apiKey,
      VITE_RECAPTCHA_SITE_KEY: siteKey,
      RECAPTCHA_ALLOWED_HOSTNAMES: configuredHostnames,
      EMAILJS_SERVICE_ID: emailServiceId,
      EMAILJS_TEMPLATE_ID: emailTemplateId,
      EMAILJS_PUBLIC_KEY: emailPublicKey,
      EMAILJS_PRIVATE_KEY: emailPrivateKey,
    } = process.env;
    const allowedHostnames = configuredHostnames
      ?.split(",")
      .map(normalizeHostname)
      .filter(Boolean);

    if (
      !projectId ||
      !apiKey ||
      !siteKey ||
      !allowedHostnames?.length ||
      !emailServiceId ||
      !emailTemplateId ||
      !emailPublicKey ||
      !emailPrivateKey
    ) {
      logContactEvent(requestId, "configuration_missing");
      respond(res, 503, "service_unavailable");
      return;
    }

    const assessmentUrl = new URL(
      `https://recaptchaenterprise.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/assessments`
    );
    assessmentUrl.searchParams.set("key", apiKey);

    logContactEvent(requestId, "captcha_verification_started");
    let assessmentResponse: Response;
    try {
      assessmentResponse = await fetch(assessmentUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: {
            token: submission.captchaToken,
            siteKey,
            expectedAction,
            ...(typeof req.headers["user-agent"] === "string"
              ? { userAgent: req.headers["user-agent"] }
              : {}),
          },
        }),
        signal: AbortSignal.timeout(4000),
      });
    } catch (error) {
      logContactEvent(requestId, "captcha_verification_failed", {
        reason: error instanceof Error ? error.name : "unknown_error",
      });
      respond(res, 502, "verification_unavailable");
      return;
    }

    if (!assessmentResponse.ok) {
      const providerMessage = await getEmailProviderMessage(assessmentResponse);
      logContactEvent(requestId, "captcha_provider_error", {
        status: assessmentResponse.status,
        providerMessage: sanitizeProviderMessage(providerMessage, [
          apiKey,
          siteKey,
          submission.captchaToken,
          projectId,
        ]),
      });
      respond(res, 502, "verification_unavailable");
      return;
    }

    let assessment: unknown;
    try {
      assessment = await assessmentResponse.json();
    } catch {
      logContactEvent(requestId, "captcha_provider_error", {
        reason: "invalid_json",
        status: assessmentResponse.status,
      });
      respond(res, 502, "verification_unavailable");
      return;
    }

    const tokenProperties = isRecord(assessment)
      ? assessment.tokenProperties
      : undefined;
    if (!isRecord(tokenProperties) || tokenProperties.valid !== true) {
      logContactEvent(requestId, "captcha_rejected", {
        reason: "invalid_token",
      });
      respond(res, 403, "captcha_rejected");
      return;
    }

    const hostname =
      typeof tokenProperties.hostname === "string"
        ? normalizeHostname(tokenProperties.hostname)
        : "";
    if (!allowedHostnames.includes(hostname)) {
      logContactEvent(requestId, "captcha_rejected", {
        reason: "hostname_mismatch",
      });
      respond(res, 403, "captcha_rejected");
      return;
    }
    if (tokenProperties.action !== expectedAction) {
      logContactEvent(requestId, "captcha_rejected", {
        reason: "action_mismatch",
      });
      respond(res, 403, "captcha_rejected");
      return;
    }
    logContactEvent(requestId, "captcha_verification_completed");

    logContactEvent(requestId, "emailjs_request_started");
    let emailResponse: Response;
    try {
      emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: emailServiceId,
          template_id: emailTemplateId,
          user_id: emailPublicKey,
          accessToken: emailPrivateKey.trim(),
          template_params: {
            name: submission.name,
            email: submission.email,
            projectType: submission.projectType,
            message: submission.message,
          },
        }),
        signal: AbortSignal.timeout(4000),
      });
    } catch (error) {
      logContactEvent(requestId, "emailjs_request_failed", {
        reason: error instanceof Error ? error.name : "unknown_error",
      });
      respond(res, 502, "email_unavailable");
      return;
    }

    logContactEvent(requestId, "emailjs_response_received", {
      status: emailResponse.status,
    });
    if (!emailResponse.ok) {
      const providerMessage = await getEmailProviderMessage(emailResponse);
      logContactEvent(requestId, "emailjs_rejected", {
        status: emailResponse.status,
        providerMessage: sanitizeProviderMessage(providerMessage, [
          emailServiceId,
          emailTemplateId,
          emailPublicKey,
          emailPrivateKey,
          submission.name,
          submission.email,
          submission.message,
        ]),
      });
      respond(res, 502, "email_unavailable");
      return;
    }

    logContactEvent(requestId, "emailjs_accepted", {
      status: emailResponse.status,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    logContactEvent(requestId, "unexpected_exception", {
      reason: error instanceof Error ? error.name : "unknown_error",
    });
    if (!res.headersSent) respond(res, 500, "internal_error");
  }
}
