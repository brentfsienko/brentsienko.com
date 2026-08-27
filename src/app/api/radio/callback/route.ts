import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForRefreshToken } from "@/lib/spotify";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error) {
    return new NextResponse(
      `<html><body style="font-family:monospace;padding:2rem">
        <h2>Spotify auth error</h2>
        <p>${error}</p>
        <a href="/radio/connect">← back</a>
      </body></html>`,
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  if (!code) {
    return new NextResponse(
      `<html><body style="font-family:monospace;padding:2rem"><p>Missing code.</p></body></html>`,
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  try {
    const { refreshToken } = await exchangeCodeForRefreshToken(code);

    return new NextResponse(
      `<html><body style="font-family:monospace;background:#f4f2ec;padding:2rem;max-width:640px;margin:0 auto">
        <h2 style="margin:0 0 1rem">Spotify connected</h2>
        <p style="color:#4a4a4a;margin:0 0 1rem">Copy this refresh token and set it as <code>SPOTIFY_REFRESH_TOKEN</code> in Vercel and your <code>.env.local</code>.</p>
        <textarea
          readonly
          onclick="this.select()"
          style="width:100%;height:80px;font-family:monospace;font-size:12px;border:2px solid #1a1a1a;padding:0.5rem;background:#fff;resize:none"
        >${refreshToken}</textarea>
        <p style="margin:1rem 0 0;font-size:13px;color:#8a8a8a">This page will not show the token again after you navigate away.</p>
        <a href="/radio" style="display:inline-block;margin-top:1rem;color:#1a1a1a">→ go to radio</a>
      </body></html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new NextResponse(
      `<html><body style="font-family:monospace;padding:2rem">
        <h2>Token exchange failed</h2>
        <pre>${message}</pre>
        <a href="/radio/connect">← try again</a>
      </body></html>`,
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}
