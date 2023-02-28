const SPOTIFY_API_URL_BASE = "https://api.spotify.com/v1";

export interface SpotifyUser {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  href: string;
  id: string;
  images: { url: string; height: number; width: number }[];
  product: string;
  type: string;
  uri: string;
}

export async function fetchMe({
  accessToken,
}: {
  accessToken: string;
}): Promise<SpotifyUser> {
  const response = await fetch(`${SPOTIFY_API_URL_BASE}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify API Error: ${response.status}`);
  }

  return (await response.json()) as SpotifyUser;
}

export interface SearchApiResponse {
  albums: {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string;
    total: number;
    items: {
      album_type: "album" | "single" | "compilation";
      total_tracks: number;
      available_markets: string[]; // ISO3166-1 alpha-2 contry code
      external_urls: {
        spotify: string; // url
      };
      href: string;
      id: string;
      images: {
        url: string;
        height: number;
        width: number;
      }[];
      name: string;
      release_date: string;
      release_date_precision: "year" | "month" | "day";
      restrictions: {
        reason: "market" | "product" | "explicit";
      };
      type: "album";
      uri: string; // Spotify URI
      copyrights: {
        text: string;
        type: "C" | "P";
      }[];
      external_ids: {
        isrc: string;
        ean: string;
        upc: string;
      };
      genres: string[];
      label: string;
      popularity: number; // 0 ~ 100
      album_group: "album" | "single" | "compilation" | "appears_on";
      artists: {
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        name: string;
        type: "artist";
        uri: string; // Spotify URI
      }[];
    }[];
  };
}

export async function search({
  query,
  type,
  accessToken,
}: {
  query: string;
  type: "album"[];
  accessToken: string;
}): Promise<SearchApiResponse> {
  const url = new URL(`${SPOTIFY_API_URL_BASE}/search`);
  url.searchParams.append("q", query);
  url.searchParams.append("type", type.join(","));

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify API Error: ${response.status} in GET /search`);
  }

  return (await response.json()) as SearchApiResponse;
}
