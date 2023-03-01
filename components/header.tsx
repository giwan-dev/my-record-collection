import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export function Header() {
  return (
    <nav className="py-2 px-4 shadow-sm sticky top-0 bg-white flex justify-between gap-x-2">
      <Link href="/" className="text-lg font-light">
        음반 모음
      </Link>

      <SessionView />
    </nav>
  );
}

function SessionView() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-end gap-x-1 items-center animate-pulse">
        <div className="h-3 w-20 bg-neutral-200 rounded-full" />

        <div className="h-8 border px-2 py-1 rounded-lg text-sm flex items-center">
          <div className="h-3 w-10 bg-neutral-200 rounded-full" />
        </div>
      </div>
    );
  }

  if (session === null) {
    return (
      <button
        className="h-8 border px-2 py-1 rounded-lg text-sm"
        onClick={() => {
          void signIn("spotify");
        }}
      >
        로그인
      </button>
    );
  }

  return (
    <div className="flex justify-end gap-x-1 items-center">
      <span>
        {session.user?.name} ({session.user?.email})
      </span>

      <button
        className="h-8 border px-2 py-1 rounded-lg text-sm"
        onClick={() => {
          void signOut();
        }}
      >
        로그아웃
      </button>
    </div>
  );
}
