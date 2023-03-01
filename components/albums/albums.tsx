import type { Album } from "@prisma/client";
import Image from "next/image";

export function Albums({ albums }: { albums: Album[] }) {
  const imageSize = 300;

  return (
    <ul className="grid grid-cols-3">
      {albums.map((album) => (
        <li key={album.id} className="flex flex-col">
          {album.imageUrl ? (
            <Image
              src={album.imageUrl}
              width={imageSize}
              height={imageSize}
              alt={`${album.title} 썸네일`}
            />
          ) : null}

          <span className="text-base text-neutral-700 whitespace-nowrap overflow-hidden text-ellipsis">
            <span className="inline-block mr-1">{album.artist}</span>
            <span className="font-bold">{album.title}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
