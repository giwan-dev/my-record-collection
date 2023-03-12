import type { Album } from "@prisma/client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Gradieted } from "../gradiented";

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
    <ul className="px-4 py-4 flex flex-col gap-y-2">
      {albums.map((album) => (
        <li key={album.id}>
          <AlbumAccordion album={album} />
        </li>
      ))}
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
      className="rounded border p-2 overflow-hidden"
      open={open}
      onToggle={(e) => {
        setOpen(e.currentTarget.open);
      }}
      ref={detailsRef}
    >
      <summary className="cursor-pointer block">
        <Gradieted className="w-fit" palette={album.palette}>
          <div className="text-lg font-bold">{album.title}</div>
          <div className="text-sm font-medium">{album.artist}</div>
        </Gradieted>
      </summary>

      <div className="mt-3 w-full flex justify-center">
        {album.imageUrl ? (
          <Image
            className="w-full aspect-square object-contain"
            src={album.imageUrl}
            width={imageSize}
            height={imageSize}
            alt={`${album.title} 썸네일`}
          />
        ) : (
          <div className="w-80 aspect-square bg-gradient-to-tr from-stone-300 to-stone-100" />
        )}
      </div>
    </details>
  );
}
