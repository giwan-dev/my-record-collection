import type { Album } from "@prisma/client";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import NextImage from "next/image";
import { getServerSession } from "next-auth";
import { useState } from "react";

import { createPalette, getTheme } from "@/common/palette";
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

  const patchPalette = async (imageUrl: string) => {
    try {
      const palette = await createPalette(imageUrl);
      const paletteTheme = getTheme(palette);
      const response = await fetch(`/api/albums/${album.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ palette, paletteTheme }),
      });
      if (response.ok) {
        setAlbum((prev) => ({ ...prev, palette, paletteTheme }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Main>
      {album.imageUrl && (
        <Gradieted
          className="p-2 flex gap-x-4"
          palette={album.palette}
          paletteTheme={album.paletteTheme as "light" | "dark"}
        >
          <NextImage
            className="aspect-square object-contain"
            src={album.imageUrl}
            width={imageSize}
            height={imageSize}
            alt={`${album.title} 썸네일`}
          />

          <div className="flex-grow flex flex-col gap-y-1">
            <div className="w-full px-4 py-1 flex justify-center items-center gap-x-2">
              <span className="text-lg font-medium">{album.title}</span>
              <span className="text-sm opacity-60">{album.artist}</span>
            </div>

            {album.palette.length > 0 && (
              <div className="flex w-full gap-x-1">
                {album.palette.map((color) => (
                  <div
                    key={color}
                    className="h-20 flex-1"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}

            <button
              type="button"
              className="border-2 rounded-xl px-6 py-2 text-lg border-stone-500 bg-stone-50 text-stone-800 hover:border-stone-600 hover:bg-stone-200 active:border-stone-700 active:bg-stone-300 transition-all font-medium"
              onClick={() => {
                if (album.imageUrl) {
                  void patchPalette(album.imageUrl);
                }
              }}
            >
              팔레트 업데이트
            </button>
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
