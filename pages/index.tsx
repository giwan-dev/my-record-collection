import type { Album } from "@prisma/client";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import type { PropsWithChildren } from "react";

import { Albums } from "@/components/albums";
import { NewAlbumRegisterForm } from "@/components/new-album/form";
import { SpotifySearchForm } from "@/components/spotify-search";
import prisma from "@/services/prisma";

import { nextAuthOptions } from "./api/auth/[...nextauth]";

interface Props {
  albums: Album[];
}

const HEIGHT_RATIO_OF_SPOTIFY_LOGO = 709 / 2362;

export default function Home({ albums }: Props) {
  const { status } = useSession();

  if (status === "unauthenticated") {
    const width = 120;
    const height = Math.round(HEIGHT_RATIO_OF_SPOTIFY_LOGO * width);

    return (
      <Main className="h-full flex justify-center items-center">
        <button
          className="border rounded-lg px-4 py-2 flex items-center gap-x-1"
          onClick={() => {
            void signIn("spotify");
          }}
        >
          <Image
            className="inline-block"
            src="/Spotify_Logo_RGB_Green.png"
            alt="Spotify"
            width={width}
            height={height}
          />

          <span className="text-lg text-neutral-900">시작하기</span>
        </button>
      </Main>
    );
  }

  if (status === "loading") {
    return <Main />;
  }

  return (
    <Main>
      <Albums albums={albums} />

      <NewAlbumRegisterForm />

      <SpotifySearchForm />
    </Main>
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

function Main({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <main className={[className, "px-4", "py-10"].join(" ")}>{children}</main>
  );
}
