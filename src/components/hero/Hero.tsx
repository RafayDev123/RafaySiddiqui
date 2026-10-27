import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import gsap from "@/lib/gsap";
import { GitHubIcon } from "@/components/icons";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";
import { useMotionPreference } from "@/lib/MotionPreferenceContext";
import { useSectionNav } from "@/lib/useSectionNav";

const techSignals = [
  "React.js",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "GSAP",
  "AI-Powered Dev",
];

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPreference();
  const goToSection = useSectionNav();

  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>("[data-hero-reveal]");
      if (reduced) {
        gsap.set(els, { opacity: 1, y: 0 });
        return;
      }
      gsap.set(els, { opacity: 0, y: 24 });
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.9 },
        delay: 0.15,
      });
      tl.to(
        glowRef.current,
        { opacity: 1, duration: 1.4, ease: "power2.out" },
        0,
      ).to(els, { opacity: 1, y: 0, stagger: 0.12 }, 0.2);
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  // Subtle cursor-reactive lighting on capable desktop devices only.
  useGSAP(
    () => {
      if (reduced || !glowRef.current) return;
      const canHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      ).matches;
      if (!canHover) return;
      const moveX = gsap.quickTo(glowRef.current, "--x", {
        duration: 0.6,
        ease: "power3.out",
      });
      const moveY = gsap.quickTo(glowRef.current, "--y", {
        duration: 0.6,
        ease: "power3.out",
      });
      const handler = (e: MouseEvent) => {
        const rect = rootRef.current?.getBoundingClientRect();
        if (!rect) return;
        moveX(((e.clientX - rect.left) / rect.width) * 100);
        moveY(((e.clientY - rect.top) / rect.height) * 100);
      };
      window.addEventListener("mousemove", handler);
      return () => window.removeEventListener("mousemove", handler);
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={rootRef}
      id="home"
      className="relative flex min-h-[92vh] items-center overflow-hidden border-b border-[var(--border)]"
      aria-label="Introduction"
    >
      <div
        className="bg-grid pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
      />
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity"
        style={
          {
            "--x": "70%",
            "--y": "20%",
            background:
              "radial-gradient(600px circle at var(--x) var(--y), var(--accent-soft), transparent 70%)",
          } as React.CSSProperties
        }
        aria-hidden="true"
      />

      <Container className="relative py-28 text-center sm:py-32">
        <div
          data-hero-reveal
          className="mb-8 flex items-center justify-center gap-2.5"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            {siteConfig.availability}
          </p>
        </div>

        <h1
          data-hero-reveal
          className="text-balance mx-auto max-w-4xl font-display text-[clamp(2.4rem,7vw,5.2rem)] font-medium leading-[1.03] text-[var(--text)]"
        >
          Frontend developer turning designs into{" "}
          <span className="text-[var(--accent)]">real, working products.</span>
        </h1>

        <p
          data-hero-reveal
          className="text-balance mx-auto mt-7 w-full md:w-[60%] text-base leading-relaxed text-[var(--text-muted)] sm:text-lg"
        >
          {siteConfig.subhead}
        </p>

        <div
          data-hero-reveal
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/work"
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-6 py-3 text-sm font-medium text-[var(--bg)] transition-all hover:bg-[var(--accent)] hover:text-white"
          >
            View selected work
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </Link>
          <button
            onClick={() => goToSection("contact")}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-6 py-3 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Let's work together
          </button>
          {/* <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-2 py-3 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
          >
            <GitHubIcon className="h-4 w-4" /> View GitHub
          </a> */}
        </div>

        <div
          data-hero-reveal
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-[var(--border)] pt-6"
        >
          {techSignals.map((tech) => (
            <span
              key={tech}
              className="font-mono text-xs tracking-wide text-[var(--text-faint)]"
            >
              {tech}
            </span>
          ))}
        </div>
      </Container>

      <button
        onClick={() => goToSection("work")}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[var(--text-faint)] transition-colors hover:text-[var(--text)] sm:flex"
        aria-label="Scroll to explore selected work"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">
          Scroll
        </span>
        <ChevronDown
          className="h-4 w-4 animate-bounce motion-reduce:animate-none"
          aria-hidden
        />
      </button>
    </section>
  );
}
