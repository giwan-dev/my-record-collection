import Link from "next/link";

import { Albums } from "@/components/albums";
import { SpotifySearchForm } from "@/components/spotify-search";
import { useSpotifyUser } from "@/components/spotify-user";

export default function Home() {
  const user = useSpotifyUser();

  return (
    <main>
      <Albums />

      {user !== undefined ? (
        <SpotifySearchForm />
      ) : (
        <Link href="/login">Spotify 로그인</Link>
      )}
    </main>
  );
}
