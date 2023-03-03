import type { Album } from "@prisma/client";

export function AlbumList({
  albums,
  onDelete,
}: {
  albums: Album[];
  onDelete?: (albumId: string) => void;
}) {
  return (
    <ul className="mt-5 px-4 flex flex-col gap-y-1">
      {albums.map((album) => (
        <li
          key={album.id}
          className="text-base flex justify-between items-center"
        >
          <span className="text-lg text-stone-900 font-bold">
            {album.title}
          </span>
          <span className="text-stone-500"> - {album.artist}</span>

          {onDelete && (
            <button
              className="ml-auto text-sm rounded-md px-2 py-1 text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-all active:bg-stone-300"
              type="button"
              onClick={() => {
                onDelete(album.id);
              }}
            >
              삭제
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
