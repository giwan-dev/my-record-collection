import type { Album } from "@prisma/client";
import { useState } from "react";

import { createPalette, getTheme } from "@/common/palette";

export function AlbumPalette({
  albumId,
  imageUrl,
  palette,
  onChange,
}: {
  albumId: string;
  imageUrl: string | null;
  palette: string[];
  onChange: (newAlbum: Pick<Album, "palette" | "paletteTheme">) => void;
}) {
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState(
    imageUrl !== null && new Set(palette).size < 4
      ? "팔레트가 모자랍니다."
      : undefined,
  );

  const createPaletteAndTheme = async (imageUrl: string) => {
    try {
      const palette = await createPalette(imageUrl, albumId);
      const paletteTheme = getTheme(palette);

      return { palette, paletteTheme };
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const patchAlbum = async (
    albumPatch: Pick<Album, "palette" | "paletteTheme">,
  ) => {
    const response = await fetch(`/api/albums/${albumId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(albumPatch),
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as Album;
  };

  const handleRefresh = async (imageUrl: string) => {
    const paletteAndTheme = await createPaletteAndTheme(imageUrl);

    if (paletteAndTheme === null) {
      setError("팔레트를 만들지 못했습니다. 다시 시도해 주세요.");
      return;
    }

    if (new Set(paletteAndTheme.palette).size < 4) {
      setError(
        "4개보다 적은 수의 팔레트가 만들어졌습니다. 다시 시도해 주세요.",
      );
      return;
    }

    const album = await patchAlbum(paletteAndTheme);

    if (album === null) {
      setError("생성한 팔레트를 저장하지 못했습니다. 다시 시도해 주세요.");
      return;
    }

    onChange(paletteAndTheme);
    setError(undefined);
  };

  if (imageUrl === null) {
    return (
      <div className="rounded-2xl p-2 bg-white flex flex-col gap-y-1 text-sm text-stone-400">
        이미지를 업로드 하세요.
      </div>
    );
  }

  return (
    <div
      className={[
        "rounded-2xl p-2 bg-white flex flex-col gap-y-1",
        error ? "border-2 border-red-500" : undefined,
      ]
        .filter((x) => !!x)
        .join(" ")}
    >
      <div className="flex gap-x-1">
        <button
          className="rounded-xl px-2 py-1 hover:bg-stone-200 active:bg-stone-300 disabled:bg-transparent disabled:opacity-50"
          onClick={() => {
            setCalculating(true);
            void handleRefresh(imageUrl).finally(() => setCalculating(false));
          }}
        >
          🔄
        </button>

        {calculating ? (
          <>
            <div className="w-8 h-8 rounded-xl bg-stone-300 shadow-inner animate-pulse" />
            <div
              className="w-8 h-8 rounded-xl bg-stone-300 shadow-inner animate-pulse"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-8 h-8 rounded-xl bg-stone-300 shadow-inner animate-pulse"
              style={{ animationDelay: "300ms" }}
            />
            <div
              className="w-8 h-8 rounded-xl bg-stone-300 shadow-inner animate-pulse"
              style={{ animationDelay: "450ms" }}
            />
          </>
        ) : (
          <>
            {palette.map((color) => (
              <div
                key={color}
                className="w-8 h-8 rounded-xl flex-none shadow-inner"
                style={{ backgroundColor: color }}
              />
            ))}
          </>
        )}
      </div>

      {error && <div className="text-xs text-red-500">{error}</div>}
    </div>
  );
}
