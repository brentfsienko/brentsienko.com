import Link from "next/link";
import { PixelFlower, SketchTree } from "@/components/PixelArt";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <SketchTree width={120} height={150} />
      <div className="mt-2 flex gap-3">
        <PixelFlower color="purple" width={22} height={28} />
        <PixelFlower color="rose" width={22} height={28} />
      </div>
      <h1 className="mt-8 text-2xl font-bold">404</h1>
      <p className="mt-2 text-ink-soft">Nothing here — try another path.</p>
      <Link href="/" className="btn mt-8">
        home
      </Link>
    </div>
  );
}
