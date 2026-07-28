import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PostEditor } from "@/components/PostEditor";
import { logoutAction } from "@/app/blog/actions";
import { isBlogAuthed } from "@/lib/blog-auth";
import { getPostBySlug } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = {
  title: "Edit post",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: Props) {
  const authed = await isBlogAuthed();
  if (!authed) redirect("/blog/write");

  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) redirect("/blog/write");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <Link href="/blog/write" className="text-sm text-ink-faint no-underline hover:text-ink">
            ← all posts
          </Link>
          <h1 className="mt-2 text-3xl font-bold">edit</h1>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="btn !py-1.5 !text-xs">
            lock
          </button>
        </form>
      </div>
      <PostEditor post={post} />
    </div>
  );
}
