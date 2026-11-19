import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Craft",
};

type Thumb = { src: string; alt: string; pixel?: boolean };

const sections: {
  href: string;
  label: string;
  description: string;
  thumbs: Thumb[];
  /** "contain" shows the whole picture; "top" fills the box from the top (for the resume page). */
  fit: "contain" | "top";
  bg: string;
}[] = [
  {
    href: "/craft/ones-n-zeros",
    label: "ones n zeros",
    description: "things I've been building, in code.",
    thumbs: [
      { src: "/art/sudoku-logo.jpg", alt: "sudoku logo", pixel: true },
      { src: "/art/benchmark-logo.png", alt: "benchmark logo" },
    ],
    fit: "contain",
    bg: "bg-paper",
  },
  {
    href: "/craft/scribbles",
    label: "scribbles",
    description: "sketches, drawings, doodles.",
    thumbs: [{ src: "/art/tree.png", alt: "pixel tree drawing", pixel: true }],
    fit: "contain",
    bg: "bg-white",
  },
  {
    href: "/craft/rags",
    label: "rags",
    description: "threads, fits, and the clothes I make.",
    thumbs: [{ src: "/gush-hearts.png", alt: "GÜSH hearts logo" }],
    fit: "contain",
    bg: "bg-white",
  },
  {
    href: "/craft/work",
    label: "work",
    description: "resume, links, and ways to get in touch.",
    thumbs: [{ src: "/art/resume-thumb.png", alt: "first page of my resume" }],
    fit: "top",
    bg: "bg-white",
  },
];

export default function CraftPage() {
  return (
    <div>
      <h1 className="mb-10 text-3xl font-bold tracking-tight sm:text-4xl">craft</h1>

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {sections.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="group flex h-full flex-col border-2 border-ink no-underline transition-colors duration-100 hover:bg-[#e8a317]"
            >
              <div
                className={`relative flex aspect-[4/3] items-center justify-center gap-2 overflow-hidden sm:gap-3 border-b-2 border-ink ${s.bg} ${
                  s.fit === "contain" ? "p-3 sm:p-5" : ""
                }`}
              >
                {s.fit === "top" ? (
                  <Image
                    src={s.thumbs[0].src}
                    alt={s.thumbs[0].alt}
                    fill
                    sizes="(min-width: 1024px) 240px, 50vw"
                    className="object-cover object-top transition-transform duration-200 group-hover:scale-[1.03]"
                  />
                ) : (
                  s.thumbs.map((t) => (
                    <div key={t.src} className="relative h-full flex-1">
                      <Image
                        src={t.src}
                        alt={t.alt}
                        fill
                        sizes="(min-width: 1024px) 120px, 25vw"
                        className={`object-contain transition-transform duration-200 group-hover:scale-105 ${
                          t.pixel ? "pixel" : ""
                        } ${s.thumbs.length > 1 ? "rounded-lg" : ""}`}
                      />
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 sm:p-5">
                <h2 className="text-base font-bold sm:text-lg text-ink group-hover:underline">{s.label}</h2>
                <p className="mt-2 text-sm text-ink-soft group-hover:text-ink">{s.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
