import type { AppProps } from "next/app";
import localFont from "next/font/local";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import "@/common/global.css";

const pretendard = localFont({ src: "./PretendardVariable.woff2" });

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session | null }>) {
  return (
    <SessionProvider session={session}>
      <div className={pretendard.className}>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
