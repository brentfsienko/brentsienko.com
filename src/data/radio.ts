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

export const radioData: RadioData = {
  monthLabel: "August 2026",
  song: {
    title: "Please Please Please",
    artist: "Sabrina Carpenter",
    note: "Been on repeat. Not sorry.",
    spotifyId: "5HCyWlXZPP0y6Gqq8TgA20",
    spotifyUrl: "https://open.spotify.com/track/5HCyWlXZPP0y6Gqq8TgA20",
  },
  album: {
    title: "Short n' Sweet",
    artist: "Sabrina Carpenter",
    note: "The whole thing front to back.",
    spotifyId: "2IF0iFwMEAlpHiPXKGODzg",
    spotifyUrl: "https://open.spotify.com/album/2IF0iFwMEAlpHiPXKGODzg",
  },
};
