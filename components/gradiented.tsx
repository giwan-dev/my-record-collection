import type { PropsWithChildren } from "react";

export function Gradieted({
  className,
  palette,
  children,
}: PropsWithChildren<{
  className?: string;
  palette: string[];
}>) {
  const getPosition = (index: number) => {
    const yPosition = ["80%", "20%"][index % 2];
    return `${(index / 4) * 100}% ${yPosition}`;
  };
  const gradient =
    palette.length > 0
      ? palette
          .concat(palette[0])
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
      className={[className, "hover:animate-flow bg-clip-text text-transparent"]
        .filter((x) => !!x)
        .join(" ")}
      style={{
        ...(gradient
          ? { backgroundImage: gradient }
          : { backgroundColor: "rgb(28, 25, 23)" }),
        backgroundSize: "100% 500px",
        backgroundRepeat: "repeat-y",
        animationDelay: `${Math.round(Math.random() * 30) * 10}ms`,
      }}
    >
      {children}
    </div>
  );
}
