import Link from "next/link";
import { BeeSwarm } from "@/components/BeeSwarm";

export default function HomePage() {
  return (
    <section className="relative min-h-[calc(100vh-7.5rem)] overflow-hidden">
      <BeeSwarm />

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
