"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PixelHive } from "@/components/PixelArt";

const links = [
  { href: "/craft", label: "craft" },
  { href: "/blog", label: "blog" },
  { href: "/moosic", label: "moosic" },
  { href: "/about", label: "about" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="relative z-20 border-b-2 border-ink">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="text-sm font-bold tracking-tight no-underline hover:opacity-70">
          brent sienko
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm sm:gap-6">
          {links.map((link) => {
            const current =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                aria-current={current ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Hive hangs from the header rule (branch sits on the ink line). */}
      <div
        className="pointer-events-none absolute right-3 top-full z-40 -translate-y-[2px] sm:right-5"
        aria-hidden
      >
        <div className="relative" style={{ width: 64, height: 72 }}>
          <PixelHive width={64} height={72} />
          <span
            id="bee-hive-entrance"
            className="absolute"
            style={{
              left: `${(14 / 28) * 100}%`,
              top: `${(22 / 32) * 100}%`,
              width: 8,
              height: 8,
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-ink bg-paper">
      <div className="mx-auto max-w-5xl px-4 py-2 sm:px-6">
        <blockquote className="max-w-2xl text-xs text-ink-soft">
          <p className="leading-snug">
            “This is not our world with trees in it. It&apos;s a world of trees, where humans have just arrived.”
            {" "}<span className="text-ink-faint">― Richard Powers, <cite className="not-italic">The Overstory</cite></span>
          </p>
        </blockquote>
      </div>
    </footer>
  );
}
