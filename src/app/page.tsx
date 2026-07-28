import Image from "next/image";
import Link from "next/link";
import { PixelBee, PixelFlower, PixelSun } from "@/components/PixelArt";

export default function HomePage() {
  return (
    <section className="relative min-h-[calc(100vh-7.5rem)] overflow-hidden">
      {/* Backmost: large sun */}
      <div
        className="pointer-events-none absolute -right-[12%] -top-[6%] z-0 sm:-right-[6%] sm:-top-[8%] lg:right-[2%] lg:-top-[10%]"
        aria-hidden
      >
        <PixelSun width={420} height={420} className="sm:scale-110 lg:scale-125" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_65%_35%,transparent_20%,var(--paper)_75%)]" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-7.5rem)] max-w-6xl items-center gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-4 lg:py-0">
        <div className="relative">
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

        <div className="relative flex h-[min(78vh,640px)] items-end justify-center lg:h-[min(88vh,760px)] lg:justify-end">
          {/* Tree — nearly full column height */}
          <div className="relative z-[2] flex h-full w-full max-w-[420px] flex-col items-center justify-end lg:max-w-[520px]">
            <div className="absolute right-[8%] top-[12%] z-[3]">
              <PixelBee width={48} height={34} />
            </div>

            <Image
              src="/art/tree.png"
              alt=""
              width={520}
              height={520}
              priority
              className="pixel h-[85%] w-auto max-w-full object-contain object-bottom"
            />

            {/* Flowers only at the base */}
            <div className="absolute bottom-[2%] left-[8%] z-[3] flex items-end gap-2 sm:left-[12%] sm:gap-3">
              <PixelFlower color="purple" width={34} height={44} />
              <PixelFlower color="rose" width={40} height={52} />
              <PixelFlower color="purple" width={28} height={36} />
              <PixelFlower color="amber" width={24} height={32} />
              <PixelFlower color="rose" width={30} height={40} />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 h-2 bg-ink" />
    </section>
  );
}
