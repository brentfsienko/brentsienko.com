import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="home-scene relative min-h-[calc(100vh-7.5rem)] overflow-hidden">
      {/* Treehouse ~2× prior size; chair on the lawn just left of the pond. */}
      <div
        className="pointer-events-none absolute bottom-2 left-[-6%] z-0 aspect-square w-[min(100vw,760px)] sm:left-[-4%] sm:w-[min(92vw,840px)] lg:w-[880px]"
        aria-hidden
      >
        <Image
          src="/art/treehouse.png"
          alt=""
          fill
          priority
          className="object-contain object-left-bottom"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 880px"
        />
        {/* Pond is lower-right on the lawn — chair sits just beside it on the grass. */}
        <Image
          src="/art/pixel-chair.png"
          alt=""
          width={1024}
          height={1024}
          className="pixel absolute w-[11%] max-w-[96px] sm:max-w-[112px]"
          style={{
            left: "46%",
            bottom: "6%",
          }}
          sizes="112px"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-7.5rem)] max-w-5xl flex-col justify-center px-4 py-16 pl-[min(62vw,28rem)] sm:px-6 sm:pl-[min(56vw,34rem)] lg:pl-[36rem]">
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
