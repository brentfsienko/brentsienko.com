import type { Metadata } from "next";
import Link from "next/link";
import { PixelBee } from "@/components/PixelArt";
import { listPublishedPosts } from "@/lib/posts";
import { isSupabaseConfigured } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Blog",
};

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const configured = isSupabaseConfigured();
  const posts = configured ? await listPublishedPosts() : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">blog</h1>
        <PixelBee width={36} height={24} />
      </div>

      {!configured && (
        <p className="border-2 border-dashed border-ink-faint p-4 text-sm text-ink-soft">
          Blog storage isn&apos;t connected yet. Set Supabase env vars to enable
          posts.
        </p>
      )}

      {configured && posts.length === 0 && (
        <p className="text-ink-soft">No posts yet. Check back soon.</p>
      )}

      <ul className="divide-y-2 divide-ink border-y-2 border-ink">
        {posts.map((post) => (
          <li key={post.id} className="py-6">
            <Link href={`/blog/${post.slug}`} className="block no-underline">
              <h2 className="text-xl font-bold hover:underline">{post.title}</h2>
              {post.summary && (
                <p className="mt-2 text-sm text-ink-soft">{post.summary}</p>
              )}
              {post.published_at && (
                <p className="mt-2 text-xs text-ink-faint">
                  {new Date(post.published_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
