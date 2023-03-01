import type { Album } from "@prisma/client";
import Image from "next/image";

export function Albums({ albums }: { albums: Album[] }) {
  const imageSize = 300;

  return (
    <ul className="grid grid-cols-3 px-2">
      {albums.map((album) => (
        <li key={album.id} className="flex flex-col gap-y-1">
          {album.imageUrl ? (
            <Image
              src={album.imageUrl}
              width={imageSize}
              height={imageSize}
              alt={`${album.title} 썸네일`}
            />
          ) : null}

          <div className="text-xs px-1">
            <div className="flex justify-between items-center">
              <div className="text-neutral-900 font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                {album.title}
              </div>

              <div className="text-[8px] tracking-tight text-neutral-600 font-bold rounded-sm border px-1">
                {album.physicalForm}
              </div>
            </div>
            <div className="text-neutral-600 whitespace-nowrap overflow-hidden text-ellipsis">
              {album.artist}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
