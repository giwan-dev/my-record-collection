import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "@/common/env";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

export default function HandleSpotifyLoginPage() {
  return null;
}

export async function getServerSideProps({
  query,
  res,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<unknown>> {
  const { code, error } = query;

  if (code === undefined || error !== undefined) {
    throw new Error(error as string); // FIXME
  }

  const body = new URLSearchParams();

  body.append("grant_type", "authorization_code");
  body.append("code", code as string); // FIXME
  body.append("redirect_uri", "http://localhost:3000/handle-spotify-login");
  body.append("client_id", SPOTIFY_CLIENT_ID);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`FetchError - ${response.status}`);
  }

  const {
    access_token,
    refresh_token,
    expires_in,
  }: {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
  } = await response.json();

  res.setHeader(
    "Set-Cookie",
    [
      `SP_AT=${access_token}`,
      "HttpOnly",
      "Secure",
      `Max-Age=${expires_in}`,
      "SameSite=Strict",
    ].join("; ")
  );
  res.setHeader(
    "Set-Cookie",
    [`SP_RT=${refresh_token}`, "HttpOnly", "Secure", "SameSite=Strict"].join(
      "; "
    )
  );

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}