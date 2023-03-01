import Link from "next/link";

import { Albums } from "@/components/albums";
import { useSpotifyUser } from "@/components/spotify-user";

export default function Home() {
  const user = useSpotifyUser();

  return (
    <main>
      <Albums />

      {user === undefined && <Link href="/login">Spotify 로그인</Link>}

      {user !== undefined && <h1>안녕하세요, {user.display_name}</h1>}
    </main>
  );
}
