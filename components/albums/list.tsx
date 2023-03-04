import type { Album } from "@prisma/client";

export function AlbumList({
  albums,
  onEdit,
  onDelete,
}: {
  albums: Pick<
    Album,
    "id" | "physicalForm" | "title" | "artist" | "autographed"
  >[];
  onEdit?: (albumId: string, patch: Pick<Album, "autographed">) => void;
  onDelete?: (albumId: string) => void;
}) {
  return (
    <ul className="mt-5 px-4 flex flex-col gap-y-1">
      {albums.map((album) => (
        <li
          key={album.id}
          className="text-base flex justify-between items-center gap-x-2"
        >
          <div className="text-[8px] tracking-tight text-stone-600 font-bold rounded-sm border px-1">
            {album.physicalForm}
          </div>

          <span className="text-lg text-stone-900 font-bold whitespace-nowrap overflow-hidden text-ellipsis">
            {album.title}
          </span>

          <span className="mr-auto text-stone-500 whitespace-nowrap overflow-hidden text-ellipsis">
            {album.artist}
          </span>

          {onEdit && (
            <input
              className="flex-shrink-0"
              type="checkbox"
              defaultChecked={album.autographed}
              onChange={(e) => {
                onEdit(album.id, { autographed: e.currentTarget.checked });
              }}
            />
          )}

          {onDelete && (
            <button
              className="flex-shrink-0 text-sm rounded-md px-2 py-1 text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-all active:bg-stone-300"
              type="button"
              onClick={() => {
                const response = window.confirm("정말 삭제하시겠습니까?");
                if (response) {
                  onDelete(album.id);
                }
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
