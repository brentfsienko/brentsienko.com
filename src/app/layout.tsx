import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Brent Sienko",
    template: "%s · Brent Sienko",
  },
  description:
    "Friend of trees and bees and a good chair. Building Sudoku, Benchmark, and other small tools.",
  metadataBase: new URL("https://brentsienko.com"),
  openGraph: {
    title: "Brent Sienko",
    description: "Friend of trees and bees and a good chair.",
    url: "https://brentsienko.com",
    siteName: "Brent Sienko",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrains.variable} h-full`}>
      <body className="paper-grain flex min-h-full flex-col font-mono text-ink antialiased">
        <SiteHeader />
        <main className="relative z-10 flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
