import Link from "next/link";

import { Albums } from "@/components/albums";
import { NewAlbumRegisterForm } from "@/components/new-album/form";
import { SpotifySearchForm } from "@/components/spotify-search";
import { useSpotifyUser } from "@/components/spotify-user";

export default function Home() {
  const user = useSpotifyUser();

  return (
    <main className="bg-neutral-50 h-full">
      <Albums />

      <NewAlbumRegisterForm />

      {user !== undefined ? (
        <SpotifySearchForm />
      ) : (
        <Link href="/login">Spotify 로그인</Link>
      )}
    </main>
  );
}
