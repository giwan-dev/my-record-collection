import type { PropsWithChildren } from "react";

export function Main({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return <main className={[className, "py-10"].join(" ")}>{children}</main>;
}
