import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import SpotifyProvider from "next-auth/providers/spotify";

import { SECRET, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "@/common/env";
import prisma from "@/services/prisma";

export default function authHandler(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return NextAuth(req, res, options);
}

const options: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: SPOTIFY_CLIENT_ID,
      clientSecret: SPOTIFY_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: SECRET,
};
