import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import type { ValuesForCreatingAlbum } from "@/components/new-album";
import prisma from "@/services/prisma";

import { nextAuthOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).send("");
    return;
  }

  const { userId } = (await getServerSession(req, res, nextAuthOptions)) ?? {};

  if (userId === undefined) {
    res.status(401).send("");
    return;
  }

  if (typeof req.body !== "string") {
    res.status(400).json({ error: "Invalid body format" });
    return;
  }

  const { title, artist, imageUrl } = JSON.parse(
    req.body,
  ) as ValuesForCreatingAlbum;

  try {
    await prisma.album.create({
      data: { title, artist, imageUrl, userId },
    });
    res.status(200).send("");
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
}
