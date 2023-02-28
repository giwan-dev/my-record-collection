import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { SPOTIFY_CLIENT_ID } from "@/common/env";
import { getProtocol } from "@/utils/vercel";

export default function LoginPage() {
  return null;
}

export function getServerSideProps({
  req: {
    headers: { host },
  },
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<unknown>> {
  if (host === undefined) {
    throw new Error("절대 경로를 알 수 없습니다.");
  }

  const redirectUrl = new URL(
    "/handle-spotify-login",
    `${getProtocol()}${host}`,
  );

  const url = new URL("https://accounts.spotify.com/authorize");

  url.searchParams.append("response_type", "code");
  url.searchParams.append("client_id", SPOTIFY_CLIENT_ID);
  url.searchParams.append("scope", "user-read-private user-read-email");
  url.searchParams.append("redirect_uri", redirectUrl.toString());

  return Promise.resolve({
    redirect: { destination: url.toString(), permanent: false },
  });
}
