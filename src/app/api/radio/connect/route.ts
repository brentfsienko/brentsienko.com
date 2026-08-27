import { NextRequest, NextResponse } from "next/server";
import { isBlogAuthed } from "@/lib/blog-auth";
import { buildSpotifyAuthUrl } from "@/lib/spotify";

export async function GET(_req: NextRequest) {
  const authed = await isBlogAuthed();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = buildSpotifyAuthUrl();
  if (!url) {
    return NextResponse.json(
      { error: "SPOTIFY_CLIENT_ID or SPOTIFY_REDIRECT_URI not set" },
      { status: 503 }
    );
  }

  return NextResponse.redirect(url);
}
