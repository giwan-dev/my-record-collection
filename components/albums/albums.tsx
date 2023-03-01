import type { Album } from "@prisma/client";
import Image from "next/image";

export function Albums({ albums }: { albums: Album[] }) {
  return (
    <ul className="p-4 flex flex-wrap gap-4">
      {albums.map((album) => (
        <li
          key={album.id}
          className="p-4 rounded-lg border flex flex-col gap-y-2 "
        >
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
