import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PixelBee, PixelSun } from "@/components/PixelArt";
import { getProject, projects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.name, description: project.tagline };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href="/work" className="text-sm text-ink-faint no-underline hover:text-ink">
        ← work
      </Link>

      <div className="mt-6 flex items-start justify-between gap-4">
        <h1 className="text-4xl font-bold tracking-tight">{project.name}</h1>
        {slug === "sudoku" ? <PixelBee /> : <PixelSun />}
      </div>

      <p className="mt-4 text-lg text-ink-soft">{project.tagline}</p>
      <p className="mt-6 leading-relaxed text-ink-soft">{project.description}</p>

      <p className="mt-8 text-xs uppercase tracking-widest text-ink-faint">
        stack
      </p>
      <p className="mt-2 text-sm">{project.stack.join(" · ")}</p>

      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-solid"
        >
          open live
        </a>
        {project.repoUrl ? (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            source
          </a>
        ) : (
          <span className="btn pointer-events-none opacity-60">
            source on request
          </span>
        )}
      </div>
    </div>
  );
}
