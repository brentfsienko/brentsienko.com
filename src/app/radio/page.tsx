import type { Metadata } from "next";
import { radioData } from "@/data/radio";
import { NowPlaying } from "./NowPlaying";

export const metadata: Metadata = {
  title: "Radio",
  description: "Live from Brent's Spotify — now playing, plus a favorite song and album each month.",
};

function MonthlyPick({
  label,
  title,
  artist,
  note,
  kind,
  spotifyId,
  spotifyUrl,
}: {
  label: string;
  title: string;
  artist: string;
  note?: string;
  kind: "track" | "album";
  spotifyId: string;
  spotifyUrl: string;
}) {
  return (
    <div className="border-2 border-ink p-5">
      <p className="mb-3 text-xs uppercase tracking-widest text-ink-faint">{label}</p>
      <p className="font-bold leading-tight">{title}</p>
      <p className="mt-0.5 text-sm text-ink-soft">{artist}</p>
      {note && <p className="mt-2 text-xs text-ink-faint">{note}</p>}
      <div className="mt-4 overflow-hidden border-2 border-ink" style={{ background: "#121212" }}>
        <iframe
          src={`https://open.spotify.com/embed/${kind}/${spotifyId}?utm_source=generator&theme=0`}
          width="100%"
          height={152}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={{ border: "none", display: "block" }}
          title={`${label}: ${title}`}
        />
      </div>
      <a
        href={spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-xs text-ink-faint underline hover:text-ink"
      >
        open in spotify →
      </a>
    </div>
  );
}

export default function RadioPage() {
  const { monthLabel, song, album } = radioData;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">radio</h1>
        <p className="mt-3 max-w-xl text-sm text-ink-soft">
          Moooooosic. What I&apos;m currently listening to + monthly and current favs.
        </p>
      </div>

      {/* Now playing */}
      <section className="mb-14">
        <h2 className="mb-4 text-xs uppercase tracking-widest text-ink-faint">now playing</h2>
        <NowPlaying />
      </section>

      {/* Monthly picks */}
      <section>
        <div className="mb-6 flex items-baseline gap-3">
          <h2 className="text-xl font-bold">this month</h2>
          <span className="text-xs text-ink-faint">{monthLabel}</span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <MonthlyPick
            label="favorite song"
            title={song.title}
            artist={song.artist}
            note={song.note}
            kind="track"
            spotifyId={song.spotifyId}
            spotifyUrl={song.spotifyUrl}
          />
          <MonthlyPick
            label="favorite album"
            title={album.title}
            artist={album.artist}
            note={album.note}
            kind="album"
            spotifyId={album.spotifyId}
            spotifyUrl={album.spotifyUrl}
          />
        </div>
      </section>
    </div>
  );
}
