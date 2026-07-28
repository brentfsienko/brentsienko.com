"use server";

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
import { getPostBySlug, slugify } from "@/lib/posts";
import { getSupabase, isSupabaseConfigured, type Post } from "@/lib/supabase";

async function getPostById(id: string): Promise<Post | null> {
  const { data, error } = await getSupabase()
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as Post | null) ?? null;
}

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
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
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
  const row = {
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

  const sb = getSupabase();
  if (id) {
    const { error } = await sb.from("posts").update(row).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await sb.from("posts").insert(row);
    if (error) return { error: error.message };
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/blog/write");
  redirect(`/blog/write/${slug}`);
}

export async function deletePostAction(formData: FormData) {
  if (!(await isBlogAuthed())) {
    throw new Error("Not authenticated");
  }
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (!id) return;

  const { error } = await getSupabase().from("posts").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
  revalidatePath("/blog/write");
  redirect("/blog/write");
}
