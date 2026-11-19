"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CraftLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const onIndex = pathname === "/craft";

  return (
    <div className="mx-auto max-w-5xl px-4 pb-8 pt-16 sm:px-6 sm:py-16">
      {!onIndex && (
        <Link
          href="/craft"
          className="mb-8 inline-block text-sm text-ink-soft no-underline hover:text-ink"
        >
          ← craft
        </Link>
      )}
      <div className="min-w-0 w-full">{children}</div>
    </div>
  );
}
