import type { Metadata } from "next";
import Link from "next/link";
import { PixelBloom } from "@/components/PixelArt";
import { listPublishedPosts, isBlobConfigured } from "@/lib/posts";

export const metadata: Metadata = {
  title: "bits and bobs",
};

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const configured = isBlobConfigured();
  const posts = configured ? await listPublishedPosts() : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 flex items-end gap-3 sm:gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          bits and bobs
        </h1>
        <div
          className="home-flowers flex items-end gap-1.5 sm:gap-2"
          aria-hidden
        >
          <PixelBloom
            palette="rose"
            shape="heart"
            sway
            width={40}
            height={70}
            className="h-[2.4rem] w-auto sm:h-[3rem]"
          />
          <PixelBloom
            palette="gold"
            shape="bench"
            sway
            width={32}
            height={56}
            className="h-[1.9rem] w-auto sm:h-[2.3rem]"
          />
          <PixelBloom
            palette="lilac"
            shape="burst"
            sway
            width={44}
            height={77}
            className="h-[2.8rem] w-auto sm:h-[3.5rem]"
          />
        </div>
      </div>

      {!configured && (
        <p className="border-2 border-dashed border-ink-faint p-4 text-sm text-ink-soft">
          Blog storage isn&apos;t connected yet. Set{" "}
          <code className="text-ink">BLOB_READ_WRITE_TOKEN</code> to enable
          posts.
        </p>
      )}

      {configured && posts.length === 0 && (
        <p className="text-ink-soft">No posts yet. Check back soon.</p>
      )}

      <ul className="divide-y-2 divide-ink border-y-2 border-ink">
        {posts.map((post) => (
          <li key={post.id} className="py-2">
            <Link href={`/blog/${post.slug}`} className="group block rounded-sm px-2 py-4 no-underline transition-colors duration-100 hover:bg-[#e8a317]">
              <h2 className="text-xl font-bold">{post.title}</h2>
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
