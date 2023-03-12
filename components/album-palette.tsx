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
  const [error, setError] = useState(false);

  const patchPalette = async (imageUrl: string) => {
    try {
      const palette = await createPalette(imageUrl);
      const paletteTheme = getTheme(palette);
      const response = await fetch(`/api/albums/${albumId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ palette, paletteTheme }),
      });

      if (response.ok) {
        onChange({ palette, paletteTheme });
        setError(false);
        return;
      }

      throw new Error(
        `Fail to fetch PATCH /albums/${albumId}: ${response.status}`,
      );
    } catch (error) {
      console.error(error);
      setError(true);
    }
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
            void patchPalette(imageUrl).finally(() => setCalculating(false));
          }}
        >
          🔄
        </button>

        {calculating ? (
          <>
            <div className="w-8 h-8 rounded-xl bg-stone-300 shadow-inner animate-pulse" />
            <div
              className="w-8 h-8 rounded-xl bg-stone-300 shadow-inneranimate-pulse"
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

      {error && (
        <div className="text-xs text-red-500">
          팔레트 업데이트에 실패했습니다. 다시 한 번 시도해 주세요.
        </div>
      )}
    </div>
  );
}
