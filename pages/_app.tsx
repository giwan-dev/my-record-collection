import { SpotifyUserProvider } from "@/components/spotify-user";

import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SpotifyUserProvider>
      <Component {...pageProps} />
    </SpotifyUserProvider>
  );
}
