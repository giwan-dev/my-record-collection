import { Disclosure, Transition } from "@headlessui/react";
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
  const imageSize = 320;

  useEffect(() => {
    if (open) {
      const handleDocumentClick = (e: MouseEvent) => {
        if (e.target === null) {
          return;
        }

        if (!detailsRef.current?.contains(e.target as Node)) {
          setDefferedOpen(false);
          setTimeoutWithRaf(() => setOpen(false), 150);
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
    <Disclosure as="div" className="rounded-xl border p-1" ref={detailsRef}>
      <Disclosure.Button
        className="w-full rounded-lg px-2 py-1 text-left hover:bg-stone-100 active:bg-stone-200"
        onClick={() => {
          if (open) {
            setDefferedOpen(false);
            setTimeoutWithRaf(() => setOpen(false), 150);
          } else {
            setOpen(true);
            setTimeoutWithRaf(() => setDefferedOpen(true), 150);
          }
        }}
      >
        <Gradieted className="w-fit" palette={album.palette} animate={open}>
          <div className="text-lg font-bold">{album.title}</div>
          <div className="text-sm font-medium">{album.artist}</div>
        </Gradieted>
      </Disclosure.Button>

      {open && (
        <Disclosure.Panel static className="w-full overflow-hidden">
          <Transition
            className="p-2"
            show={defferedOpen}
            enter="transition-[opacity,transform]"
            enterFrom="opacity-0 -translate-y-full"
            enterTo="opacity-100 translate-y-0"
            leave="transition-[opacity,transform]"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-full"
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
          </Transition>
        </Disclosure.Panel>
      )}
    </Disclosure>
  );
}

function setTimeoutWithRaf(callback: () => void, timeout: number) {
  let startTimestamp: number | null = null;

  const handleAnimationFrame = (timestamp: number) => {
    if (startTimestamp === null) {
      startTimestamp = timestamp;
      window.requestAnimationFrame(handleAnimationFrame);
      return;
    }

    if (timestamp - startTimestamp < timeout) {
      window.requestAnimationFrame(handleAnimationFrame);
      return;
    }

    callback();
  };

  window.requestAnimationFrame(handleAnimationFrame);
}
