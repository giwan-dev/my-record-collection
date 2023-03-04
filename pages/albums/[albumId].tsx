import type { Album } from "@prisma/client";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import NextImage from "next/image";
import { getServerSession } from "next-auth";
import { useState } from "react";

import { Main } from "@/components/main";
import prismaClient from "@/services/prisma";

import { nextAuthOptions } from "../api/auth/[...nextauth]";

interface Props {
  album: Omit<Album, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
  };
}

const textColors = {
  dark: "rgb(250, 250, 249)", // stone-50
  light: "rgb(28, 25, 23)", // stone-900
};

export default function AlbumDetailPage({ album: initialAlbum }: Props) {
  const imageSize = 320;
  const [album, setAlbum] = useState(initialAlbum);

  const gradient =
    album.palette.length > 0
      ? `linear-gradient(90deg, ${album.palette
          .map((color, index) => `${color} ${index * 25}%`)
          .join(", ")})`
      : undefined;
  const textColor = album.paletteTheme
    ? textColors[album.paletteTheme as "dark" | "light"]
    : undefined;

  const putPalette = () => {
    void fetch(`/api/albums/${album.id}/palette`, { method: "PUT" })
      .then(async (response) => {
        const { palette, paletteTheme } = (await response.json()) as Pick<
          Album,
          "palette" | "paletteTheme"
        >;
        setAlbum((prev) => ({ ...prev, palette, paletteTheme }));
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <Main>
      {album.imageUrl && (
        <div className="p-2 flex gap-x-4">
          <NextImage
            className="aspect-square object-contain"
            src={album.imageUrl}
            width={imageSize}
            height={imageSize}
            alt={`${album.title} 썸네일`}
          />

          <div className="flex-grow flex flex-col gap-y-1">
            <div
              className="w-full px-4 py-1 flex justify-center items-center gap-x-2"
              style={{ background: gradient, color: textColor }}
            >
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
              onClick={putPalette}
            >
              팔레트 업데이트
            </button>
          </div>
        </div>
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
