import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Craft",
};

type Card = {
  key: string;
  href: string;
  external?: boolean;
  title: string;
  description: string;
  src: string;
  alt: string;
  /** "contain" shows the whole picture; "top" fills the box from the top (for the resume page). */
  fit: "contain" | "top";
  pixel?: boolean;
  bg: string;
};

const cards: Card[] = [
  ...projects.map<Card>((p) => ({
    key: p.slug,
    href: `/work/${p.slug}`,
    title: p.name,
    description: p.tagline,
    src: p.logoSrc,
    alt: `${p.name} logo`,
    fit: "contain",
    pixel: p.logoSrc.endsWith(".jpg"),
    bg: "bg-paper",
  })),
  {
    key: "gush",
    href: "https://gush.supply",
    external: true,
    title: "GÜSH",
    description: "Small batch clothing, designed and sewn by hand in Seattle.",
    src: "/gush-hearts.png",
    alt: "GÜSH hearts logo",
    fit: "contain",
    bg: "bg-white",
  },
  {
    key: "work",
    href: "/craft/work",
    title: "resume",
    description: "Resume, links, and ways to get in touch.",
    src: "/art/resume-thumb.png",
    alt: "first page of my resume",
    fit: "top",
    bg: "bg-white",
  },
];

export default function CraftPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">craft</h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Things I&apos;ve made — plus everything else on{" "}
          <a href="https://github.com/brentfsienko" target="_blank" rel="noopener noreferrer">
            github.com/brentfsienko
          </a>
          .
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <li key={c.key}>
            <Link
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex h-full flex-col border-2 border-ink no-underline transition-colors duration-100 hover:bg-[#e8a317]"
            >
              <div
                className={`relative aspect-[4/3] overflow-hidden border-b-2 border-ink ${c.bg}`}
              >
                {c.fit === "top" ? (
                  <Image
                    src={c.src}
                    alt={c.alt}
                    fill
                    sizes="(min-width: 1024px) 240px, 50vw"
                    className="object-cover object-top transition-transform duration-200 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-3 sm:inset-5">
                    <Image
                      src={c.src}
                      alt={c.alt}
                      fill
                      sizes="(min-width: 1024px) 200px, 45vw"
                      className={`rounded-lg object-contain transition-transform duration-200 group-hover:scale-105 ${
                        c.pixel ? "pixel" : ""
                      }`}
                    />
                  </div>
                )}
              </div>
              <div className="p-3 sm:p-5">
                <h2 className="text-base font-bold text-ink group-hover:underline sm:text-lg">
                  {c.title}
                  {c.external && <span className="ml-1 text-ink-faint group-hover:text-ink">↗</span>}
                </h2>
                <p className="mt-2 text-sm text-ink-soft group-hover:text-ink">{c.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
