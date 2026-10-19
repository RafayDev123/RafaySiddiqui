import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

export default function NotFound() {
  useDocumentMeta({
    title: "Page Not Found — Rafay Siddiqui",
    description: "This page doesn't exist.",
    path: "/404",
    indexable: false,
  });

  return (
    <main id="main" className="flex min-h-[80vh] items-center">
      <Container className="text-center">
        <p className="font-display text-8xl text-[var(--accent)]">404</p>
        <h1 className="mt-6 font-display text-2xl font-medium text-[var(--text)]">
          Looks like this route didn't make the build.
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-[var(--text-muted)]">
          The page you're looking for doesn't exist, or has moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-6 py-3 text-sm font-medium text-[var(--bg)] transition-colors hover:bg-[var(--accent)] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back home
          </Link>
          <Link
            to="/work"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-6 py-3 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            View work
          </Link>
        </div>
      </Container>
    </main>
  );
}
