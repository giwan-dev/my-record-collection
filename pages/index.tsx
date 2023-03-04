import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { signIn, useSession } from "next-auth/react";

import { AlbumStack } from "@/components/albums";
import { Main } from "@/components/main";

import type { AlbumSummary } from "./api/albums";
import { getAlbums } from "./api/albums";
import { nextAuthOptions } from "./api/auth/[...nextauth]";

interface Props {
  albums: AlbumSummary[];
}

const HEIGHT_RATIO_OF_SPOTIFY_LOGO = 709 / 2362;

export default function Home({ albums }: Props) {
  const { status, data: session } = useSession();

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
      <AlbumStack albums={albums} />

      {session?.userId && (
        <div className="fixed bottom-0 right-0 p-4">
          <button
            type="button"
            className="rounded-xl px-4 py-2 text-sm font-medium bg-stone-800 text-stone-50 opacity-70"
            onClick={() => {
              const url = new URL(
                `/users/${session.userId}`,
                window.location.href,
              );
              void navigator.clipboard.writeText(url.toString());
            }}
          >
            공유하기
          </button>
        </div>
      )}
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

  const albums = await getAlbums({ userId, order: "createdDesc" });

  return { props: { albums } };
}
