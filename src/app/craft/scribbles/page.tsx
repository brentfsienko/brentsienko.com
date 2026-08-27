import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Craft — Scribbles",
};

export default function ScribblesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">scribbles</h1>
        <p className="mt-3 max-w-xl text-ink-soft">sketches, drawings, doodles — coming soon.</p>
      </div>
    </div>
  );
}
