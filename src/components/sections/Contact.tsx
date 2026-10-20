// import { useRef, useState, type FormEvent } from "react";
// import { ArrowUpRight, CheckCircle2, Mail } from "lucide-react";
// import ReCAPTCHA from "react-google-recaptcha";
// import { Container } from "@/components/ui/Container";
// import { GitHubIcon, LinkedInIcon } from "@/components/icons";
// import { siteConfig } from "@/data/site";

// type FormState = {
//   name: string;
//   email: string;
//   projectType: string;
//   message: string;
// };

// type Errors = Partial<Record<keyof FormState | "captcha", string>>;

// const initialState: FormState = { name: "", email: "", projectType: "Website / Frontend build", message: "" };

// const projectTypes = [
//   "Website / Frontend build",
//   "React / Next.js application",
//   "AI-powered feature or chatbot",
//   "Something else",
// ];

// function isValidEmail(value: string) {
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
// }

// export function Contact() {
//   const [form, setForm] = useState<FormState>(initialState);
//   const [errors, setErrors] = useState<Errors>({});
//   const [status, setStatus] = useState<"idle" | "success">("idle");
//   const [captchaToken, setCaptchaToken] = useState<string | null>(null);
//   const captchaRef = useRef<ReCAPTCHA>(null);
//   const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

//   const validate = (): Errors => {
//     const next: Errors = {};
//     if (!form.name.trim()) next.name = "Please enter your name.";
//     if (!form.email.trim()) next.email = "Please enter your email.";
//     else if (!isValidEmail(form.email)) next.email = "That doesn't look like a valid email.";
//     if (!form.message.trim() || form.message.trim().length < 10)
//       next.message = "Tell me a little about the project (10+ characters).";
//     return next;
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     setErrors(validationErrors);
//     if (Object.keys(validationErrors).length > 0) return;
//     if (!recaptchaSiteKey) {
//       setErrors({ captcha: "reCAPTCHA is not configured." });
//       return;
//     }
//     if (!captchaToken) {
//       setErrors({ captcha: "Please complete the reCAPTCHA challenge." });
//       return;
//     }

//     const subject = encodeURIComponent(`Project inquiry - ${form.projectType}`);
//     const body = encodeURIComponent(
//       `Name: ${form.name}\nEmail: ${form.email}\nProject type: ${form.projectType}\n\n${form.message}`
//     );
//     window.location.href = `${siteConfig.social.email}?subject=${subject}&body=${body}`;
//     setStatus("success");
//     setCaptchaToken(null);
//     captchaRef.current?.reset();
//   };

//   if (status === "success") {
//     return (
//       <section id="contact" className="scroll-mt-16 border-b border-[var(--border)] py-24 sm:py-28" aria-label="Contact">
//         <Container className="max-w-xl text-center">
//           <CheckCircle2 className="mx-auto h-10 w-10 text-[var(--accent)]" aria-hidden />
//           <h2 className="mt-6 font-display text-2xl font-medium text-[var(--text)]">Email draft ready.</h2>
//           <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
//             Your email app has opened with the project details. Send the message to{" "}
//             <a href={siteConfig.social.email} className="text-[var(--accent)] hover:underline">
//               {siteConfig.email}
//             </a>
//             .
//           </p>
//           <div className="mt-8 flex justify-center gap-4">
//             <div>
//               {recaptchaSiteKey ? (
//                 <ReCAPTCHA
//                   ref={captchaRef}
//                   sitekey={recaptchaSiteKey}
//                   onChange={(token) => {
//                     setCaptchaToken(token);
//                     setErrors((current) => ({ ...current, captcha: undefined }));
//                   }}
//                   onExpired={() => setCaptchaToken(null)}
//                   onErrored={() => setCaptchaToken(null)}
//                 />
//               ) : (
//                 <p className="text-xs text-red-400">reCAPTCHA is not configured.</p>
//               )}
//               {errors.captcha && (
//                 <p role="alert" className="mt-1.5 text-xs text-red-400">
//                   {errors.captcha}
//                 </p>
//               )}
//             </div>

//             <button
//               onClick={() => {
//                 setForm(initialState);
//                 setStatus("idle");
//               }}
//               className="rounded-full border border-[var(--border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
//             >
//               Send another message
//             </button>
//           </div>
//         </Container>
//       </section>
//     );
//   }

//   return (
//     <section id="contact" className="scroll-mt-16 py-24 sm:py-28" aria-label="Contact">
//       <Container>
//         <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
//           <div>
//             <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--accent)]">Contact</p>
//             <h2 className="text-balance mt-4 font-display text-[clamp(2rem,4.4vw,3.2rem)] font-medium leading-[1.1] text-[var(--text)]">
//               Have a project, product, or idea worth building?
//             </h2>
//             <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--text-muted)]">
//               Send a few details below, or reach out directly. I read every message myself.
//             </p>

