import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/data/site";
import { useSectionNav } from "@/lib/useSectionNav";

const facts = [
  { label: "Based in", value: siteConfig.location },
  { label: "Focused on", value: "React, Next.js, TypeScript" },
  { label: "Currently at", value: "Sidz Solution" },
  { label: "Also exploring", value: "AI-powered web development" },
];

export function About() {
  const goToSection = useSectionNav();
  return (
    <section id="about" className="scroll-mt-16 border-b border-[var(--border)] py-24 sm:py-28" aria-label="About">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--accent)]">About</p>
            <div className="mt-8 h-52 w-52 max-w-full overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] sm:h-56 sm:w-56">
              <img src="/profile.jpg" alt="Rafay Siddiqui" className="h-full w-full object-cover" />
            </div>
            <dl className="mt-10 space-y-5">
              {facts.map((fact) => (
                <div key={fact.label} className="flex justify-between gap-4 border-t border-[var(--border)] pt-3 first:border-t-0 first:pt-0">
                  <dt className="font-mono text-xs uppercase tracking-wide text-[var(--text-faint)]">{fact.label}</dt>
                  <dd className="text-right text-sm text-[var(--text)]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div>
            <Reveal>
              <h2 className="text-balance font-display text-[clamp(1.9rem,3.6vw,2.8rem)] font-medium leading-[1.15] text-[var(--text)]">
                Built through experience, not just theory.
              </h2>
            </Reveal>

            <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-[var(--text-muted)]">
              <Reveal as="div" delay={0.06}>
                <p>
                 I’m Rafay Siddiqui, a frontend and web developer based in Hyderabad, Pakistan. My day-to-day work focuses on turning Figma designs and ideas into responsive, production-ready web interfaces using React, Next.js, TypeScript, and modern frontend technologies. I make sure the final product works smoothly across screen sizes, browsers, and real-world use cases.
                </p>
              </Reveal>
              <Reveal as="div" delay={0.12}>
                <p>
                 I care about what happens between “the design looks finished” and “the product actually works.” Responsive breakpoints, reusable components, accessibility, performance, loading states, and those small details that often get overlooked are what turn a good interface into a polished product. That’s where I put most of my frontend thinking.
                </p>
              </Reveal>
              <Reveal as="div" delay={0.18}>
                <p>
                  Outside of client work, I’m constantly building with React and Next.js and exploring new ways to improve my development workflow. I use AI-assisted tools, generative AI, and coding agents to move faster from idea to working product while keeping the code clean, maintainable, scalable, and ready for production.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.24} className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/work"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-6 py-3 text-sm font-medium text-[var(--bg)] transition-colors hover:bg-[var(--accent)] hover:text-white"
              >
                View work <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
              <button
                onClick={() => goToSection("contact")}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-6 py-3 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Get in touch
              </button>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
