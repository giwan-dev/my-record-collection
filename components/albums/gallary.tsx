import type { Album } from "@prisma/client";
import Image from "next/image";

export function AlbumGallary({
  albums,
}: {
  albums: Pick<
    Album,
    "id" | "artist" | "imageUrl" | "physicalForm" | "title"
  >[];
}) {
  const imageSize = 320;

  return (
    <ul className="grid grid-cols-3 px-2">
      {albums.map((album) => (
        <li key={album.id} className="flex flex-col pb-4">
          {album.imageUrl ? (
            <Image
              className="aspect-square object-contain"
              src={album.imageUrl}
              width={imageSize}
              height={imageSize}
              alt={`${album.title} 썸네일`}
            />
          ) : (
            <div className="w-full aspect-square bg-gradient-to-tr from-stone-300 to-stone-100" />
          )}

          <div className="text-xs p-1">
            <div className="flex justify-between items-center">
              <div className="pr-1 text-stone-900 font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                {album.title}
              </div>

              <div className="text-[8px] tracking-tight text-stone-600 font-bold rounded-sm border px-1">
                {album.physicalForm}
              </div>
            </div>
            <div className="text-stone-600 whitespace-nowrap overflow-hidden text-ellipsis">
              {album.artist}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
