"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BLOG_COOKIE, MAX_AGE_SECONDS, checkAdminPassword, createSessionToken } from "@/lib/blog-auth";

export type RadioLoginState = { error?: string };

export async function radioLoginAction(
  _prev: RadioLoginState,
  formData: FormData,
): Promise<RadioLoginState> {
  if (!process.env.BLOG_ADMIN_PASSWORD || !process.env.BLOG_SESSION_SECRET) {
    return { error: "Admin auth is not configured." };
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
  redirect("/api/radio/connect");
}
