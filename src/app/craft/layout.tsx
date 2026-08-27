"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/craft/ones-n-zeros", label: "ones n zeros" },
  { href: "/craft/scribbles", label: "scribbles" },
  { href: "/craft/rags", label: "rags" },
  { href: "/craft/work", label: "work" },
];

function TabLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-sm px-3 py-1.5 text-sm transition-colors duration-100 ${
        active
          ? "bg-[#e8a317] font-bold text-ink"
          : "text-ink-soft hover:bg-[#e8a317]/40 hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}

export default function CraftLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-5xl px-4 pb-8 pt-16 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-12">
        <nav className="hidden shrink-0 sm:block">
          <ul className="space-y-1">
            {tabs.map((tab) => (
              <li key={tab.href}>
                <TabLink
                  href={tab.href}
                  label={tab.label}
                  active={pathname === tab.href || pathname.startsWith(`${tab.href}/`)}
                />
              </li>
            ))}
          </ul>
        </nav>

        <nav className="-mx-4 overflow-x-auto px-4 sm:hidden">
          <ul className="flex w-max gap-1 pb-1">
            {tabs.map((tab) => (
              <li key={tab.href} className="shrink-0">
                <TabLink
                  href={tab.href}
                  label={tab.label}
                  active={pathname === tab.href || pathname.startsWith(`${tab.href}/`)}
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 w-full flex-1">{children}</div>
      </div>
    </div>
  );
}
