import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import "@/common/global.css";
import { Header } from "@/components/header";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session | null }>) {
  return (
    <SessionProvider session={session}>
      <div className="h-full overflow-auto bg-stone-50">
        <Header />

        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
