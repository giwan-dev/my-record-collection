import { signIn, signOut, useSession } from "next-auth/react";

export function Header() {
  return (
    <nav className="py-2 px-4 shadow-sm sticky top-0 bg-white flex justify-end gap-x-2 z-10">
      <SessionView />
    </nav>
  );
}

function SessionView() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-8 border px-2 py-1 rounded-lg text-sm flex items-center animate-pulse">
        <div className="h-3 w-10 bg-neutral-200 rounded-full" />
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
    <button
      className="h-8 border px-2 py-1 rounded-lg text-sm"
      onClick={() => {
        void signOut();
      }}
    >
      로그아웃
    </button>
  );
}
