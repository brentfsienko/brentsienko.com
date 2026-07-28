import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { PostEditor } from "@/components/PostEditor";
import { logoutAction } from "@/app/blog/actions";
import { isBlogAuthed } from "@/lib/blog-auth";
import { listAllPosts } from "@/lib/posts";
import { isSupabaseConfigured } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Write",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BlogWritePage() {
  const authed = await isBlogAuthed();

  if (!authed) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <LoginForm />
      </div>
    );
  }

  const configured = isSupabaseConfigured();
  const posts = configured ? await listAllPosts() : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">write</h1>
        <form action={logoutAction}>
          <button type="submit" className="btn !py-1.5 !text-xs">
            lock
          </button>
        </form>
      </div>

      {!configured && (
        <p className="mb-8 border-2 border-dashed border-ink-faint p-4 text-sm text-ink-soft">
          Add Supabase credentials to save posts.
        </p>
      )}

      <section className="mb-12">
        <h2 className="mb-4 text-xs uppercase tracking-widest text-ink-faint">
          new post
        </h2>
        <PostEditor />
      </section>

      <section>
        <h2 className="mb-4 text-xs uppercase tracking-widest text-ink-faint">
          all posts
        </h2>
        {posts.length === 0 ? (
          <p className="text-sm text-ink-soft">No posts yet.</p>
        ) : (
          <ul className="divide-y-2 divide-ink border-y-2 border-ink">
            {posts.map((post) => (
              <li key={post.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <div>
                  <Link
                    href={`/blog/write/${post.slug}`}
                    className="font-bold no-underline hover:underline"
                  >
                    {post.title}
                  </Link>
                  <p className="text-xs text-ink-faint">
                    {post.draft ? "draft" : "published"} · {post.slug}
                  </p>
                </div>
                {!post.draft && (
                  <Link href={`/blog/${post.slug}`} className="text-xs">
                    view
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
