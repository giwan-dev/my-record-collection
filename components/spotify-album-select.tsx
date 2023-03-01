import Image from "next/image";
import { useDeferredValue, useEffect, useRef, useState } from "react";

import type { SearchApiResponse, SpotifyAlbum } from "@/services/spotify";

import { Input } from "./form-fields";

export function SpotifyAlbumSelect({
  value,
  onChange,
}: {
  value: SpotifyAlbum | undefined;
  onChange: (value: SpotifyAlbum | null) => void;
}) {
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [keyword, setKeyword] = useState("");
  const deferredKeyword = useDeferredValue(keyword.trim());
  const [suggestions, setSuggestions] = useState<SpotifyAlbum[]>([]);

  useEffect(() => {
    const fetchAlbums = async (query: string) => {
      const searchParams = new URLSearchParams([["query", query]]);

      const response = await fetch(
        `/api/search-album-from-spotify?${searchParams.toString()}`,
      );

      if (response.ok) {
        const {
          albums: { items },
        } = (await response.json()) as SearchApiResponse;

        setSuggestions(items);
      }
    };

    if (deferredKeyword) {
      void fetchAlbums(deferredKeyword);
    }
  }, [deferredKeyword]);

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!sectionRef.current?.contains(e.target as HTMLElement)) {
        setSuggestionsVisible(false);
      }
    };

    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  return (
    <section className="relative mb-4 py-2" ref={sectionRef}>
      {value && (
        <div className="mb-3">
          <SpotifyAlbumEntity album={value} selected onSelect={onChange} />
        </div>
      )}

      <Input
        type="search"
        className="w-full"
        placeholder="검색..."
        onFocus={() => {
          setSuggestionsVisible(true);
        }}
        value={keyword}
        onChange={(e) => {
          setKeyword(e.currentTarget.value);
        }}
      />

      {suggestionsVisible && (
        <div className="absolute bottom-0 translate-y-full w-full rounded border py-2 shadow-sm bg-white">
          {suggestions.length > 0 ? (
            <ul className="w-full max-h-60 pl-2 pr-3 overflow-auto gap-y-1">
              {suggestions.map((suggestion) => (
                <li key={suggestion.id} className="w-full">
                  <SpotifyAlbumEntity
                    album={suggestion}
                    selected={suggestion.id === value?.id}
                    onSelect={(newAlbum) => {
                      onChange(newAlbum);
                      setSuggestionsVisible(false);

                      if (newAlbum !== null) {
                        setKeyword("");
                      }
                    }}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-2 text-sm text-neutral-600">
              검색어를 입력하세요
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function SpotifyAlbumEntity({
  album,
  album: {
    name,
    artists: [{ name: artistName }],
    images: [{ url }],
  },
  selected,
  onSelect,
}: {
  album: SpotifyAlbum;
  selected: boolean;
  onSelect: (album: SpotifyAlbum | null) => void;
}) {
  return (
    <div className="w-full flex justify-between items-center gap-x-1 ">
      <Image src={url} width={60} height={60} alt={`${name} 커버 이미지`} />

      <div className="flex-auto min-w-0 flex flex-col text-sm">
        <div className="text-neutral-800 font-bold whitespace-nowrap overflow-hidden text-ellipsis">
          {name}
        </div>
        <div className="text-neutral-600">{artistName}</div>
      </div>

      <button
        className="flex-shrink-0 rounded border px-2 py-1 text-xs"
        onClick={() => {
          if (selected) {
            onSelect(null);
          } else {
            onSelect(album);
          }
        }}
      >
        {selected ? "선택 취소" : "선택"}
      </button>
    </div>
  );
}
