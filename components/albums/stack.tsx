import type { Album } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function AlbumStack({
  albums,
}: {
  albums: Pick<
    Album,
    | "id"
    | "title"
    | "artist"
    | "physicalForm"
    | "imageUrl"
    | "palette"
    | "paletteTheme"
  >[];
}) {
  return (
    <ul>
      {albums.map((album) => {
        const gradient =
          album.palette.length > 0
            ? `linear-gradient(135deg, ${album.palette
                .map((color, index) => `${color} ${index * 25}%`)
                .join(", ")})`
            : undefined;

        const textColors = {
          dark: "text-stone-50",
          light: "text-stone-900",
        };

        return (
          <li
            key={album.id}
            className={[
              textColors[album.paletteTheme as "dark" | "light"],
              "text-opacity-80",
            ].join(" ")}
            style={{
              background: gradient,
            }}
          >
            <AlbumAccordion album={album} />
          </li>
        );
      })}
    </ul>
  );
}

function AlbumAccordion({
  album,
  initialOpen,
}: {
  album: Pick<
    Album,
    | "id"
    | "title"
    | "artist"
    | "physicalForm"
    | "imageUrl"
    | "palette"
    | "paletteTheme"
  >;
  initialOpen?: boolean;
}) {
  const [open, setOpen] = useState(initialOpen);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const imageSize = 320;

  useEffect(() => {
    if (open) {
      const handleDocumentClick = (e: MouseEvent) => {
        if (e.target === null) {
          return;
        }

        if (!detailsRef.current?.contains(e.target as Node)) {
          setOpen(false);
        }
      };

      document.addEventListener("click", handleDocumentClick);
      return () => {
        document.removeEventListener("click", handleDocumentClick);
      };
    }
  }, [open]);

  return (
    <details
      open={open}
      onToggle={(e) => {
        setOpen(e.currentTarget.open);
      }}
      ref={detailsRef}
    >
      <summary className="px-4 py-1 flex justify-center items-center gap-x-2 text-lg font-medium cursor-pointer transition-all">
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
          {album.title}
        </span>

        <span className="opacity-80 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
          {album.artist}
        </span>
      </summary>

      <div className="p-2 flex gap-x-2">
        {album.imageUrl ? (
          <Image
            className="aspect-square object-contain"
            src={album.imageUrl}
            width={imageSize}
            height={imageSize}
            alt={`${album.title} 썸네일`}
          />
        ) : (
          <div className="w-80 aspect-square bg-gradient-to-tr from-stone-300 to-stone-100" />
        )}
        <div>
          <Link href={`/albums/${album.id}`}>편집</Link>
        </div>
      </div>
    </details>
  );
}
