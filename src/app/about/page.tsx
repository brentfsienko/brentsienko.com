import type { Metadata } from "next";
import { PixelSun, PixelTree } from "@/components/PixelArt";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_auto]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">about</h1>
        <div className="mt-6 max-w-2xl space-y-4 leading-relaxed text-ink-soft">
          <p>
            I&apos;m Brent — software engineer, recently Coinbase (Retail Advanced
            Trading / US Derivatives), before that AWS Aurora PostgreSQL
            (Babelfish), Berkeley EECS.
          </p>
          <p>
            These days I&apos;m building small, opinionated products: coop Sudoku,
            a park-bench PWA called Benchmark, and whatever else fits in a
            sketchbook.
          </p>
          <p>
            Languages I reach for: Go, Python, TypeScript, SQL, C. Tools: Temporal,
            Kafka, gRPC, Supabase, Cursor.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <a href="/BrentSienkoResume.pdf" className="btn btn-solid" download>
            download resume
          </a>
          <a
            href="https://github.com/brentfsienko"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            github
          </a>
          <a
            href="https://linkedin.com/in/brent-sienko"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            linkedin
          </a>
          <a href="mailto:brent5@berkeley.edu" className="btn">
            email
          </a>
        </div>
      </div>

      <div className="hidden items-start gap-4 lg:flex">
        <PixelSun />
        <PixelTree width={140} height={180} />
      </div>
    </div>
  );
}
