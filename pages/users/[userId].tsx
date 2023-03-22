import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";

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

interface Params {
  [key: string]: string | string[] | undefined;
  userId: string;
}

export async function getStaticPaths(): Promise<GetStaticPathsResult<Params>> {
  const users = await prismaClient.user.findMany();
  return {
    paths: users.map((user) => ({ params: { userId: user.id } })),
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<Params>): Promise<GetStaticPropsResult<Props>> {
  const userId = params?.userId;

  if (userId === undefined || Array.isArray(userId)) {
    throw new Error("Invalid user ID");
  }

  const count = await prismaClient.user.count({ where: { id: userId } });

  if (count === 0) {
    return { notFound: true };
  }

  const albums = await getAlbums({ userId, order: "createdDesc" });

  return { props: { albums } };
}
