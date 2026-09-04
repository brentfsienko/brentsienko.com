"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import {
  deletePostAction,
  savePostAction,
  type ActionState,
} from "@/app/blog/actions";
import type { Post } from "@/lib/posts";
import { slugify } from "@/lib/posts-client";

const initial: ActionState = {};
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

type Props = {
  post?: Post | null;
};

function photoAlt(file: File) {
  return file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "photo";
}

function photoPath(file: File) {
  const raw = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const ext = raw === "jpeg" ? "jpg" : raw;
  const safe = ["jpg", "png", "gif", "webp"].includes(ext) ? ext : "jpg";
  return `blog/images/photo.${safe}`;
}

export function PostEditor({ post }: Props) {
  const [state, formAction, pending] = useActionState(savePostAction, initial);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [body, setBody] = useState(post?.body ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const bodyValueRef = useRef(body);
  bodyValueRef.current = body;

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  function insertMarkdown(markdown: string) {
    const el = bodyRef.current;
    const current = bodyValueRef.current;
    const start = el?.selectionStart ?? current.length;
    const end = el?.selectionEnd ?? current.length;
    const next = `${current.slice(0, start)}${markdown}${current.slice(end)}`;
    bodyValueRef.current = next;
    setBody(next);
    requestAnimationFrame(() => {
      if (!el) return;
      const pos = start + markdown.length;
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  }

  async function addPhotos(files: File[]) {
    const images = files.filter((f) => PHOTO_TYPES.includes(f.type));
    if (images.length === 0) {
      setUploadError("Use a jpg, png, gif, or webp.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      for (const file of images) {
        const blob = await upload(photoPath(file), file, {
          access: "public",
          handleUploadUrl: "/api/blog/image",
          multipart: file.size > 4 * 1024 * 1024,
        });
        insertMarkdown(`\n\n![${photoAlt(file)}](${blob.url})\n\n`);
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Couldn't upload that photo.");
    } finally {
      setUploading(false);
    }
  }

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

        <div>
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-xs uppercase tracking-widest text-ink-faint">
              body (markdown)
            </span>
            <label className={`btn !px-3 !py-1 !text-xs ${uploading ? "pointer-events-none opacity-60" : ""}`}>
              {uploading ? "uploading…" : "add photo"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                multiple
                className="sr-only"
                disabled={uploading}
                onChange={(e) => {
                  const list = e.target.files;
                  if (list?.length) void addPhotos(Array.from(list));
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          <textarea
            ref={bodyRef}
            name="body"
            className="field min-h-[280px] font-mono text-sm leading-relaxed"
            value={body}
            required
            onChange={(e) => setBody(e.target.value)}
            onPaste={(e) => {
              const files = Array.from(e.clipboardData.files);
              if (files.some((f) => f.type.startsWith("image/"))) {
                e.preventDefault();
                void addPhotos(files);
              }
            }}
            onDrop={(e) => {
              const files = Array.from(e.dataTransfer.files);
              if (files.some((f) => f.type.startsWith("image/"))) {
                e.preventDefault();
                void addPhotos(files);
              }
            }}
          />
          <p className="mt-1.5 text-xs text-ink-faint">
            add photo, or drop / paste one into the body
          </p>
          {uploadError && <p className="mt-1 text-sm text-flower">{uploadError}</p>}
        </div>

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
