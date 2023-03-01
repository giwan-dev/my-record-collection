import Image from "next/image";

import type { Album } from "@/components/new-album";

const albums: Album[] = [
  {
    id: "1",
    title: "Bleached",
    artist: "Loco",
    imageUrl:
      "https://i.scdn.co/image/ab67616d0000b27311ffae18db3eeb12217bf206",
  },
  {
    id: "2",
    title: "Original",
    artist: "차붐",
    imageUrl:
      "https://i.scdn.co/image/ab67616d0000b2734fdf206be2d70b5fee489c79",
  },
];

export function Albums() {
  return (
    <ul className="flex flex-wrap gap-8 p-10">
      {albums.map((album) => (
        <li key={album.id} className="flex flex-col gap-y-2">
          {album.imageUrl ? (
            <Image
              src={album.imageUrl}
              width={320}
              height={320}
              alt={`${album.title} 썸네일`}
            />
          ) : null}

          <div className="flex gap-x-2">
            <span className="text-neutral-800 text-lg">{album.artist}</span>
            <span className="text-neutral-800 font-bold text-xl">
              {album.title}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
