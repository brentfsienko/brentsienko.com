import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work",
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">work</h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Some things I&apos;ve been working on — plus everything else on{" "}
          <a
            href="https://github.com/brentfsienko"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/brentfsienko
          </a>
          .
        </p>
      </div>

      <ul className="divide-y-2 divide-ink border-y-2 border-ink">
        {projects.map((project) => (
          <li key={project.slug} className="py-8">
            <Link
              href={`/work/${project.slug}`}
              className="group flex items-start gap-5 no-underline sm:gap-6"
            >
              <Image
                src={project.logoSrc}
                alt={`${project.name} logo`}
                width={72}
                height={72}
                className="pixel h-[72px] w-[72px] shrink-0 rounded-lg border-2 border-ink object-cover"
              />
              <div className="min-w-0">
                <h2 className="text-2xl font-bold group-hover:underline">
                  {project.name}
                </h2>
                <p className="mt-2 max-w-2xl text-ink-soft">{project.tagline}</p>
                <p className="mt-3 text-xs uppercase tracking-widest text-ink-faint">
                  open →
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
