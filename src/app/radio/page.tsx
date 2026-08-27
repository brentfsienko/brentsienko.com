import type { Metadata } from "next";
import { radioHistory } from "@/data/radio";
import { getTopTracks, getTopArtists, getTrackImage, getAlbumImage } from "@/lib/spotify";
import { NowPlaying } from "./NowPlaying";

export const metadata: Metadata = {
  title: "Radio",
  description: "Live from Brent's Spotify — now playing, plus a favorite song and album each month.",
};

export const revalidate = 10800;

const HOVER = "hover:bg-[#ffe87c]";
const HOVER_NUM = "group-hover:text-yellow-700";

function MonthlyPickRow({
  label,
  title,
  artist,
  note,
  spotifyUrl,
  imageUrl,
}: {
  label: string;
  title: string;
  artist: string;
  note?: string;
  spotifyUrl: string;
  imageUrl?: string | null;
}) {
  return (
    <a
      href={spotifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center gap-3 rounded-sm px-2 py-1.5 transition-colors duration-100 ${HOVER}`}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" width={72} height={72}
          className="h-[72px] w-[72px] shrink-0 border-2 border-ink object-cover" />
      ) : (
        <div className="h-[72px] w-[72px] shrink-0 border-2 border-ink bg-paper" />
      )}
      <div className="min-w-0">
        <p className={`mb-0.5 text-[10px] uppercase tracking-widest text-ink-faint ${HOVER_NUM}`}>
          {label}
        </p>
        <p className="truncate font-bold leading-tight">{title}</p>
        <p className="truncate text-xs text-ink-soft">{artist}</p>
        {note && <p className="mt-0.5 truncate text-xs text-ink-faint">{note}</p>}
      </div>
    </a>
  );
}

export default async function RadioPage() {
  const current = radioHistory[0]!;
  const archive = radioHistory.slice(1);

  const [topTracks, topArtists, songImage, albumImage] = await Promise.all([
    getTopTracks(3),
    getTopArtists(3),
    getTrackImage(current.song.spotifyId),
    getAlbumImage(current.album.spotifyId),
  ]);

  const hasTopData = topTracks.length > 0 || topArtists.length > 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">mooooooooosic</h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          What I&apos;m currently listening to + monthly and current favs.
        </p>
      </div>

      {/* Now playing */}
      <section className="mb-8">
        <h2 className="mb-3 text-xs uppercase tracking-widest text-ink-faint">now playing</h2>
        <NowPlaying />
      </section>

      {/* Listening to lately — artists LEFT | tracks RIGHT */}
      {hasTopData && (
        <section className="mb-10">
          <h2 className="mb-4 text-xs uppercase tracking-widest text-ink-faint">listening to lately</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {topArtists.length > 0 && (
              <div>
                <p className="mb-1.5 px-2 text-xs font-bold uppercase tracking-widest text-ink-faint">
                  top artists
                </p>
                <ol className="space-y-0.5">
                  {topArtists.map((artist, i) => (
                    <li key={artist.id}>
                      <a
                        href={artist.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group flex items-center gap-3 rounded-sm px-2 py-1.5 transition-colors duration-100 ${HOVER}`}
                      >
                        <span className={`w-4 shrink-0 text-right text-xs text-ink-faint ${HOVER_NUM}`}>
                          {i + 1}
                        </span>
                        {artist.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={artist.imageUrl} alt="" width={54} height={54}
                            className="h-[54px] w-[54px] shrink-0 border border-ink object-cover" />
                        )}
                        <p className="truncate text-sm font-bold leading-tight">{artist.name}</p>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {topTracks.length > 0 && (
              <div>
                <p className="mb-1.5 px-2 text-xs font-bold uppercase tracking-widest text-ink-faint">
                  top tracks
                </p>
                <ol className="space-y-0.5">
                  {topTracks.map((track, i) => (
                    <li key={track.id}>
                      <a
                        href={track.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group flex items-center gap-3 rounded-sm px-2 py-1.5 transition-colors duration-100 ${HOVER}`}
                      >
                        <span className={`w-4 shrink-0 text-right text-xs text-ink-faint ${HOVER_NUM}`}>
                          {i + 1}
                        </span>
                        {track.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={track.imageUrl} alt="" width={54} height={54}
                            className="h-[54px] w-[54px] shrink-0 border border-ink object-cover" />
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold leading-tight">{track.name}</p>
                          <p className="truncate text-xs text-ink-soft">{track.artist}</p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </section>
      )}

      {/* This month — song LEFT | album RIGHT */}
      <section className="mb-14">
        <div className="mb-3 flex items-baseline gap-2">
          <h2 className="text-xs uppercase tracking-widest text-ink-faint">this month</h2>
          <span className="text-xs text-ink-faint">{current.monthLabel}</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <MonthlyPickRow
            label="favorite song"
            title={current.song.title}
            artist={current.song.artist}
            note={current.song.note}
            spotifyUrl={current.song.spotifyUrl}
            imageUrl={songImage}
          />
          <MonthlyPickRow
            label="favorite album"
            title={current.album.title}
            artist={current.album.artist}
            note={current.album.note}
            spotifyUrl={current.album.spotifyUrl}
            imageUrl={albumImage}
          />
        </div>
      </section>

      {/* Archive */}
      {archive.length > 0 && (
        <section>
          <h2 className="mb-4 text-xs uppercase tracking-widest text-ink-faint">archive</h2>
          <ul className="divide-y divide-ink border-y border-ink">
            {archive.map((month) => (
              <li key={month.monthLabel} className="py-4">
                <p className="mb-3 text-xs uppercase tracking-widest text-ink-faint">
                  {month.monthLabel}
                </p>
                <div className="grid gap-1 sm:grid-cols-2">
                  <MonthlyPickRow
                    label="favorite song"
                    title={month.song.title}
                    artist={month.song.artist}
                    spotifyUrl={month.song.spotifyUrl}
                  />
                  <MonthlyPickRow
                    label="favorite album"
                    title={month.album.title}
                    artist={month.album.artist}
                    spotifyUrl={month.album.spotifyUrl}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
