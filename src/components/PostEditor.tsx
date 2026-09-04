"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { BlogMarkdown } from "@/components/BlogMarkdown";
import {
  deletePostAction,
  savePostAction,
  type ActionState,
} from "@/app/blog/actions";
import type { Post } from "@/lib/posts";
import { slugify } from "@/lib/posts-client";

const initial: ActionState = {};
const MAX_EDGE = 1800;
const JPEG_QUALITY = 0.82;

type Props = {
  post?: Post | null;
};

type PendingPhoto = {
  id: string;
  previewUrl: string;
  status: "uploading" | "error";
  error?: string;
};

function photoAlt(file: File) {
  return file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "photo";
}

function isProbablyImage(file: File) {
  return (
    file.type.startsWith("image/") ||
    /\.(jpe?g|png|gif|webp|heic|heif)$/i.test(file.name)
  );
}

function photosFromMarkdown(body: string) {
  const out: { alt: string; url: string }[] = [];
  const re = /!\[([^\]]*)\]\(([^)\s]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(body))) {
    const url = match[2] ?? "";
    if (url.startsWith("http") || url.startsWith("/api/blog/photo/")) {
      out.push({ alt: match[1] ?? "", url });
    }
  }
  return out;
}

async function preparePhoto(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      throw new Error("Couldn't process that photo.");
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (next) =>
          next ? resolve(next) : reject(new Error("Couldn't process that photo.")),
        "image/jpeg",
        JPEG_QUALITY,
      );
    });
    return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
      type: "image/jpeg",
    });
  } catch {
    if (file.type === "image/jpeg" && file.size <= 4 * 1024 * 1024) return file;
    throw new Error("Couldn't read that photo. Try a jpg or png.");
  }
}

export function PostEditor({ post }: Props) {
  const [state, formAction, pending] = useActionState(savePostAction, initial);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [body, setBody] = useState(post?.body ?? "");
  const [summary, setSummary] = useState(post?.summary ?? "");
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const bodyValueRef = useRef(body);
  bodyValueRef.current = body;

  const savedPhotos = useMemo(() => photosFromMarkdown(body), [body]);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  useEffect(() => {
    return () => {
      for (const photo of pendingPhotos) URL.revokeObjectURL(photo.previewUrl);
    };
    // Only revoke leftover blob URLs on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const images = files.filter(isProbablyImage);
    if (images.length === 0) {
      setUploadError("Use a jpg, png, gif, or webp.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      for (const file of images) {
        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const previewUrl = URL.createObjectURL(file);
        setPendingPhotos((cur) => [
          ...cur,
          { id, previewUrl, status: "uploading" },
        ]);
        try {
          const prepared = await preparePhoto(file);
          const form = new FormData();
          form.append("file", prepared);
          const res = await fetch("/api/blog/image", {
            method: "POST",
            body: form,
            credentials: "same-origin",
          });
          const json = (await res.json().catch(() => ({}))) as {
            url?: string;
            error?: string;
          };
          if (!res.ok || !json.url) {
            throw new Error(json.error || "Couldn't upload that photo.");
          }
          insertMarkdown(`\n\n![${photoAlt(file)}](${json.url})\n\n`);
          setPendingPhotos((cur) => {
            const hit = cur.find((p) => p.id === id);
            if (hit) URL.revokeObjectURL(hit.previewUrl);
            return cur.filter((p) => p.id !== id);
          });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Couldn't upload that photo.";
          setPendingPhotos((cur) =>
            cur.map((p) =>
              p.id === id ? { ...p, status: "error", error: message } : p,
            ),
          );
          setUploadError(message);
        }
      }
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
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </label>

        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-baseline gap-3">
              <button
                type="button"
                onClick={() => setMode("write")}
                className={`cursor-pointer text-xs uppercase tracking-widest ${mode === "write" ? "text-ink underline" : "text-ink-faint"}`}
              >
                write
              </button>
              <button
                type="button"
                onClick={() => setMode("preview")}
                className={`cursor-pointer text-xs uppercase tracking-widest ${mode === "preview" ? "text-ink underline" : "text-ink-faint"}`}
              >
                preview
              </button>
            </div>
            {mode === "write" && (
              <label
                className={`btn !px-3 !py-1 !text-xs ${uploading ? "pointer-events-none opacity-60" : ""}`}
              >
                {uploading ? "uploading…" : "add photo"}
                <input
                  type="file"
                  accept="image/*"
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
            )}
          </div>
          <textarea
            ref={bodyRef}
            name="body"
            className={`field min-h-[280px] font-mono text-sm leading-relaxed ${mode === "preview" ? "hidden" : ""}`}
            value={body}
            required
            onChange={(e) => setBody(e.target.value)}
            onPaste={(e) => {
              const files = Array.from(e.clipboardData.files);
              if (files.some(isProbablyImage)) {
                e.preventDefault();
                void addPhotos(files);
              }
            }}
            onDragOver={(e) => {
              if ([...e.dataTransfer.items].some((item) => item.kind === "file")) {
                e.preventDefault();
              }
            }}
            onDrop={(e) => {
              const files = Array.from(e.dataTransfer.files);
              if (files.some(isProbablyImage)) {
                e.preventDefault();
                void addPhotos(files);
              }
            }}
          />
          {mode === "preview" && (
            <article className="border-2 border-ink bg-paper p-5 sm:p-6">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {title.trim() || "untitled"}
              </h1>
              <p className="mt-3 text-xs text-ink-faint">
                {new Date(post?.published_at ?? Date.now()).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </p>
              {summary.trim() ? (
                <p className="mt-4 text-sm text-ink-soft">{summary.trim()}</p>
              ) : null}
              <div className="mt-8">
                <BlogMarkdown body={body} empty="nothing to preview yet." />
              </div>
            </article>
          )}
          {mode === "write" && (savedPhotos.length > 0 || pendingPhotos.length > 0) && (
            <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {savedPhotos.map((photo) => (
                <li key={photo.url}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    className="blog-photo !mt-0 !mb-0 aspect-square object-cover"
                  />
                </li>
              ))}
              {pendingPhotos.map((photo) => (
                <li key={photo.id} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.previewUrl}
                    alt=""
                    className="blog-photo !mt-0 !mb-0 aspect-square object-cover"
                  />
                  <span className="absolute inset-0 flex items-end bg-ink/40 p-1 text-[10px] text-paper">
                    {photo.status === "uploading" ? "uploading…" : photo.error}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {mode === "write" && (
            <p className="mt-1.5 text-xs text-ink-faint">
              add photo, or drop / paste one into the body. save the post after.
            </p>
          )}
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
