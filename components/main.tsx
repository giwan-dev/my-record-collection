import type { PropsWithChildren } from "react";

export function Main({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <main
      className={[className, "mx-auto max-w-3xl py-10 bg-white shadow-sm"]
        .filter((x) => !!x)
        .join(" ")}
    >
      {children}
    </main>
  );
}
