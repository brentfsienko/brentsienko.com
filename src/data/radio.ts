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
 * The featured slot is last calendar month. Older months drop into past.
 * Add an entry for a month once those picks are ready.
 */
export const radioHistory: RadioData[] = [
  {
    monthLabel: "September 2026",
    song: {
      title: "Marianne",
      artist: "Fontaines D.C.",
      spotifyId: "69rHKcrQpYGfToPThOV1UB",
      spotifyUrl: "https://open.spotify.com/track/69rHKcrQpYGfToPThOV1UB",
    },
    album: {
      title: "Skinty Fia",
      artist: "Fontaines D.C.",
      spotifyId: "2ZMViS2A6M15Z1kN6n6O8S",
      spotifyUrl: "https://open.spotify.com/album/2ZMViS2A6M15Z1kN6n6O8S",
    },
  },
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

export function monthLabelFor(date: Date) {
  return date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: TZ,
  });
}

export function lastMonthLabel(now = new Date()) {
  // Anchor in LA so month boundaries match the site TZ, then step back one calendar month.
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);
  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value); // 1-12
  const prev = new Date(Date.UTC(year, month - 2, 1)); // month-2 => previous calendar month
  return prev.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
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
  const featuredLabel = lastMonthLabel(now);
  const featuredKey = monthKey(featuredLabel);
  const featured = history.find((m) => monthKey(m.monthLabel) === featuredKey) ?? null;
  const past = history
    .filter((m) => monthKey(m.monthLabel) < featuredKey)
    .sort((a, b) => monthKey(b.monthLabel) - monthKey(a.monthLabel));
  return { featured, past, featuredLabel };
}
