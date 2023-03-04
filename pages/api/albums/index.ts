import type { Album, Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import prismaClient from "@/services/prisma";

import { nextAuthOptions } from "../auth/[...nextauth]";

export type ValuesForCreatingAlbum = Pick<
  Album,
  "title" | "artist" | "imageUrl" | "physicalForm" | "spotifyUri"
>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST" && req.method !== "GET") {
    res.status(405).send("");
    return;
  }

  const { userId } = (await getServerSession(req, res, nextAuthOptions)) ?? {};

  if (userId === undefined) {
    res.status(401).send("");
    return;
  }

  try {
    if (req.method === "POST") {
      if (typeof req.body !== "string") {
        res.status(400).json({ error: "Invalid body format" });
        return;
      }

      const data = JSON.parse(req.body) as ValuesForCreatingAlbum;

      await prismaClient.album.create({ data: { ...data, userId } });
      res.status(200).send("");
      return;
    }

    const { order } = req.query;

    if (Array.isArray(order)) {
      res.status(400).json({ error: "Invalid query format" });
      return;
    }
    const albums = await getAlbums({ userId, order: order as OrderType });

    res.status(200).json(albums);
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export type OrderType = "createdDesc" | "updatedDesc";

const orderByMap: Record<OrderType, Prisma.AlbumOrderByWithRelationInput> = {
  createdDesc: { createdAt: "desc" },
  updatedDesc: { updatedAt: "desc" },
};

type AlbumSummaryKeys =
  | "id"
  | "title"
  | "artist"
  | "physicalForm"
  | "imageUrl"
  | "autographed";

export type AlbumSummary = Pick<Album, AlbumSummaryKeys>;

const getAlbumsSelect: Record<AlbumSummaryKeys, true> = {
  id: true,
  title: true,
  artist: true,
  physicalForm: true,
  imageUrl: true,
  autographed: true,
};

export async function getAlbums({
  userId,
  order,
}: {
  userId: string;
  order?: OrderType;
}) {
  return await prismaClient.album.findMany({
    select: getAlbumsSelect,
    where: { userId },
    orderBy: order ? [orderByMap[order]] : undefined,
  });
}
