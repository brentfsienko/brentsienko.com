import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isBlogAuthed } from "@/lib/blog-auth";
import { isBlobConfigured } from "@/lib/posts";

export const dynamic = "force-dynamic";

const TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

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

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("blog/images/")) {
          throw new Error("Photos must go under blog/images/");
        }
        return {
          allowedContentTypes: TYPES,
          maximumSizeInBytes: 12 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed." },
      { status: 400 },
    );
  }
}
