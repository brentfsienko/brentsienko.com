import Link from "next/link";
import { PixelBee, PixelFlower, PixelSun, PixelTree } from "@/components/PixelArt";

export default function HomePage() {
  return (
    <section className="relative min-h-[calc(100vh-8rem)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,var(--paper-deep)_0%,transparent_55%)]" />

      <div className="relative mx-auto grid max-w-5xl items-end gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-20 lg:pt-8">
        <div className="relative z-10">
          <p className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-ink-faint">
            <PixelSun width={28} height={28} />
            sketchbook
          </p>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            brent
            <br />
            sienko
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
            Software engineer. Mostly graphite. Occasional sun, flower, or bee.
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
            <PixelTree width={280} height={350} className="sm:w-[320px] sm:h-[400px]" />
            <div className="absolute -right-2 top-8 sm:right-4">
              <PixelBee width={48} height={34} />
            </div>
            <div className="absolute bottom-16 left-2 sm:left-0">
              <PixelFlower width={36} height={48} />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-2 bg-ink" />
    </section>
  );
}
