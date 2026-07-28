import type { Metadata } from "next";
import { BeeSwarm } from "@/components/BeeSwarm";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      <BeeSwarm className="opacity-40" />
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">about</h1>
        <div className="mt-6 max-w-2xl space-y-4 leading-relaxed text-ink-soft">
          <p>
            Hi, I&apos;m Brent. Friend of trees and bees and a good chair. I have
            been bopping around quite a bit lately. Sometimes in the mountains.
            Sometimes in the garden. Sometimes walking laps inside Grocery Outlet.
          </p>
          <p>
            These are some things I&apos;ve been working on over the years, I hope
            you enjoy :)
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
    </div>
  );
}
