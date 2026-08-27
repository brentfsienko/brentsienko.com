import { NextResponse } from "next/server";
import { getTopTracks, getTopArtists } from "@/lib/spotify";

export const dynamic = "force-dynamic";

export async function GET() {
  const [tracks, artists] = await Promise.all([getTopTracks(3), getTopArtists(3)]);

  return NextResponse.json(
    { tracks, artists },
    {
      headers: {
        "Cache-Control": "public, s-maxage=10800, stale-while-revalidate=3600",
      },
    }
  );
}
