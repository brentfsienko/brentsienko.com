import { NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/spotify";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getNowPlaying();

  if (!result) {
    return NextResponse.json(
      { configured: false },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, max-age=10, stale-while-revalidate=5",
    },
  });
}
