import type { Album } from "@prisma/client";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import NextImage from "next/image";
import { getServerSession } from "next-auth";
import { useState } from "react";

import { AlbumPalette } from "@/components/album-palette";
import { Gradieted } from "@/components/gradiented";
import { Main } from "@/components/main";
import prismaClient from "@/services/prisma";

import { nextAuthOptions } from "../api/auth/[...nextauth]";

interface Props {
  album: Omit<Album, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
  };
}

export default function AlbumDetailPage({ album: initialAlbum }: Props) {
  const imageSize = 320;
  const [album, setAlbum] = useState(initialAlbum);

  return (
    <Main>
      <AlbumPalette
        albumId={album.id}
        imageUrl={album.imageUrl}
        palette={album.palette}
        onChange={(values) => setAlbum((prev) => ({ ...prev, ...values }))}
      />

      {album.imageUrl && (
        <Gradieted
          className="p-2 flex gap-x-4"
          palette={album.palette}
          animate={false}
        >
          <NextImage
            className="aspect-square object-contain"
            src={album.imageUrl}
            width={imageSize}
            height={imageSize}
            alt={`${album.title} 썸네일`}
          />

          <div className="flex-grow flex flex-col gap-y-1 items-start">
            <div className="w-full px-4 py-1 flex justify-center items-center gap-x-2">
              <span className="text-lg font-medium">{album.title}</span>
              <span className="text-sm opacity-60">{album.artist}</span>
            </div>
          </div>
        </Gradieted>
      )}
    </Main>
  );
}

export async function getServerSideProps({
  query,
  req,
  res,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  const { albumId } = query;

  if (albumId === undefined || Array.isArray(albumId)) {
    throw new Error("Invalid Album ID");
  }

  const { userId } = (await getServerSession(req, res, nextAuthOptions)) ?? {};

  if (userId === undefined) {
    return { notFound: true };
  }

  const album = await prismaClient.album.findUnique({
    where: { id: albumId },
  });

  if (album === null) {
    return { notFound: true };
  }

  if (album.userId !== userId) {
    return { notFound: true };
  }

  return {
    props: {
      album: {
        ...album,
        createdAt: album.createdAt.toISOString(),
        updatedAt: album.updatedAt.toISOString(),
      },
    },
  };
}
