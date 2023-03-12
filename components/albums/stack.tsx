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
  const [open, setOpen] = useState(!!initialOpen);
  const [defferedOpen, setDefferedOpen] = useState(open);
  const detailsRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const imageSize = 320;

  useEffect(() => {
    if (open) {
      const handleDocumentClick = (e: MouseEvent) => {
        if (e.target === null) {
          return;
        }

        if (!detailsRef.current?.contains(e.target as Node)) {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }

          setDefferedOpen(false);

          timerRef.current = setTimeout(() => {
            setOpen(false);
          }, 150);
        }
      };

      document.addEventListener("click", handleDocumentClick);
      return () => {
        document.removeEventListener("click", handleDocumentClick);
      };
    }
  }, [open]);

  useEffect(() => {
    if (open && defferedOpen) {
      window.requestAnimationFrame(() => {
        detailsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
  }, [defferedOpen, open]);

  return (
    <div className="rounded border p-1" ref={detailsRef}>
      <button
        className="w-full rounded-lg px-2 py-1 text-left hover:bg-stone-100 active:bg-stone-200"
        onClick={() => {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }

          if (open) {
            setDefferedOpen(false);

            timerRef.current = setTimeout(() => {
              setOpen(false);
            }, 150);
          } else {
            setOpen(true);

            timerRef.current = setTimeout(() => {
              setDefferedOpen(true);
            }, 150);
          }
        }}
      >
        <Gradieted className="w-fit" palette={album.palette} animate={open}>
          <div className="text-lg font-bold">{album.title}</div>
          <div className="text-sm font-medium">{album.artist}</div>
        </Gradieted>
      </button>

      {open && (
        <div className="mt-3 w-full pb-2 overflow-hidden">
          <div
            className={[
              "px-2 flex justify-center transition-all transform-gpu",
              defferedOpen ? "opacity-100" : "opacity-0 -translate-y-full",
            ]
              .filter((x) => !!x)
              .join(" ")}
          >
            {album.imageUrl ? (
              <Image
                className="w-full aspect-square object-contain"
                src={album.imageUrl}
                width={imageSize}
                height={imageSize}
                alt={`${album.title} 썸네일`}
              />
            ) : (
              <div className="w-full aspect-square bg-gradient-to-tr from-stone-300 to-stone-100" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
