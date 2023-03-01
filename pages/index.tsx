import { useSession } from "next-auth/react";

import { Albums } from "@/components/albums";
import { NewAlbumRegisterForm } from "@/components/new-album/form";
import { SpotifySearchForm } from "@/components/spotify-search";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="h-full">
      <Albums />

      <NewAlbumRegisterForm />

      {session !== null && <SpotifySearchForm />}
    </main>
  );
}
