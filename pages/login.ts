import type { GetServerSidePropsResult } from "next";

import { SPOTIFY_CLIENT_ID } from "@/common/env";

export default function LoginPage() {
  return null;
}

export function getServerSideProps(): Promise<
  GetServerSidePropsResult<unknown>
> {
  const url = new URL("https://accounts.spotify.com/authorize");

  url.searchParams.append("response_type", "code");
  url.searchParams.append("client_id", SPOTIFY_CLIENT_ID);
  url.searchParams.append("scope", "user-read-private user-read-email");
  url.searchParams.append(
    "redirect_uri",
    "http://localhost:3000/handle-spotify-login",
  );

  return Promise.resolve({
    redirect: { destination: url.toString(), permanent: true },
  });
}
