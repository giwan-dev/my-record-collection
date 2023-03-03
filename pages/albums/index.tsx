import type { Album } from "@prisma/client";
import { useEffect, useState } from "react";

import { AlbumList } from "@/components/albums";
import { Main } from "@/components/main";
import { NewAlbumForm } from "@/components/new-album-form";

import type { ValuesForCreatingAlbum } from "../api/albums";

export default function NewAlbumPage() {
  const postAlbumAndRefetch = async (values: ValuesForCreatingAlbum) => {
    await fetch("/api/albums", {
      method: "POST",
      body: JSON.stringify(values),
    });
  };

  const [albums, setAlbums] = useState<Album[]>([]);

  const fetchAlbums = async () => {
    const response = await fetch("/api/albums?order=updatedDesc");

    if (response.ok) {
      const albums = (await response.json()) as Album[];

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
