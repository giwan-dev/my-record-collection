import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import SpotifyProvider from "next-auth/providers/spotify";

import { SECRET, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "@/common/env";
import prisma from "@/services/prisma";

export default function authHandler(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return NextAuth(req, res, nextAuthOptions);
}

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: SPOTIFY_CLIENT_ID,
      clientSecret: SPOTIFY_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: SECRET,
  callbacks: {
    jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}
