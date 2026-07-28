import Link from "next/link";
import Image from "next/image";
import { PixelFlower } from "@/components/PixelArt";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <div className="relative">
        <Image
          src="/art/tree.png"
          alt=""
          width={160}
          height={160}
          className="pixel h-auto w-[160px] object-contain"
        />
        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-end gap-1">
          <PixelFlower color="purple" width={18} height={24} />
          <PixelFlower color="rose" width={20} height={26} />
        </div>
      </div>
      <h1 className="mt-8 text-2xl font-bold">404</h1>
      <p className="mt-2 text-ink-soft">Nothing here — try another path.</p>
      <Link href="/" className="btn mt-8">
        home
      </Link>
    </div>
  );
}
