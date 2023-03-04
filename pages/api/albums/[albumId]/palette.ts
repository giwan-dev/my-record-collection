import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { createPalette, getTheme } from "@/common/palette";
import prismaClient from "@/services/prisma";

import { nextAuthOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    res.status(405).send("");
    return;
  }

  const { userId } = (await getServerSession(req, res, nextAuthOptions)) ?? {};

  if (userId === undefined) {
    res.status(401).send("");
    return;
  }

  const { albumId } = req.query;

  if (albumId === undefined || Array.isArray(albumId)) {
    res.status(400).json({ error: "Invalid albumId" });
    return;
  }

  try {
    const album = await prismaClient.album.findUnique({
      where: { id: albumId },
    });

    if (album === null) {
      res.status(404).send("");
      return;
    }

    if (album.imageUrl === null) {
      res.status(400).json({ error: "There is no image to make palette" });
      return;
    }

    const palette = await createPalette(album.imageUrl);
    const paletteTheme = getTheme(palette);

    await prismaClient.album.update({
      where: { id: albumId },
      data: { palette, paletteTheme },
    });
    res.status(201).json({ palette, paletteTheme });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
}
