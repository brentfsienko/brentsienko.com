import Image from "next/image";
import Link from "next/link";
import { PixelTree } from "@/components/PixelArt";

export default function HomePage() {
  return (
    <section className="home-scene relative min-h-[calc(100vh-7.5rem)] overflow-hidden">
      {/* Pixel tree — left edge, canopy overhangs the title (behind copy). */}
      <div
        className="pointer-events-none absolute -left-[10%] bottom-2 -z-10 w-[min(88vw,520px)] sm:-left-[6%] sm:w-[min(70vw,560px)] lg:-left-[3%] lg:w-[580px]"
        aria-hidden
      >
        <PixelTree className="h-auto w-full" width={580} height={652} />
      </div>

      {/* Chair sits on the roots, just right of the trunk. */}
      <Image
        src="/art/pixel-chair.png"
        alt=""
        width={1024}
        height={1024}
        aria-hidden
        className="pixel pointer-events-none absolute bottom-7 z-[1] w-[84px] max-w-none select-none sm:bottom-9 sm:w-[108px] lg:w-[120px]"
        style={{ left: "clamp(10.5rem, 32vw, 19rem)" }}
        sizes="120px"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-7.5rem)] max-w-5xl flex-col justify-center px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          brent
          <br />
          sienko
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
          Friend of trees and bees and a good chair.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/work" className="btn btn-solid">
            see work
          </Link>
          <Link href="/blog" className="btn">
            read blog
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 h-2 bg-ink" />
    </section>
  );
}
