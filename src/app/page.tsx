import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="home-scene relative min-h-[calc(100vh-7.5rem)] overflow-hidden">
      {/* Tree sits behind everything; only the leftmost canopy hangs off-screen. */}
      <Image
        src="/art/pixel-tree.png"
        alt=""
        width={1024}
        height={959}
        priority
        aria-hidden
        className="pixel pointer-events-none absolute -left-[6%] bottom-2 -z-10 w-[min(120vw,960px)] max-w-none select-none sm:-left-[4%] sm:w-[min(100vw,900px)] lg:-left-[2%] lg:w-[840px]"
        sizes="(max-width: 640px) 120vw, (max-width: 1024px) 100vw, 840px"
      />

      {/* Chair sits bottom-left, just to the right of the trunk. */}
      <Image
        src="/art/pixel-chair.png"
        alt=""
        width={1024}
        height={1024}
        aria-hidden
        className="pixel pointer-events-none absolute bottom-6 z-[1] w-[84px] max-w-none select-none sm:bottom-8 sm:w-[108px] lg:w-[120px]"
        style={{ left: "clamp(14rem, 38vw, 26rem)" }}
        sizes="120px"
      />

      {/* Title stays in its original centered spot; tree canopy overhangs behind it. */}
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
