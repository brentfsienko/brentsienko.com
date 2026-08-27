import type { Metadata } from "next";
import { radioHistory } from "@/data/radio";
import { getTopTracks, getTopArtists } from "@/lib/spotify";
import { NowPlaying } from "./NowPlaying";

export const metadata: Metadata = {
  title: "Radio",
  description: "Live from Brent's Spotify — now playing, plus a favorite song and album each month.",
};

export const revalidate = 10800; // revalidate top tracks/artists every 3 hours

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

export default async function RadioPage() {
  const current = radioHistory[0]!;
  const archive = radioHistory.slice(1);

  const [topTracks, topArtists] = await Promise.all([
    getTopTracks(3),
    getTopArtists(3),
  ]);

  const hasTopData = topTracks.length > 0 || topArtists.length > 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">mooooooooosic</h1>
        <p className="mt-3 max-w-xl text-sm text-ink-soft">
          What I&apos;m currently listening to + monthly and current favs.
        </p>
      </div>

      {/* Now playing */}
      <section className="mb-14">
        <h2 className="mb-4 text-xs uppercase tracking-widest text-ink-faint">now playing</h2>
        <NowPlaying />
      </section>

      {/* This month */}
      <section className="mb-14">
        <div className="mb-6 flex items-baseline gap-3">
          <h2 className="text-xl font-bold">this month</h2>
          <span className="text-xs text-ink-faint">{current.monthLabel}</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <MonthlyPick
            label="favorite song"
            title={current.song.title}
            artist={current.song.artist}
            note={current.song.note}
            kind="track"
            spotifyId={current.song.spotifyId}
            spotifyUrl={current.song.spotifyUrl}
          />
          <MonthlyPick
            label="favorite album"
            title={current.album.title}
            artist={current.album.artist}
            note={current.album.note}
            kind="album"
            spotifyId={current.album.spotifyId}
            spotifyUrl={current.album.spotifyUrl}
          />
        </div>

        {/* Listening to lately */}
        {hasTopData && (
          <div className="mt-8 border-t-2 border-ink pt-8">
            <h3 className="mb-6 text-xs uppercase tracking-widest text-ink-faint">
              listening to lately
            </h3>
            <div className="grid gap-8 sm:grid-cols-2">
              {topTracks.length > 0 && (
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-ink-faint">
                    top tracks
                  </p>
                  <ol className="space-y-3">
                    {topTracks.map((track, i) => (
                      <li key={track.id} className="flex items-center gap-3">
                        <span className="w-4 shrink-0 text-right text-xs text-ink-faint">
                          {i + 1}
                        </span>
                        {track.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={track.imageUrl}
                            alt=""
                            width={36}
                            height={36}
                            className="h-9 w-9 shrink-0 border border-ink object-cover"
                          />
                        )}
                        <div className="min-w-0">
                          <a
                            href={track.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block truncate text-sm font-bold leading-tight hover:underline"
                          >
                            {track.name}
                          </a>
                          <p className="truncate text-xs text-ink-soft">{track.artist}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {topArtists.length > 0 && (
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-ink-faint">
                    top artists
                  </p>
                  <ol className="space-y-3">
                    {topArtists.map((artist, i) => (
                      <li key={artist.id} className="flex items-center gap-3">
                        <span className="w-4 shrink-0 text-right text-xs text-ink-faint">
                          {i + 1}
                        </span>
                        {artist.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={artist.imageUrl}
                            alt=""
                            width={36}
                            height={36}
                            className="h-9 w-9 shrink-0 border border-ink object-cover"
                          />
                        )}
                        <a
                          href={artist.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate text-sm font-bold leading-tight hover:underline"
                        >
                          {artist.name}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Archive */}
      {archive.length > 0 && (
        <section>
          <h2 className="mb-6 text-xl font-bold">archive</h2>
          <ul className="divide-y-2 divide-ink border-y-2 border-ink">
            {archive.map((month) => (
              <li key={month.monthLabel} className="py-5">
                <p className="mb-3 text-xs uppercase tracking-widest text-ink-faint">
                  {month.monthLabel}
                </p>
                <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-ink-faint">song</p>
                    <p className="mt-0.5 text-sm font-bold">{month.song.title}</p>
                    <p className="text-xs text-ink-soft">{month.song.artist}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-ink-faint">album</p>
                    <p className="mt-0.5 text-sm font-bold">{month.album.title}</p>
                    <p className="text-xs text-ink-soft">{month.album.artist}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
