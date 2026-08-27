"use client";

import { useEffect, useRef, useState } from "react";

type NowPlayingData =
  | { configured: false }
  | { live: true; kind: "track"; id: string; title: string; artist: string; albumArt: string | null }
  | { live: false; kind: "playlist"; id: string; title: string; artist: null; albumArt: string | null };

const POLL_MS = 15_000;

function LiveBadge({ live }: { live: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border-2 border-ink px-2 py-0.5 text-xs font-bold uppercase tracking-widest ${live ? "bg-ink text-paper" : "bg-paper text-ink-soft"}`}
    >
      {live && (
        <span className="radio-live-dot" aria-hidden />
      )}
      {live ? "broadcasting live" : "off air — daylist"}
    </span>
  );
}


export function NowPlaying() {
  const [data, setData] = useState<NowPlayingData | null>(null);
  const [error, setError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function poll() {
    try {
      const res = await fetch("/api/radio/now", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const json = await res.json() as NowPlayingData;
      setData(json);
      setError(false);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    poll();
    timerRef.current = setInterval(poll, POLL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!data) {
    return (
      <div className="border-2 border-dashed border-ink-faint p-6 text-sm text-ink-soft">
        {error ? "couldn't reach the station — try refreshing." : "tuning in…"}
      </div>
    );
  }

  if ("configured" in data && !data.configured) {
    return (
      <div className="border-2 border-dashed border-ink-faint p-6">
        <p className="text-sm text-ink-soft">station is offline right now — check back soon.</p>
      </div>
    );
  }

  const nowData = data as Exclude<NowPlayingData, { configured: false }>;
  const spotifyUrl = `https://open.spotify.com/${nowData.kind}/${nowData.id}`;

  return (
    <a
      href={spotifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 rounded-sm px-2 py-2 transition-colors duration-100 hover:bg-[#e8a317]"
    >
      {nowData.albumArt && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={nowData.albumArt}
          alt="album art"
          width={72}
          height={72}
          className="h-[72px] w-[72px] shrink-0 border-2 border-ink object-cover"
        />
      )}
      <div className="min-w-0">
        <LiveBadge live={nowData.live} />
        <p className="mt-2 truncate font-bold">{nowData.title}</p>
        {nowData.artist && (
          <p className="truncate text-sm text-ink-soft">{nowData.artist}</p>
        )}
        {!nowData.live && (
          <p className="mt-1 text-xs text-ink-faint">
            nothing on the decks — here&apos;s today&apos;s daylist
          </p>
        )}
      </div>
    </a>
  );
}
