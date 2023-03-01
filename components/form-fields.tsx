import type { PropsWithChildren, InputHTMLAttributes } from "react";

export function Label({
  label,
  children,
}: PropsWithChildren<{ label: string }>) {
  return (
    <label className="flex flex-col gap-y-1 text-base max-w-lg">
      <span className="text-xs text-neutral-700 font-medium">{label}</span>

      {children}
    </label>
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "border border-neutral-400 rounded-lg px-2 py-1 text-sm",
        "outline-offset-0",
        "hover:border-neutral-700",
        "focus-visible:outline-2",
        className,
      ]
        .filter((x) => !!x)
        .join(" ")}
    />
  );
}
