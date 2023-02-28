import type { AppProps } from "next/app";

import { SpotifyUserProvider } from "@/components/spotify-user";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SpotifyUserProvider>
      <Component {...pageProps} />
    </SpotifyUserProvider>
  );
}
