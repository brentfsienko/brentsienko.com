"use server";

import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  BLOG_COOKIE,
  MAX_AGE_SECONDS,
  checkAdminPassword,
  createSessionToken,
  isBlogAuthed,
} from "@/lib/blog-auth";
import {
  deletePost,
  getPostById,
  getPostBySlug,
  isBlobConfigured,
  savePost,
  slugify,
} from "@/lib/posts";

export type ActionState = { error?: string; ok?: boolean };

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!process.env.BLOG_ADMIN_PASSWORD || !process.env.BLOG_SESSION_SECRET) {
    return { error: "Blog auth env vars are not configured." };
  }
  const password = String(formData.get("password") ?? "");
  if (!checkAdminPassword(password)) {
    return { error: "Wrong password." };
  }
  const jar = await cookies();
  jar.set(BLOG_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  redirect("/blog/write");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(BLOG_COOKIE);
  redirect("/blog/write");
}

export async function savePostAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await isBlogAuthed())) {
    return { error: "Not authenticated." };
  }
  if (!isBlobConfigured()) {
    return { error: "BLOB_READ_WRITE_TOKEN is not configured." };
  }

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const draft = formData.get("draft") === "on" || formData.get("draft") === "true";

  if (!title) return { error: "Title is required." };
  if (!slug) slug = slugify(title);
  if (!slug) return { error: "Slug is required." };

  const slugOwner = await getPostBySlug(slug);
  if (slugOwner && slugOwner.id !== id) {
    return { error: "That slug is already taken." };
  }

  const existing = id ? await getPostById(id) : null;
  const now = new Date().toISOString();
  const post = {
    id: existing?.id ?? randomUUID(),
    title,
    slug,
    summary: summary || null,
    body,
    draft,
    updated_at: now,
    published_at: draft
      ? (existing?.published_at ?? null)
      : (existing?.published_at ?? now),
  };

  try {
    await savePost(post, existing?.slug);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  if (existing?.slug && existing.slug !== slug) {
    revalidatePath(`/blog/${existing.slug}`);
  }
  revalidatePath("/blog/write");
  redirect(`/blog/write/${slug}`);
}

export async function deletePostAction(formData: FormData) {
  if (!(await isBlogAuthed())) {
    throw new Error("Not authenticated");
  }
  if (!isBlobConfigured()) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }
  const slug = String(formData.get("slug") ?? "");
  if (!slug) return;

  await deletePost(slug);

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/blog/write");
  redirect("/blog/write");
}
