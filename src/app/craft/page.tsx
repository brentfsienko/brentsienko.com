import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Craft",
};

const sections = [
  {
    href: "/craft/ones-n-zeros",
    label: "ones n zeros",
    description: "things I've been building, in code.",
  },
  {
    href: "/craft/scribbles",
    label: "scribbles",
    description: "sketches, drawings, doodles.",
  },
  {
    href: "/craft/rags",
    label: "rags",
    description: "threads, fits, and the clothes I make.",
  },
  {
    href: "/craft/work",
    label: "work",
    description: "resume, links, and ways to get in touch.",
  },
];

export default function CraftPage() {
  return (
    <div>
      <h1 className="mb-10 text-3xl font-bold tracking-tight sm:text-4xl">craft</h1>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="group block h-full border-2 border-ink p-5 no-underline transition-colors duration-100 hover:bg-[#e8a317]"
            >
              <h2 className="text-lg font-bold text-ink group-hover:underline">{s.label}</h2>
              <p className="mt-2 text-sm text-ink-soft group-hover:text-ink">{s.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
