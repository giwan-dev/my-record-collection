import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";

export function Header() {
  const { status } = useSession();

  return (
    <nav className="py-2 px-4 shadow-sm sticky top-0 bg-white flex justify-between items-center gap-x-2 z-10">
      <HeaderNavLink href="/" label="/" className="w-8" />

      {status === "authenticated" && (
        <HeaderNavLink href="/new" label="New Album" />
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
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  const { pathname } = useRouter();

  return (
    <Link
      href={href}
      className={[
        className,
        "text-lg text-center hover:text-neutral-900",
        pathname === href
          ? "font-bold border-b-2 text-neutral-900 border-orange-600"
          : "text-neutral-500",
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
