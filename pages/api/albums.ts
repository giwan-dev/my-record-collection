import type { Album } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import prismaClient from "@/services/prisma";

import { nextAuthOptions } from "./auth/[...nextauth]";

export type ValuesForCreatingAlbum = Pick<
  Album,
  "title" | "artist" | "imageUrl" | "physicalForm" | "spotifyUri"
>;

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

  const data = JSON.parse(req.body) as ValuesForCreatingAlbum;

  try {
    await prismaClient.album.create({ data: { ...data, userId } });
    res.status(200).send("");
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
}
