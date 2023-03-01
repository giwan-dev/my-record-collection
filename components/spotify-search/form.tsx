import Image from "next/image";
import { useState } from "react";

import type { SearchApiResponse } from "@/services/spotify";

const ALBUM_TITLE_INPUT_NAME = "album-title";

export function SpotifySearchForm() {
  const [albums, setAlbums] = useState<SearchApiResponse["albums"]["items"]>(
    [],
  );

  const extractQueryFromFormData = (formData: FormData): string => {
    const inputValue = formData.get(ALBUM_TITLE_INPUT_NAME);

    if (inputValue instanceof File || inputValue === null) {
      throw new Error(
        `${ALBUM_TITLE_INPUT_NAME}가 가지는 값의 형식은 string이어야 합니다.`,
      );
    }

    return inputValue.trim();
  };

  const fetchAlbums = async (query: string) => {
    const searchParams = new URLSearchParams([["query", query]]);

    const response = await fetch(
      `/api/search-album-from-spotify?${searchParams.toString()}`,
    );

    if (response.ok) {
      const {
        albums: { items },
      } = (await response.json()) as SearchApiResponse;

      setAlbums(items);
    }
  };

  return (
    <div className="flex flex-col gap-y-4 p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);
          const query = extractQueryFromFormData(formData);
          void fetchAlbums(query);
        }}
      >
        <label className="flex flex-col gap-y-1 text-base max-w-sm">
          <span className="text-xs text-neutral-700 font-medium">
            앨범 제목으로 검색
          </span>
          <input
            className="border border-neutral-400 rounded-lg px-2 py-1 text-sm"
            name={ALBUM_TITLE_INPUT_NAME}
            type="search"
            placeholder="입력하세요..."
          />
        </label>
      </form>

      <ul className="flex flex-col gap-y-2">
        {albums.map((album) => {
          const size = 80;
          const displayingImage = album.images.find(
            (image) => image.width >= size * 3,
          );

          return (
            <li key={album.id} className="flex gap-x-1">
              {displayingImage && (
                <Image
                  src={displayingImage.url}
                  width={size}
                  height={size}
                  alt={`${album.name} 썸네일`}
                />
              )}

              <div className="flex flex-col gap-y-1">
                <div className="text-neutral-800 flex gap-x-1">
                  <span>{album.artists[0].name}</span>
                  <span className="font-bold">{album.name}</span>
                </div>

                <code className="font-mono text-xs text-neutral-400">
                  {album.uri}
                </code>

                <code className="font-mono text-xs text-neutral-400">
                  {album.images[0].url}
                </code>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
