"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/craft/ones-n-zeros", label: "ones n zeros" },
  { href: "/craft/scribbles", label: "scribbles" },
  { href: "/craft/rags", label: "rags" },
];

export default function CraftLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      <nav className="border-b-2 border-ink">
        <div className="mx-auto flex max-w-5xl gap-6 overflow-x-auto px-4 sm:px-6">
          {tabs.map((tab) => {
            const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`shrink-0 border-b-2 py-3 text-sm transition-colors ${
                  active
                    ? "-mb-[2px] border-ink font-bold text-ink"
                    : "border-transparent text-ink-soft hover:text-ink"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
      {children}
    </div>
  );
}