//             <div className="mt-10 space-y-3">
//               <a
//                 href={siteConfig.social.email}
//                 className="group flex items-center gap-3 rounded-lg border border-[var(--border)] px-4 py-3.5 text-sm text-[var(--text)] transition-colors hover:border-[var(--accent)]"
//               >
//                 <Mail className="h-4 w-4 text-[var(--text-faint)]" aria-hidden />
//                 {siteConfig.email}
//                 <ArrowUpRight className="ml-auto h-4 w-4 text-[var(--text-faint)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
//               </a>
//               <a
//                 href={siteConfig.social.linkedin}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="group flex items-center gap-3 rounded-lg border border-[var(--border)] px-4 py-3.5 text-sm text-[var(--text)] transition-colors hover:border-[var(--accent)]"
//               >
//                 <LinkedInIcon className="h-4 w-4 text-[var(--text-faint)]" />
//                 Connect on LinkedIn
//                 <ArrowUpRight className="ml-auto h-4 w-4 text-[var(--text-faint)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
//               </a>
//               <a
//                 href={siteConfig.social.github}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="group flex items-center gap-3 rounded-lg border border-[var(--border)] px-4 py-3.5 text-sm text-[var(--text)] transition-colors hover:border-[var(--accent)]"
//               >
//                 <GitHubIcon className="h-4 w-4 text-[var(--text-faint)]" />
//                 View GitHub profile
//                 <ArrowUpRight className="ml-auto h-4 w-4 text-[var(--text-faint)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
//               </a>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-describedby={undefined}>
//             <div className="grid gap-5 sm:grid-cols-2">
//               <Field
//                 label="Name"
//                 name="name"
//                 value={form.name}
//                 error={errors.name}
//                 onChange={(v) => setForm((f) => ({ ...f, name: v }))}
//                 autoComplete="name"
//               />
//               <Field
//                 label="Email"
//                 name="email"
//                 type="email"
//                 value={form.email}
//                 error={errors.email}
//                 onChange={(v) => setForm((f) => ({ ...f, email: v }))}
//                 autoComplete="email"
//               />
//             </div>

//             <div>
//               <label htmlFor="projectType" className="block text-sm font-medium text-[var(--text)]">
//                 Project type
//               </label>
//               <select
//                 id="projectType"
//                 name="projectType"
//                 value={form.projectType}
//                 onChange={(e) => setForm((f) => ({ ...f, projectType: e.target.value }))}
//                 className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--accent)]"
//               >
//                 {projectTypes.map((type) => (
//                   <option key={type} value={type}>
//                     {type}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label htmlFor="message" className="block text-sm font-medium text-[var(--text)]">
//                 Message
//               </label>
//               <textarea
//                 id="message"
//                 name="message"
//                 rows={5}
//                 value={form.message}
//                 onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
//                 aria-invalid={!!errors.message}
//                 aria-describedby={errors.message ? "message-error" : undefined}
//                 className="mt-2 w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--accent)]"
//                 placeholder="What are you building?"
//               />
//               {errors.message && (
//                 <p id="message-error" role="alert" className="mt-1.5 text-xs text-red-400">
//                   {errors.message}
//                 </p>
//               )}
//             </div>

//             <button
//               type="submit"
//               className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--text)] px-6 py-3.5 text-sm font-medium text-[var(--bg)] transition-colors hover:bg-[var(--accent)] hover:text-white sm:w-auto"
//             >
//               Submit
//             </button>
//             <p className="text-xs text-[var(--text-faint)]">
//               Your email app will open with the message details ready to send.
//             </p>
//           </form>
//         </div>
//       </Container>
//     </section>
//   );
// }

// function Field({
//   label,
//   name,
//   value,
//   error,
//   onChange,
//   type = "text",
//   autoComplete,
// }: {
//   label: string;
//   name: string;
//   value: string;
//   error?: string;
//   onChange: (v: string) => void;
//   type?: string;
//   autoComplete?: string;
// }) {
//   return (
//     <div>
//       <label htmlFor={name} className="block text-sm font-medium text-[var(--text)]">
//         {label}
//       </label>
//       <input
//         id={name}
//         name={name}
//         type={type}
//         value={value}
//         autoComplete={autoComplete}
//         onChange={(e) => onChange(e.target.value)}
//         aria-invalid={!!error}
//         aria-describedby={error ? `${name}-error` : undefined}
//         className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--accent)]"
//       />
//       {error && (
//         <p id={`${name}-error`} role="alert" className="mt-1.5 text-xs text-red-400">
//           {error}
//         </p>
//       )}
//     </div>
//   );
// }













