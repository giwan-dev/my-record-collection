import type {
  PropsWithChildren,
  InputHTMLAttributes,
  SelectHTMLAttributes,
} from "react";

export function Label({
  label,
  children,
}: PropsWithChildren<{ label: string }>) {
  return (
    <label className="flex flex-col gap-y-1 text-base max-w-lg">
      <span className="text-xs text-stone-700 font-medium">{label}</span>

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
        "border border-stone-400 rounded-lg px-2 py-1",
        "outline-offset-0",
        "hover:border-stone-700",
        "focus-visible:outline-2",
        "text-base",
        className,
      ]
        .filter((x) => !!x)
        .join(" ")}
    />
  );
}

export function Select({
  children,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        "text-base border border-stone-400 rounded-lg px-2 py-1 bg-transparent hover:border-stone-700 focus-visible:outline-2 h-6 box-content",
        className,
      ]
        .filter((x) => !!x)
        .join(" ")}
    >
      {children}
    </select>
  );
}
