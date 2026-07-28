import type { Metadata } from "next";
import Image from "next/image";
import { PixelFlower } from "@/components/PixelArt";

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

      <div className="relative hidden w-[220px] lg:block">
        <Image
          src="/art/tree.png"
          alt=""
          width={220}
          height={220}
          className="pixel h-auto w-full object-contain"
        />
        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-end gap-1">
          <PixelFlower color="purple" width={22} height={28} />
          <PixelFlower color="rose" width={26} height={34} />
          <PixelFlower color="purple" width={20} height={26} />
        </div>
      </div>
    </div>
  );
}