import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { siteConfig } from "@/data/site";

type EnterpriseRecaptchaApi = {
  ready: (callback: () => void) => void;
  render: (
    container: HTMLElement,
    parameters: {
      sitekey: string;
      action: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    }
  ) => number;
  reset: (widgetId?: number) => void;
};

declare global {
  interface Window {
    grecaptcha?: { enterprise?: EnterpriseRecaptchaApi };
  }
}

let enterpriseRecaptchaPromise: Promise<EnterpriseRecaptchaApi> | undefined;

function loadEnterpriseRecaptcha() {
  const existingApi = window.grecaptcha?.enterprise;
  if (existingApi) return Promise.resolve(existingApi);

  if (!enterpriseRecaptchaPromise) {
    enterpriseRecaptchaPromise = new Promise<EnterpriseRecaptchaApi>((resolve, reject) => {
      let script = document.querySelector<HTMLScriptElement>(
        'script[data-recaptcha-enterprise="true"]'
      );

      const onLoad = () => {
        if (script) script.dataset.loaded = "true";
        const api = window.grecaptcha?.enterprise;
        if (!api) {
          reject(new Error("Google reCAPTCHA Enterprise did not initialize."));
          return;
        }
        api.ready(() => resolve(api));
      };
      const onError = () => {
        script?.remove();
        reject(new Error("Google reCAPTCHA Enterprise failed to load."));
      };

      if (!script) {
        script = document.createElement("script");
        script.src = "https://www.google.com/recaptcha/enterprise.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.dataset.recaptchaEnterprise = "true";
        script.addEventListener("load", onLoad, { once: true });
        script.addEventListener("error", onError, { once: true });
        document.head.appendChild(script);
      } else if (script.dataset.loaded === "true") {
        onLoad();
      } else {
        script.addEventListener("load", onLoad, { once: true });
        script.addEventListener("error", onError, { once: true });
      }
    }).catch((error: unknown) => {
      enterpriseRecaptchaPromise = undefined;
      throw error;
    });
  }

  return enterpriseRecaptchaPromise;
}

type FormState = {
  name: string;
  email: string;
  projectType: string;
  message: string;
};

type Errors = Partial<Record<keyof FormState | "submit" | "captcha", string>>;

const initialState: FormState = { name: "", email: "", projectType: "Website / Frontend build", message: "" };

