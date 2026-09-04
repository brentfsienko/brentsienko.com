/** Spotify Web API helpers — server-only. Never import from client components. */

export type NowPlayingResult =
  | { live: true; kind: "track"; id: string; title: string; artist: string; albumArt: string | null }
  | { live: false; kind: "track"; id: string; title: string; artist: string; albumArt: string | null }
  | { live: false; kind: "playlist"; id: string; title: string; artist: null; albumArt: string | null };

type SpotifyTrack = {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
};

function asTrack(item: SpotifyTrack, live: boolean): Extract<NowPlayingResult, { kind: "track" }> {
  return {
    live,
    kind: "track",
    id: item.id,
    title: item.name,
    artist: item.artists.map((a) => a.name).join(", "),
    albumArt: item.album.images[0]?.url ?? null,
  };
}

type TokenCache = { accessToken: string; expiresAt: number };
let tokenCache: TokenCache | null = null;

function isSpotifyConfigured() {
  return (
    Boolean(process.env.SPOTIFY_CLIENT_ID) &&
    Boolean(process.env.SPOTIFY_CLIENT_SECRET) &&
    Boolean(process.env.SPOTIFY_REFRESH_TOKEN)
  );
}

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 30_000) {
    return tokenCache.accessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN!;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Spotify token refresh failed: ${res.status}`);
  }

  const data = await res.json() as { access_token: string; expires_in: number };
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return tokenCache.accessToken;
}

async function spotifyFetch(path: string): Promise<Response> {
  const token = await getAccessToken();
  return fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}

async function findDaylistPlaylist(): Promise<{ id: string; title: string; albumArt: string | null } | null> {
  // Hard-coded fallback first
  const fallbackId = process.env.SPOTIFY_DAYLIST_PLAYLIST_ID;

  try {
    const res = await spotifyFetch("/me/playlists?limit=50");
    if (!res.ok) return fallbackId ? { id: fallbackId, title: "daylist", albumArt: null } : null;

    const data = await res.json() as {
      items: { id: string; name: string; images: { url: string }[] }[];
    };

    const daylist = data.items.find((p) =>
      p.name.toLowerCase().startsWith("daylist")
    );
    if (daylist) {
      return {
        id: daylist.id,
        title: daylist.name,
        albumArt: daylist.images[0]?.url ?? null,
      };
    }
  } catch {
    // fall through to fallback
  }

  return fallbackId ? { id: fallbackId, title: "daylist", albumArt: null } : null;
}

async function getRecentlyPlayedTrack(): Promise<Extract<NowPlayingResult, { kind: "track" }> | null> {
  try {
    const res = await spotifyFetch("/me/player/recently-played?limit=1");
    if (!res.ok) return null;
    const data = await res.json() as { items: { track: SpotifyTrack | null }[] };
    const track = data.items[0]?.track;
    if (!track?.id) return null;
    return asTrack(track, false);
  } catch {
    return null;
  }
}

async function getIdleNowPlaying(): Promise<NowPlayingResult | null> {
  const recent = await getRecentlyPlayedTrack();
  if (recent) return recent;

  const daylist = await findDaylistPlaylist();
  if (!daylist) return null;
  return {
    live: false,
    kind: "playlist",
    id: daylist.id,
    title: daylist.title,
    artist: null,
    albumArt: daylist.albumArt,
  };
}

export async function getNowPlaying(): Promise<NowPlayingResult | null> {
  if (!isSpotifyConfigured()) return null;

  try {
    const res = await spotifyFetch("/me/player/currently-playing");

    // 204 = nothing in the player
    if (res.status === 204) return getIdleNowPlaying();
    if (!res.ok) return getIdleNowPlaying();

    const data = await res.json() as {
      is_playing: boolean;
      item: SpotifyTrack | null;
      currently_playing_type: string;
    };

    if (data.item && data.currently_playing_type === "track") {
      return asTrack(data.item, data.is_playing);
    }

    return getIdleNowPlaying();
  } catch {
    return null;
  }
}

export async function getTrackImage(id: string): Promise<string | null> {
  if (!isSpotifyConfigured()) return null;
  try {
    const res = await spotifyFetch(`/tracks/${id}`);
    if (!res.ok) return null;
    const data = await res.json() as { album: { images: { url: string }[] } };
    return data.album.images[0]?.url ?? null;
  } catch { return null; }
}

export async function getAlbumImage(id: string): Promise<string | null> {
  if (!isSpotifyConfigured()) return null;
  try {
    const res = await spotifyFetch(`/albums/${id}`);
    if (!res.ok) return null;
    const data = await res.json() as { images: { url: string }[] };
    return data.images[0]?.url ?? null;
  } catch { return null; }
}

export type TopTrack = {
  id: string;
  name: string;
  artist: string;
  imageUrl: string | null;
  spotifyUrl: string;
};

export type TopArtist = {
  id: string;
  name: string;
  imageUrl: string | null;
  spotifyUrl: string;
};

export async function getTopTracks(limit = 3): Promise<TopTrack[]> {
  if (!isSpotifyConfigured()) return [];
  try {
    const res = await spotifyFetch(`/me/top/tracks?time_range=short_term&limit=${limit}`);
    if (!res.ok) return [];
    const data = await res.json() as {
      items: {
        id: string;
        name: string;
        artists: { name: string }[];
        album: { images: { url: string }[] };
        external_urls: { spotify: string };
      }[];
    };
    return data.items.map((t) => ({
      id: t.id,
      name: t.name,
      artist: t.artists.map((a) => a.name).join(", "),
      imageUrl: t.album.images[0]?.url ?? null,
      spotifyUrl: t.external_urls.spotify,
    }));
  } catch {
    return [];
  }
}

export async function getTopArtists(limit = 3): Promise<TopArtist[]> {
  if (!isSpotifyConfigured()) return [];
  try {
    const res = await spotifyFetch(`/me/top/artists?time_range=short_term&limit=${limit}`);
    if (!res.ok) return [];
    const data = await res.json() as {
      items: {
        id: string;
        name: string;
        images: { url: string }[];
        external_urls: { spotify: string };
      }[];
    };
    return data.items.map((a) => ({
      id: a.id,
      name: a.name,
      imageUrl: a.images[0]?.url ?? null,
      spotifyUrl: a.external_urls.spotify,
    }));
  } catch {
    return [];
  }
}

export function buildSpotifyAuthUrl() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  if (!clientId || !redirectUri) return null;

  const scopes = [
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-read-recently-played",
    "playlist-read-private",
    "user-top-read",
  ].join(" ");

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes,
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function exchangeCodeForRefreshToken(code: string): Promise<{ refreshToken: string; accessToken: string }> {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${text}`);
  }

  const data = await res.json() as { refresh_token: string; access_token: string };
  return { refreshToken: data.refresh_token, accessToken: data.access_token };
}
