import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { AlbumStack } from "@/components/albums";
import { Main } from "@/components/main";
import prismaClient from "@/services/prisma";

import type { AlbumSummary } from "../api/albums";
import { getAlbums } from "../api/albums";

interface Props {
  albums: AlbumSummary[];
}

export default function UserPage({ albums }: Props) {
  return (
    <Main>
      <AlbumStack albums={albums} />
    </Main>
  );
}

export async function getServerSideProps({
  query,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  const { userId } = query;

  if (userId === undefined || Array.isArray(userId)) {
    throw new Error("Invalid user ID");
  }

  const count = await prismaClient.user.count({ where: { id: userId } });

  if (count === 0) {
    return { notFound: true };
  }

  const albums = await getAlbums({ userId });

  return { props: { albums } };
}
