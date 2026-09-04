export type MonthlyPick = {
  title: string;
  artist: string;
  note?: string;
  spotifyUrl: string;
  /** Spotify embed ID — track ID for songs, album ID for albums */
  spotifyId: string;
};

export type RadioData = {
  /** e.g. "August 2026" */
  monthLabel: string;
  song: MonthlyPick;
  album: MonthlyPick;
};

/**
 * Monthly picks — newest first.
 * Add an entry when this month's picks are ready. Until then the page
 * leaves "this month" blank. Older months drop into the past list on their own.
 */
export const radioHistory: RadioData[] = [
  {
    monthLabel: "August 2026",
    song: {
      title: "the cops are coming",
      artist: "Junior Mesa",
      spotifyId: "1BlZIQiHakd1k4YmKsymZt",
      spotifyUrl: "https://open.spotify.com/track/1BlZIQiHakd1k4YmKsymZt",
    },
    album: {
      title: "Rat Saw God",
      artist: "Wednesday",
      spotifyId: "1oTR3aC0jYmwUlr9duBi05",
      spotifyUrl: "https://open.spotify.com/album/1oTR3aC0jYmwUlr9duBi05",
    },
  },
];

const TZ = "America/Los_Angeles";

export function currentMonthLabel(now = new Date()) {
  return now.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: TZ,
  });
}

function monthKey(label: string) {
  const t = Date.parse(`${label} 1`);
  return Number.isNaN(t) ? 0 : t;
}

export function splitRadioHistory(
  history = radioHistory,
  now = new Date(),
) {
  const currentLabel = currentMonthLabel(now);
  const nowKey = monthKey(currentLabel);
  const current = history.find((m) => monthKey(m.monthLabel) === nowKey) ?? null;
  const past = history
    .filter((m) => monthKey(m.monthLabel) < nowKey)
    .sort((a, b) => monthKey(b.monthLabel) - monthKey(a.monthLabel));
  return { current, past, currentLabel };
}
