"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/craft/ones-n-zeros", label: "ones n zeros" },
  { href: "/craft/scribbles", label: "scribbles" },
  { href: "/craft/rags", label: "rags" },
  { href: "/craft/work", label: "work" },
];

export default function CraftLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex gap-12">
        {/* Vertical sidebar nav */}
        <nav className="hidden shrink-0 sm:block">
          <ul className="space-y-1">
            {tabs.map((tab) => {
              const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
              return (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    className={`block rounded-sm px-3 py-1.5 text-sm transition-colors duration-100 ${
                      active
                        ? "bg-[#ffe87c] font-bold text-ink"
                        : "text-ink-soft hover:bg-[#ffe87c]/40 hover:text-ink"
                    }`}
                  >
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile: horizontal scroll tabs */}
        <nav className="mb-8 sm:hidden w-full">
          <ul className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
              return (
                <li key={tab.href} className="shrink-0">
                  <Link
                    href={tab.href}
                    className={`block rounded-sm px-3 py-1.5 text-sm transition-colors duration-100 ${
                      active
                        ? "bg-[#ffe87c] font-bold text-ink"
                        : "text-ink-soft hover:bg-[#ffe87c]/40 hover:text-ink"
                    }`}
                  >
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Page content */}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
