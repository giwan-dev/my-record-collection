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
  const [focusedIndex, setFocusedIndex] = useState<number>();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionContainerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          setFocusedIndex((prev) => {
            if (prev === undefined) {
              return 0;
            }

            const nextValue = prev + 1;

            if (nextValue === suggestions.length) {
              return 0;
            }
            return nextValue;
          });
          return;
        case "ArrowUp":
          setFocusedIndex((prev) => {
            if (prev === undefined) {
              return suggestions.length - 1;
            }

            const nextValue = prev - 1;

            if (nextValue === -1) {
              return suggestions.length - 1;
            }
            return nextValue;
          });
          return;
        case "Enter":
          {
            const album =
              focusedIndex !== undefined ? suggestions[focusedIndex] : null;

            if (album !== null) {
              onChange(value?.id !== album.id ? album : null);
            }
          }
          return;
        case "Escape":
          setSuggestionsVisible(false);
          setKeyword("");
          inputRef.current?.blur();
          return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusedIndex, onChange, suggestions, value?.id]);

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
      setFocusedIndex(undefined);
      suggestionContainerRef.current?.scrollTo(0, 0);
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

  useEffect(() => {
    if (focusedIndex === undefined || suggestions.length === 0) {
      return;
    }

    const target = suggestions[focusedIndex];

    const el = document.getElementById(target.id);

    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focusedIndex, suggestions]);

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
        ref={inputRef}
      />

      {suggestionsVisible && (
        <div className="absolute bottom-0 translate-y-full w-full rounded border py-2 shadow-sm bg-white">
          {suggestions.length > 0 ? (
            <ul
              className="w-full max-h-60 overflow-auto gap-y-1"
              ref={suggestionContainerRef}
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion.id}
                  id={suggestion.id}
                  className={[
                    "w-full py-1 pl-2 pr-3",
                    index === focusedIndex ? "bg-stone-100" : undefined,
                  ]
                    .filter((x) => !!x)
                    .join(" ")}
                >
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
            <div className="px-2 text-sm text-stone-600">
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
        <div className="text-stone-800 font-bold whitespace-nowrap overflow-hidden text-ellipsis">
          {name}
        </div>
        <div className="text-stone-600">{artistName}</div>
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
