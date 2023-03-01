import Image from "next/image";
import { useState } from "react";

import type { SearchApiResponse } from "@/services/spotify";

const ALBUM_TITLE_INPUT_NAME = "album-title";

export default function SearchAlbumPage() {
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
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);
          const query = extractQueryFromFormData(formData);
          void fetchAlbums(query);
        }}
      >
        <label>
          앨범 제목
          <input name={ALBUM_TITLE_INPUT_NAME} type="search" />
        </label>

        <button type="submit">검색</button>
      </form>

      <div>
        {albums.map((album) => {
          const size = 80;
          const displayingImage = album.images.find(
            (image) => image.width >= size * 3,
          );

          return (
            <div key={album.id}>
              {displayingImage && (
                <Image
                  src={displayingImage.url}
                  width={size}
                  height={size}
                  alt={`${album.name} 썸네일`}
                />
              )}

              <div>
                Spotify URI: <code>{album.uri}</code>
              </div>

              <div>제목: {album.name}</div>

              <div>
                아티스트:{" "}
                {album.artists.map((artist) => artist.name).join(", ")}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
