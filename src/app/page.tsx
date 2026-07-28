import Link from "next/link";
import {
  PixelBee,
  PixelFlower,
  PixelGecko,
  PixelSun,
  SketchTree,
} from "@/components/PixelArt";

export default function HomePage() {
  return (
    <section className="relative min-h-[calc(100vh-8rem)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,var(--paper-deep)_0%,transparent_55%)]" />

      <div className="pointer-events-none absolute left-6 top-24 hidden sm:block">
        <PixelFlower color="purple" width={28} height={36} />
      </div>
      <div className="pointer-events-none absolute right-10 top-36 hidden md:block">
        <PixelFlower color="rose" width={24} height={32} />
      </div>
      <div className="pointer-events-none absolute bottom-28 left-[12%] hidden lg:block">
        <PixelFlower color="purple" width={22} height={28} />
      </div>

      <div className="relative mx-auto grid max-w-5xl items-end gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-20 lg:pt-8">
        <div className="relative z-10">
          <p className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-ink-faint">
            <PixelSun width={28} height={28} />
            <PixelFlower color="purple" width={20} height={26} />
          </p>
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

        <div className="relative flex justify-center lg:justify-end">
          <div className="relative">
            <SketchTree width={280} height={360} className="sm:w-[320px] sm:h-[400px]" />
            <div className="absolute -right-2 top-8 sm:right-4">
              <PixelBee width={48} height={34} />
            </div>
            <div className="absolute bottom-20 left-0 sm:-left-2">
              <PixelFlower color="rose" width={36} height={48} />
            </div>
            <div className="absolute bottom-24 right-2 sm:right-6">
              <PixelFlower color="purple" width={30} height={40} />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 sm:left-[42%]">
              <PixelGecko width={88} height={58} />
            </div>
            <div className="absolute left-8 top-20 hidden sm:block">
              <PixelFlower color="amber" width={22} height={28} />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-2 bg-ink" />
    </section>
  );
}
