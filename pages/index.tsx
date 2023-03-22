import type { GetStaticPropsResult } from "next";
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

import { Main } from "@/components/main";
import prismaClient from "@/services/prisma";

interface Props {
  users: { id: string; name: string }[];
}

const HEIGHT_RATIO_OF_SPOTIFY_LOGO = 709 / 2362;

export default function Home({ users: allUsers }: Props) {
  const { status, data: currentUser } = useSession();

  const width = 120;
  const height = Math.round(HEIGHT_RATIO_OF_SPOTIFY_LOGO * width);

  const users = allUsers.filter((user) => user.id !== currentUser?.userId);

  return (
    <Main className="px-4 py-6 flex flex-col gap-y-4">
      {status === "unauthenticated" && (
        <section>
          <button
            className="border rounded-lg px-4 py-2 flex items-center gap-x-1 hover:bg-stone-100 active:bg-stone-200 transition-colors"
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
        </section>
      )}

      <section className="flex flex-col gap-y-2">
        {status === "authenticated" && (
          <Link
            className="text-stone-500 underline"
            href={`/users/${currentUser.userId}`}
          >
            내 컬렉션 보러 가기
          </Link>
        )}

        {users.map((user) => (
          <Link
            className="text-stone-500 underline"
            key={user.id}
            href={`/users/${user.id}`}
          >
            {user.name}님의 컬렉션 보러 가기
          </Link>
        ))}
      </section>
    </Main>
  );
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  const users = await prismaClient.user.findMany();

  return {
    props: {
      users: users.map((user) => ({
        id: user.id,
        name: user.name ?? "(이름 없음)",
      })),
    },
  };
}
