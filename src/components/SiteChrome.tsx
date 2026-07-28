"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PixelHive } from "@/components/PixelArt";

const links = [
  { href: "/work", label: "work" },
  { href: "/blog", label: "blog" },
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
          <a
            href="/BrentSienkoResume.pdf"
            className="btn btn-solid !px-3 !py-1.5 !text-xs !shadow-[2px_2px_0_var(--ink)]"
            download
          >
            resume
          </a>
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
    <footer className="relative z-10 mt-auto border-t-2 border-ink">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>trees · bees · a good chair</p>
        <div className="flex gap-4">
          <a
            href="https://github.com/brentfsienko"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/brentfsienko
          </a>
          <a href="mailto:brent5@berkeley.edu">email</a>
        </div>
      </div>
    </footer>
  );
}
