import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isBlobConfigured } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Props = { params: Promise<{ path: string[] }> };

function safeImagePath(parts: string[]) {
  const pathname = parts.join("/");
  if (!/^blog\/images\/[a-zA-Z0-9._-]+$/.test(pathname)) return null;
  return pathname;
}

export async function GET(_request: Request, { params }: Props) {
  if (!isBlobConfigured()) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { path } = await params;
  const pathname = safeImagePath(path);
  if (!pathname) {
    return new NextResponse("Not found", { status: 404 });
  }

  const result = await get(pathname, { access: "private" });
  if (!result || result.statusCode !== 200 || !result.stream) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType || "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
