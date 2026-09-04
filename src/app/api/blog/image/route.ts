import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { isBlogAuthed } from "@/lib/blog-auth";
import { isBlobConfigured } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
const MAX_BYTES = 4.5 * 1024 * 1024;

function extFor(type: string) {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/gif") return "gif";
  if (type === "image/webp") return "webp";
  return "jpg";
}

export async function POST(request: Request) {
  if (!(await isBlogAuthed())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  if (!isBlobConfigured()) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN is not configured." },
      { status: 500 },
    );
  }

  let file: File | null = null;
  try {
    const form = await request.formData();
    const value = form.get("file");
    file = value instanceof File ? value : null;
  } catch {
    return NextResponse.json({ error: "Couldn't read that photo." }, { status: 400 });
  }

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "Choose a photo." }, { status: 400 });
  }
  if (!TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Use a jpg, png, gif, or webp." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "That photo is still too big after shrinking. Try another." },
      { status: 400 },
    );
  }

  try {
    const pathname = `blog/images/${randomUUID()}.${extFor(file.type)}`;
    await put(pathname, file, {
      access: "private",
      addRandomSuffix: false,
      contentType: file.type,
    });
    return NextResponse.json({ url: `/api/blog/photo/${pathname}` });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed." },
      { status: 400 },
    );
  }
}
