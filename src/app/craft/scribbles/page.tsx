import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Craft — Scribbles",
};

export default function ScribblesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">scribbles</h1>
      <p className="mt-3 max-w-xl text-ink-soft">sketches, drawings, doodles — coming soon.</p>
    </div>
  );
}
