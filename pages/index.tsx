import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { signIn, useSession } from "next-auth/react";

import { AlbumGallary } from "@/components/albums";
import type { AlbumSummary } from "@/components/albums/gallary";
import { Main } from "@/components/main";

import { getAlbums } from "./api/albums";
import { nextAuthOptions } from "./api/auth/[...nextauth]";

interface Props {
  albums: AlbumSummary[];
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

          <span className="text-lg text-stone-900">시작하기</span>
        </button>
      </Main>
    );
  }

  if (status === "loading") {
    return <Main />;
  }

  return (
    <Main>
      <AlbumGallary albums={albums} />
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

  const albums = await getAlbums({ userId });

  return { props: { albums } };
}
