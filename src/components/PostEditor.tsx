"use client";

import { useActionState, useEffect, useState } from "react";
import {
  deletePostAction,
  savePostAction,
  type ActionState,
} from "@/app/blog/actions";
import type { Post } from "@/lib/supabase";
import { slugify } from "@/lib/posts-client";

const initial: ActionState = {};

type Props = {
  post?: Post | null;
};

export function PostEditor({ post }: Props) {
  const [state, formAction, pending] = useActionState(savePostAction, initial);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  return (
    <div className="space-y-8">
      <form action={formAction} className="space-y-4">
        {post?.id && <input type="hidden" name="id" value={post.id} />}

        <label className="block text-xs uppercase tracking-widest text-ink-faint">
          title
          <input
            name="title"
            className="field mt-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label className="block text-xs uppercase tracking-widest text-ink-faint">
          slug
          <input
            name="slug"
            className="field mt-2"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            required
          />
        </label>

        <label className="block text-xs uppercase tracking-widest text-ink-faint">
          summary
          <input
            name="summary"
            className="field mt-2"
            defaultValue={post?.summary ?? ""}
          />
        </label>

        <label className="block text-xs uppercase tracking-widest text-ink-faint">
          body (markdown)
          <textarea
            name="body"
            className="field mt-2 min-h-[280px] font-mono text-sm leading-relaxed"
            defaultValue={post?.body ?? ""}
            required
          />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="draft"
            defaultChecked={post?.draft ?? true}
            className="h-4 w-4 accent-ink"
          />
          save as draft
        </label>

        {state.error && <p className="text-sm text-flower">{state.error}</p>}

        <button type="submit" className="btn btn-solid" disabled={pending}>
          {pending ? "saving…" : "save"}
        </button>
      </form>

      {post?.id && (
        <form action={deletePostAction}>
          <input type="hidden" name="id" value={post.id} />
          <input type="hidden" name="slug" value={post.slug} />
          <button
            type="submit"
            className="btn !border-flower !text-flower"
            onClick={(e) => {
              if (!confirm("Delete this post?")) e.preventDefault();
            }}
          >
            delete
          </button>
        </form>
      )}
    </div>
  );
}
