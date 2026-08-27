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
 * Add a new entry at the top each month; past entries become the archive.
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

/** Convenience alias — always the current month. */
export const radioData: RadioData = radioHistory[0]!;
