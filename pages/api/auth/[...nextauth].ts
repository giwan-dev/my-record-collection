import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import SpotifyProvider from "next-auth/providers/spotify";

import { SECRET, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "@/common/env";
import prismaClient from "@/services/prisma";

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
  adapter: PrismaAdapter(prismaClient),
  secret: SECRET,
  callbacks: {
    session({ session, user }) {
      session.userId = user.id;
      return session;
    },
  },
};

declare module "next-auth" {
  interface Session {
    userId: string;
  }
}
