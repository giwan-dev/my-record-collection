import type { Album } from "@prisma/client";
import Image from "next/image";

export function Albums({ albums }: { albums: Album[] }) {
  const imageSize = 240;

  return (
    <ul className="flex flex-wrap gap-4">
      {albums.map((album) => (
        <li
          key={album.id}
          className="flex-0 px-2 py-4 rounded-lg border flex flex-col gap-y-2 "
        >
          {album.imageUrl ? (
            <Image
              src={album.imageUrl}
              width={imageSize}
              height={imageSize}
              alt={`${album.title} 썸네일`}
            />
          ) : null}

          <div className="flex gap-x-2 text-base text-neutral-700">
            <span>{album.artist}</span>
            <span className="font-bold">{album.title}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
