import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ProjectRow } from "@/components/work/ProjectRow";
import { Reveal } from "@/components/ui/Reveal";
import { projects } from "@/data/projects";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import pageMetadata from "@/data/pageMetadata.json";
import { cn } from "@/utils/cn";

const filters = ["All", "React", "Websites", "Dashboards / Tools"] as const;

function matchesFilter(filter: (typeof filters)[number], techs: string[], category: string) {
  if (filter === "All") return true;
  if (filter === "React") return techs.includes("React");
  if (filter === "Dashboards / Tools") return /dashboard|tool/i.test(category);
  return /website|brand|catalogue|retail|service|healthcare/i.test(category);
}

export default function Work() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  useDocumentMeta({
    ...pageMetadata.work,
  });

  const visible = useMemo(
    () => projects.filter((p) => matchesFilter(filter, p.technologies, p.category)),
    [filter]
  );

  return (
    <main id="main" className="pt-8">
      <Container className="pb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back home
        </Link>

        <h1 className="text-balance mt-8 max-w-2xl font-display text-[clamp(2.2rem,5vw,3.6rem)] font-medium leading-[1.08] text-[var(--text)]">
          Selected work
        </h1>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--text-muted)]">
          Nine frontend projects, including React applications, dashboards, and responsive marketing and brand websites.
        </p>

        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                filter === f
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text)]"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text)]"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </Container>

      <Container className="pb-28">
        <ul>
          {visible.map((project, i) => (
            <ProjectRow key={project.id} project={project} index={i} />
          ))}
        </ul>
        {visible.length === 0 && (
          <Reveal className="py-16 text-center text-sm text-[var(--text-muted)]">
            No projects match this filter yet.
          </Reveal>
        )}
      </Container>
    </main>
  );
}
