import { useSpotifyUser } from "@/components/spotify-user";
import Link from "next/link";

export default function Home() {
  const user = useSpotifyUser();
  return (
    <main>
      {user === undefined && <Link href="/login">Spotify 로그인</Link>}

      {user !== undefined && <h1>안녕하세요, {user.display_name}</h1>}
    </main>
  );
}
