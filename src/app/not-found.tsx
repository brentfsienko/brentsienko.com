import Link from "next/link";
import { PixelBee } from "@/components/PixelArt";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <div className="flex items-end gap-3">
        <PixelBee width={40} height={28} />
        <PixelBee width={56} height={40} className="bee-fly -scale-x-100" />
        <PixelBee width={36} height={26} />
      </div>
      <h1 className="mt-8 text-2xl font-bold">404</h1>
      <p className="mt-2 text-ink-soft">Nothing here — try another path.</p>
      <Link href="/" className="btn mt-8">
        home
      </Link>
    </div>
  );
}
