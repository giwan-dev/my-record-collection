import { useEffect, useState } from "react";

import { AlbumList } from "@/components/albums";
import { Main } from "@/components/main";
import { NewAlbumForm } from "@/components/new-album-form";

import type { AlbumSummary, ValuesForCreatingAlbum } from "../api/albums";

export default function NewAlbumPage() {
  const postAlbumAndRefetch = async (values: ValuesForCreatingAlbum) => {
    await fetch("/api/albums", {
      method: "POST",
      body: JSON.stringify(values),
    });
  };

  const [albums, setAlbums] = useState<
    Parameters<typeof AlbumList>[0]["albums"]
  >([]);

  const fetchAlbums = async () => {
    const response = await fetch("/api/albums?order=createdDesc");

    if (response.ok) {
      const albums = (await response.json()) as AlbumSummary[];

      setAlbums(albums);
    }
  };

  useEffect(() => {
    void fetchAlbums();
  }, []);

  return (
    <Main>
      <NewAlbumForm
        onSubmit={(values) => {
          void postAlbumAndRefetch(values).then(() => fetchAlbums());
        }}
      />

      <AlbumList
        albums={albums}
        onEdit={(albumId, patch) => {
          void fetch(`/api/albums/${albumId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(patch),
          }).then((response) => {
            if (response.ok) {
              return fetchAlbums();
            }
          });
        }}
        onDelete={(albumId) => {
          void fetch(`/api/albums/${albumId}`, { method: "DELETE" }).then(
            (response) => {
              if (response.ok) {
                return fetchAlbums();
              }
              // TODO 오류 안내
            },
          );
        }}
      />
    </Main>
  );
}
