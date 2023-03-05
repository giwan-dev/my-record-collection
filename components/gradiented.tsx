import type { PropsWithChildren } from "react";

export function Gradieted({
  className,
  palette,
  paletteTheme,
  children,
}: PropsWithChildren<{
  className?: string;
  palette: string[];
  paletteTheme: "light" | "dark";
}>) {
  const getPosition = (index: number) => {
    const yPosition = ["80%", "20%"][index % 2];
    return `${(index / 3) * 100}% ${yPosition}`;
  };
  const gradient =
    palette.length > 0
      ? palette
          .map(
            (color, index) =>
              `radial-gradient(circle at ${getPosition(
                index,
              )}, ${color} 0%, transparent 65%)`,
          )
          .join(", ")
      : undefined;

  return (
    <div
      className={[
        className,
        { light: "text-stone-900", dark: "text-stone-50" }[paletteTheme],
        "contrast-75",
      ].join(" ")}
      style={{ background: gradient }}
    >
      {children}
    </div>
  );
}
