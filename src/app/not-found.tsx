import Link from "next/link";
import { PixelTree } from "@/components/PixelArt";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <PixelTree width={120} height={150} />
      <h1 className="mt-8 text-2xl font-bold">404</h1>
      <p className="mt-2 text-ink-soft">Nothing drawn here.</p>
      <Link href="/" className="btn mt-8">
        home
      </Link>
    </div>
  );
}
