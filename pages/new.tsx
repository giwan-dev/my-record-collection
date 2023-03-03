import { Main } from "@/components/main";
import { NewAlbumForm } from "@/components/new-album-form";

import type { ValuesForCreatingAlbum } from "./api/albums";

export default function NewAlbumPage() {
  const postAlbumAndRefetch = async (values: ValuesForCreatingAlbum) => {
    await fetch("/api/albums", {
      method: "POST",
      body: JSON.stringify(values),
    });

    window.location.reload();
  };

  return (
    <Main>
      <NewAlbumForm onSubmit={(values) => void postAlbumAndRefetch(values)} />
    </Main>
  );
}
