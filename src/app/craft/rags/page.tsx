import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Craft — Rags",
};

export default function RagsPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">rags</h1>
        <p className="mt-3 max-w-xl text-ink-soft">threads, fits, things I wear, and the clothes I make.</p>
      </div>

      <ul className="divide-y-2 divide-ink border-y-2 border-ink">
        <li className="py-8">
          <a
            href="https://gush.supply"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-5 no-underline sm:gap-6"
          >
            <Image
              src="/gush-hearts.png"
              alt="GÜSH logo"
              width={72}
              height={72}
              className="h-[72px] w-[72px] shrink-0 rounded-lg border-2 border-ink bg-white object-contain p-1.5"
            />
            <div className="min-w-0">
              <h2 className="text-2xl font-bold group-hover:underline">GÜSH</h2>
              <p className="mt-2 max-w-2xl text-ink-soft">
                Small batch clothing, designed and sewn by hand in Seattle.
              </p>
              <p className="mt-3 text-xs uppercase tracking-widest text-ink-faint">gush.supply →</p>
            </div>
          </a>
        </li>
      </ul>
    </div>
  );
}
