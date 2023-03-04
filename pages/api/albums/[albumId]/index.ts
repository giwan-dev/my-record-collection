import type { Album } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import prismaClient from "@/services/prisma";

import { nextAuthOptions } from "../../auth/[...nextauth]";

export default async function hander(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    res.status(405).send("");
    return;
  }

  const { userId } = (await getServerSession(req, res, nextAuthOptions)) ?? {};

  if (userId === undefined) {
    res.status(401).send("");
    return;
  }

  try {
    const { albumId } = req.query;

    if (albumId === undefined || Array.isArray(albumId)) {
      res.status(400).json({ error: "Invalid albumId" });
      return;
    }

    if (req.method === "DELETE") {
      await prismaClient.album.delete({
        where: { id: albumId },
      });

      res.status(204).send("");
      return;
    }

    const patch = req.body as Partial<Album>;

    await prismaClient.album.update({
      where: { id: albumId },
      data: patch,
    });
    res.status(204).send("");
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
}
