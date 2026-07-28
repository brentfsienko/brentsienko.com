import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="home-scene relative min-h-[calc(100vh-7.5rem)] overflow-hidden">
      {/* Tree hangs off the left; canopy fills the upper-left above the title. */}
      <Image
        src="/art/pixel-tree.png"
        alt=""
        width={1024}
        height={1024}
        priority
        aria-hidden
        className="pixel pointer-events-none absolute -left-[34%] bottom-2 z-0 w-[min(92vw,640px)] max-w-none select-none sm:-left-[22%] sm:w-[min(78vw,580px)] lg:-left-[14%] lg:w-[560px]"
        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 78vw, 560px"
      />

      {/* Chair sits bottom-left, just to the right of the trunk. */}
      <Image
        src="/art/pixel-chair.png"
        alt=""
        width={1024}
        height={1024}
        aria-hidden
        className="pixel pointer-events-none absolute bottom-6 z-[1] w-[84px] max-w-none select-none sm:bottom-8 sm:w-[108px] lg:w-[120px]"
        style={{ left: "clamp(9.5rem, 30vw, 17.5rem)" }}
        sizes="120px"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-7.5rem)] max-w-5xl flex-col justify-end px-4 pb-32 pt-[min(48vh,22rem)] sm:px-6 sm:pb-36 sm:pt-[min(44vh,24rem)] lg:justify-center lg:pb-28 lg:pl-[min(48%,26rem)] lg:pt-36">
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