const projectTypes = [
  "Website / Frontend build",
  "React / Next.js application",
  "AI-powered feature or chatbot",
  "Something else",
];

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function Contact() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const resetCaptchaRef = useRef<() => void>(() => {});
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    const container = captchaContainerRef.current;
    if (!recaptchaSiteKey || !container) return;

    let active = true;
    loadEnterpriseRecaptcha()
      .then((api) => {
        if (!active) return;
        const widgetId = api.render(container, {
          sitekey: recaptchaSiteKey,
          action: "contact",
          callback: (token) => {
            setCaptchaToken(token);
            setErrors((current) => ({ ...current, captcha: undefined }));
          },
          "expired-callback": () => setCaptchaToken(null),
          "error-callback": () => {
            setCaptchaToken(null);
            setErrors((current) => ({
              ...current,
              captcha: "reCAPTCHA could not load. Please try again.",
            }));
          },
        });
        resetCaptchaRef.current = () => api.reset(widgetId);
      })
      .catch(() => {
        if (active) {
          setErrors((current) => ({
            ...current,
            captcha: "reCAPTCHA could not load. Please refresh and try again.",
          }));
        }
      });

    return () => {
      active = false;
      resetCaptchaRef.current = () => {};
    };
  }, [recaptchaSiteKey]);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.email.trim()) next.email = "Please enter your email.";
    else if (!isValidEmail(form.email)) next.email = "That doesn't look like a valid email.";
    if (!form.message.trim() || form.message.trim().length < 10)
      next.message = "Tell me a little about the project (10+ characters).";
    return next;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (!recaptchaSiteKey) {
      setErrors({ captcha: "reCAPTCHA is not configured." });
      return;
    }

    if (!captchaToken) {
      setErrors({ captcha: "Please complete the reCAPTCHA challenge." });
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, captchaToken }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        if (result.error === "captcha_rejected") {
          setErrors({ captcha: "reCAPTCHA verification failed. Please complete it again." });
        } else {
          const requestId = response.headers.get("X-Request-Id");
          setErrors({
            submit: requestId
              ? `Your message could not be sent. Reference: ${requestId}. Please try again later.`
              : "Your message could not be sent. Please try again later.",
          });
        }
        setStatus("idle");
        setCaptchaToken(null);
        resetCaptchaRef.current();
        return;
      }

      setForm(initialState);
      setCaptchaToken(null);
      resetCaptchaRef.current();
      setStatus("success");
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setStatus("idle");
      setCaptchaToken(null);
      resetCaptchaRef.current();
      setErrors({
        submit: "Your message could not be sent. Please try again later.",
      });
    }
  };

  if (status === "success") {
    return (
      <section id="contact" className="scroll-mt-16 border-b border-[var(--border)] py-24 sm:py-28" aria-label="Contact">
        <Container className="max-w-xl text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-[var(--accent)]" aria-hidden />
          <h2 className="mt-6 font-display text-2xl font-medium text-[var(--text)]">Message sent.</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
            Thanks for reaching out. Your message has been sent to{" "}
            <a href={siteConfig.social.email} className="text-[var(--accent)] hover:underline">
              {siteConfig.email}
            </a>
            .
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => {
                setForm(initialState);
                setStatus("idle");
              }}
              className="rounded-full border border-[var(--border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Send another message
            </button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id="contact" className="scroll-mt-16 py-24 sm:py-28" aria-label="Contact">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--accent)]">Contact</p>
            <h2 className="text-balance mt-4 font-display text-[clamp(2rem,4.4vw,3.2rem)] font-medium leading-[1.1] text-[var(--text)]">
              Have a project, product, or idea worth building?
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--text-muted)]">
              Send a few details below, or reach out directly. I read every message myself.
            </p>

            <div className="mt-10 space-y-3">
              <a
                href={siteConfig.social.email}
                className="group flex items-center gap-3 rounded-lg border border-[var(--border)] px-4 py-3.5 text-sm text-[var(--text)] transition-colors hover:border-[var(--accent)]"
              >
                <Mail className="h-4 w-4 text-[var(--text-faint)]" aria-hidden />
                {siteConfig.email}
                <ArrowUpRight className="ml-auto h-4 w-4 text-[var(--text-faint)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg border border-[var(--border)] px-4 py-3.5 text-sm text-[var(--text)] transition-colors hover:border-[var(--accent)]"
              >
                <LinkedInIcon className="h-4 w-4 text-[var(--text-faint)]" />
                Connect on LinkedIn
                <ArrowUpRight className="ml-auto h-4 w-4 text-[var(--text-faint)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </a>
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg border border-[var(--border)] px-4 py-3.5 text-sm text-[var(--text)] transition-colors hover:border-[var(--accent)]"
              >
                <GitHubIcon className="h-4 w-4 text-[var(--text-faint)]" />
                View GitHub profile
                <ArrowUpRight className="ml-auto h-4 w-4 text-[var(--text-faint)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </a>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
            aria-describedby={errors.submit ? "submit-error" : undefined}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Name"
                name="name"
                value={form.name}
                error={errors.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                autoComplete="name"
              />
              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                error={errors.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="projectType" className="block text-sm font-medium text-[var(--text)]">
                Project type
              </label>
              <select
                id="projectType"
                name="projectType"
                value={form.projectType}
                onChange={(e) => setForm((f) => ({ ...f, projectType: e.target.value }))}
                className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--accent)]"
              >
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[var(--text)]">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                className="mt-2 w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--accent)]"
                placeholder="What are you building?"
              />
              {errors.message && (
                <p id="message-error" role="alert" className="mt-1.5 text-xs text-red-400">
                  {errors.message}
                </p>
              )}
            </div>

            {recaptchaSiteKey ? (
              <div className="flex justify-start">
                <div ref={captchaContainerRef} />
              </div>
            ) : (
              <p className="text-xs text-red-400">reCAPTCHA is not configured.</p>
            )}
            {errors.captcha && (
              <p role="alert" className="text-xs text-red-400">
                {errors.captcha}
              </p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--text)] px-6 py-3.5 text-sm font-medium text-[var(--bg)] transition-colors hover:bg-[var(--accent)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {status === "sending" ? "Sending..." : "Submit"}
            </button>
            {errors.submit && (
              <p id="submit-error" role="alert" className="text-xs text-red-400">
                {errors.submit}
              </p>
            )}
            <p className="text-xs text-[var(--text-faint)]">
              Your message will be sent directly to my inbox.
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
}

function Field({
  label,
  name,
  value,
  error,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-[var(--text)]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--accent)]"
      />
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
