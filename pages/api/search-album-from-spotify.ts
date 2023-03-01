import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import prisma from "@/services/prisma";
import { search } from "@/services/spotify";

import { nextAuthOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.status(405).send("");
    return;
  }

  const { userId } = (await getServerSession(req, res, nextAuthOptions)) ?? {};

  const account = await prisma.account.findFirst({ where: { userId } });

  const accessToken = account?.access_token;
  const refreshToken = account?.refresh_token ?? undefined;

  if (!accessToken) {
    res.status(401).send("");
    return;
  }

  const { query } = req.query;

  if (query === undefined || Array.isArray(query)) {
    res.status(400).send("query의 타입을 확인하세요.");
    return;
  }

  const response = await search({
    accessToken,
    refreshToken,
    query,
    type: ["album"],
    onRefreshed: async (newToken) => {
      await prisma.account.update({
        data: {
          access_token: newToken.access_token,
          expires_at: Math.floor(Date.now() / 1000 + newToken.expires_in),
        },
        where: {
          provider_providerAccountId: {
            provider: "spotify",
            providerAccountId: account.providerAccountId,
          },
        },
      });
    },
  });

  res.status(200).json(response);
}
