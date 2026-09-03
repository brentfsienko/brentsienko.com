import Link from "next/link";
import { HomeGround } from "@/components/HomeGround";

export default function HomePage() {
  return (
    <section className="home-scene relative">
      <HomeGround />

      <div className="relative z-10 flex min-h-0 w-full max-w-none flex-1 flex-col items-start justify-center px-4 py-8 sm:px-8 lg:px-12 xl:pl-16">
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
    </section>
  );
}
