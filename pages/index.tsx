import type { Album } from "@prisma/client";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

import { Albums } from "@/components/albums";
import { NewAlbumRegisterForm } from "@/components/new-album/form";
import { SpotifySearchForm } from "@/components/spotify-search";
import prisma from "@/services/prisma";

import { nextAuthOptions } from "./api/auth/[...nextauth]";

interface Props {
  albums: Album[];
}

export default function Home({ albums }: Props) {
  const { data: session } = useSession();

  return (
    <main className="h-full">
      <Albums albums={albums} />

      <NewAlbumRegisterForm />

      {session !== null && <SpotifySearchForm />}
    </main>
  );
}

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  const { userId } = (await getServerSession(req, res, nextAuthOptions)) ?? {};

  if (!userId) {
    return { props: { albums: [] } };
  }

  const albums = await prisma.album.findMany({ where: { userId } });

  return { props: { albums } };
}
