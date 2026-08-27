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
      <nav className="border-b border-ink">
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 sm:px-6">
          {tabs.map((tab) => {
            const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`shrink-0 rounded-t-sm px-4 py-2.5 text-sm font-medium transition-colors duration-100 ${
                  active
                    ? "bg-[#ffe87c] text-ink"
                    : "text-ink-soft hover:bg-[#ffe87c]/40 hover:text-ink"
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
