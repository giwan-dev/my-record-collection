import type { Album } from "@prisma/client";

export function AlbumList({ albums }: { albums: Album[] }) {
  return (
    <ul className="mt-5 px-4 flex flex-col gap-y-1">
      {albums.map((album) => (
        <li key={album.id} className="text-base">
          <span className="text-lg text-stone-900 font-bold">
            {album.title}
          </span>
          <span className="text-stone-500"> - {album.artist}</span>
        </li>
      ))}
    </ul>
  );
}
