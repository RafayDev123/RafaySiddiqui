import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import handler from "../api/contact.ts";

const envKeys = [
  "RECAPTCHA_PROJECT_ID",
  "RECAPTCHA_API_KEY",
  "VITE_RECAPTCHA_SITE_KEY",
  "RECAPTCHA_ALLOWED_HOSTNAMES",
  "EMAILJS_SERVICE_ID",
  "EMAILJS_TEMPLATE_ID",
  "EMAILJS_PUBLIC_KEY",
];
const originalEnv = new Map();
let originalFetch;
let fetchCalls;

const validSubmission = {
  name: "Test User",
  email: "test@example.com",
  projectType: "Website / Frontend build",
  message: "This is a test contact message.",
  captchaToken: "single-use-test-token",
};

function responseRecorder() {
  return {
    statusCode: 200,
    body: undefined,
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
    },
  };
}

function mockFetch(assessment) {
  globalThis.fetch = async (input, options) => {
    const url = String(input);
    fetchCalls.push({ url, options });
    if (url.includes("recaptchaenterprise.googleapis.com")) {
      return new Response(JSON.stringify(assessment), { status: 200 });
    }
    return new Response("OK", { status: 200 });
  };
}

async function submit(body = validSubmission, method = "POST") {
  const res = responseRecorder();
  await handler(
    { method, body, headers: { "user-agent": "contact-form-test" } },
    res
  );
  return res;
}

beforeEach(() => {
  for (const key of envKeys) {
    originalEnv.set(key, process.env[key]);
  }
  Object.assign(process.env, {
    RECAPTCHA_PROJECT_ID: "portfolio-test-project",
    RECAPTCHA_API_KEY: "test-cloud-api-key",
    VITE_RECAPTCHA_SITE_KEY: "test-cloud-site-key",
    RECAPTCHA_ALLOWED_HOSTNAMES: "rafaysiddiqui.vercel.app",
    EMAILJS_SERVICE_ID: "test-service",
    EMAILJS_TEMPLATE_ID: "test-template",
    EMAILJS_PUBLIC_KEY: "test-public-key",
  });
  originalFetch = globalThis.fetch;
  fetchCalls = [];
});

afterEach(() => {
  for (const key of envKeys) {
    const value = originalEnv.get(key);
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
    originalEnv.delete(key);
  }
  globalThis.fetch = originalFetch;
});

test("assesses the Cloud checkbox token before sending email", async () => {
  mockFetch({
    tokenProperties: {
      valid: true,
      hostname: "rafaysiddiqui.vercel.app",
      action: "contact",
    },
  });

  const result = await submit();

  assert.equal(result.statusCode, 200);
  assert.deepEqual(result.body, { success: true });
  assert.equal(fetchCalls.length, 2);
  const assessment = JSON.parse(fetchCalls[0].options.body);
  assert.equal(assessment.event.expectedAction, "contact");
  assert.equal(assessment.event.siteKey, "test-cloud-site-key");
  const email = JSON.parse(fetchCalls[1].options.body);
  assert.equal(email.template_params.message, validSubmission.message);
  assert.equal("captchaToken" in email.template_params, false);
});

test("rejects invalid tokens without sending email", async () => {
  mockFetch({ tokenProperties: { valid: false } });

  const result = await submit();

  assert.equal(result.statusCode, 403);
  assert.deepEqual(result.body, { error: "captcha_rejected" });
  assert.equal(fetchCalls.length, 1);
});

test("rejects an assessment with the wrong hostname", async () => {
  mockFetch({
    tokenProperties: {
      valid: true,
      hostname: "attacker.example",
      action: "contact",
    },
  });

  const result = await submit();

  assert.equal(result.statusCode, 403);
  assert.equal(fetchCalls.length, 1);
});

test("rejects an assessment with the wrong action", async () => {
  mockFetch({
    tokenProperties: {
      valid: true,
      hostname: "rafaysiddiqui.vercel.app",
      action: "other",
    },
  });

  const result = await submit();

  assert.equal(result.statusCode, 403);
  assert.equal(fetchCalls.length, 1);
});

test("fails closed when Google cannot be reached", async () => {
  globalThis.fetch = async () => {
    throw new Error("network unavailable");
  };

  const result = await submit();

  assert.equal(result.statusCode, 502);
  assert.deepEqual(result.body, { error: "verification_unavailable" });
  assert.equal(fetchCalls.length, 0);
});

test("fails closed when Google returns an API error", async () => {
  globalThis.fetch = async (input, options) => {
    fetchCalls.push({ url: String(input), options });
    return new Response("unavailable", { status: 503 });
  };

  const result = await submit();

  assert.equal(result.statusCode, 502);
  assert.deepEqual(result.body, { error: "verification_unavailable" });
  assert.equal(fetchCalls.length, 1);
});

test("does not report success when EmailJS rejects delivery", async () => {
  const loggedErrors = [];
  const originalConsoleError = console.error;
  console.error = (...args) => loggedErrors.push(args);
  globalThis.fetch = async (input, options) => {
    const url = String(input);
    fetchCalls.push({ url, options });
    if (url.includes("recaptchaenterprise.googleapis.com")) {
      return new Response(
        JSON.stringify({
          tokenProperties: {
            valid: true,
            hostname: "rafaysiddiqui.vercel.app",
            action: "contact",
          },
        }),
        { status: 200 }
      );
    }
    return new Response(
      "Forbidden: invalid key test-public-key for test@example.com. Message: This is a test contact message.",
      { status: 403 }
    );
  };

  let result;
  try {
    result = await submit();
  } finally {
    console.error = originalConsoleError;
  }

  assert.equal(result.statusCode, 502);
  assert.deepEqual(result.body, { error: "email_unavailable" });
  assert.match(result.headers["X-Request-Id"], /^[0-9a-f-]{36}$/);
  assert.equal(fetchCalls.length, 2);
  const diagnostic = JSON.stringify(loggedErrors);
  assert.match(diagnostic, /403/);
  assert.match(diagnostic, /invalid key \[redacted\]/);
  assert.doesNotMatch(diagnostic, /test-public-key|test@example\.com|test contact message/);
});

test("fails closed when server configuration is missing", async () => {
  delete process.env.RECAPTCHA_API_KEY;
  globalThis.fetch = async () => {
    throw new Error("fetch must not run");
  };

  const result = await submit();

  assert.equal(result.statusCode, 503);
  assert.deepEqual(result.body, { error: "service_unavailable" });
});
