import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="home-scene relative min-h-[calc(100vh-7.5rem)] overflow-hidden">
      {/* Treehouse spans nearly header rule → bottom rule; chair sits on the lawn by the pond. */}
      <div
        className="pointer-events-none absolute bottom-2 left-0 top-3 z-0 w-[min(52vw,380px)] sm:w-[min(46vw,420px)] lg:w-[440px]"
        aria-hidden
      >
        <Image
          src="/art/treehouse.png"
          alt=""
          fill
          priority
          className="object-contain object-left-bottom"
          sizes="(max-width: 640px) 52vw, (max-width: 1024px) 46vw, 440px"
        />
        {/* Pond sits on the lower-right of the lawn patch in the art. */}
        <Image
          src="/art/pixel-chair.png"
          alt=""
          width={1024}
          height={1024}
          className="pixel absolute w-[14%] max-w-[72px] sm:max-w-[88px]"
          style={{
            left: "58%",
            bottom: "5.5%",
          }}
          sizes="88px"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-7.5rem)] max-w-5xl flex-col justify-center px-4 py-16 pl-[min(54vw,22rem)] sm:px-6 sm:pl-[min(48vw,26rem)] lg:pl-[28rem]">
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
