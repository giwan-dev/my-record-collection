import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";

export function Header() {
  const { status } = useSession();

  return (
    <nav className="py-2 px-4 border-b-2 border-stone-50 shadow-sm sticky top-0 bg-white flex justify-between items-center gap-x-2 z-10">
      <HeaderNavLink href="/" label="Home" exact />

      {status === "authenticated" && (
        <HeaderNavLink href="/albums" label="Albums" />
      )}

      <div className="ml-auto">
        <AuthorizationButton />
      </div>
    </nav>
  );
}

function HeaderNavLink({
  href,
  label,
  exact,
}: {
  href: string;
  label: string;
  exact?: boolean;
}) {
  const { pathname } = useRouter();

  return (
    <Link
      href={href}
      className={[
        "text-lg text-center hover:text-stone-900",
        (exact ? pathname === href : pathname.startsWith(href))
          ? "font-bold border-b-2 text-stone-900 border-orange-600"
          : "text-stone-500",
      ]
        .filter((x) => !!x)
        .join(" ")}
    >
      {label}
    </Link>
  );
}

function AuthorizationButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-8 border px-2 py-1 rounded-lg text-sm flex items-center animate-pulse">
        <div className="h-3 w-10 bg-stone-200 rounded-full" />
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
