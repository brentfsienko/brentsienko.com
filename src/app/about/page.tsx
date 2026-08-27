import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">about</h1>
      <div className="mt-6 max-w-2xl space-y-4 leading-relaxed text-ink-soft">
        <p>
          Hi, I&apos;m Brent. Friend of bees and trees and very recently, the
          most trustworthy chair. Here&apos;s a little slice of my life! I hope
          you find it as tasty as I have.
        </p>
      </div>
    </div>
  );
}
