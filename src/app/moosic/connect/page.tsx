import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isBlogAuthed } from "@/lib/blog-auth";
import { RadioLoginForm } from "./RadioLoginForm";

export const metadata: Metadata = { title: "Radio connect" };

export default async function RadioConnectPage() {
  const authed = await isBlogAuthed();
  if (authed) redirect("/api/radio/connect");

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <p className="mb-2 text-xs uppercase tracking-widest text-ink-faint">radio</p>
      <h1 className="mb-6 text-2xl font-bold">connect spotify</h1>
      <p className="mb-8 text-sm text-ink-soft">
        Enter the admin password to authorize your Spotify account.
      </p>
      <RadioLoginForm />
    </div>
  );
}
