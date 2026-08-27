import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Craft — Rags",
};

export default function RagsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">rags</h1>
      <p className="mt-3 max-w-xl text-ink-soft">threads, fits, things I wear — coming soon.</p>
    </div>
  );
}
