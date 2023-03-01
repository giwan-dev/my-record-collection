import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import "@/common/global.css";
import { SpotifyUserProvider } from "@/components/spotify-user";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session | null }>) {
  return (
    <SessionProvider session={session}>
      <SpotifyUserProvider>
        <Component {...pageProps} />
      </SpotifyUserProvider>
    </SessionProvider>
  );
}
