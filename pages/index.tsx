import Link from "next/link";

import { useSpotifyUser } from "@/components/spotify-user";

export default function Home() {
  const user = useSpotifyUser();
  return (
    <main>
      {user === undefined && <Link href="/login">Spotify 로그인</Link>}

      {user !== undefined && <h1>안녕하세요, {user.display_name}</h1>}

      <Link href="/search-album">스포티파이에서 앨범 검색하기</Link>
    </main>
  );
}
