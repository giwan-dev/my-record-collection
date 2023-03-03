import { PhysicalForm } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";

import type { ValuesForCreatingAlbum } from "@/pages/api/albums";
import type { SpotifyAlbum } from "@/services/spotify";

import { Label, Input, Select } from "./form-fields";
import { SpotifyAlbumSelect } from "./spotify-album-select";

const TITLE_INPUT_NAME = "album-title";
const ARTIST_INPUT_NAME = "album-artist";
const PHYSICAL_FORM_INPUT_NAME = "physical-form";

export function NewAlbumForm({
  onSubmit,
}: {
  onSubmit: (values: ValuesForCreatingAlbum) => void;
}) {
  const [physicalForm, setPhysicalForm] =
    useStatePersistedWithSession<PhysicalForm>(
      `new-album-page/${PHYSICAL_FORM_INPUT_NAME}-last-value`,
      PhysicalForm.VINYL,
    );
  const [reference, setReference] = useState<SpotifyAlbum>();

  const extractValuesFromFormData = (
    formData: FormData,
  ): ValuesForCreatingAlbum => {
    const title = considerAsString(formData.get(TITLE_INPUT_NAME));
    const artist = considerAsString(formData.get(ARTIST_INPUT_NAME));
    const physicalForm = considerAs(formData.get(PHYSICAL_FORM_INPUT_NAME), [
      PhysicalForm.VINYL,
      PhysicalForm.CD,
      PhysicalForm.CASSETTE,
    ]);

    return {
      title,
      artist,
      physicalForm,
      imageUrl: reference?.images[0].url ?? null,
      spotifyUri: reference?.uri ?? null,
    };
  };

  return (
    <section className="px-4">
      <h2 className="font-bold">새로운 앨범 등록</h2>

      <SpotifyAlbumSelect
        value={reference}
        onChange={(newValue) => {
          setReference(newValue ?? undefined);
        }}
      />

      <form
        className="flex flex-col gap-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);

          const values = extractValuesFromFormData(formData);

          onSubmit(values);
        }}
      >
        <Label label="종류">
          <Select
            name={PHYSICAL_FORM_INPUT_NAME}
            value={physicalForm}
            onChange={(e) => {
              setPhysicalForm(e.currentTarget.value as PhysicalForm);
            }}
          >
            <option value={PhysicalForm.VINYL}>바이닐</option>
            <option value={PhysicalForm.CD}>CD</option>
            <option value={PhysicalForm.CASSETTE}>카세트</option>
          </Select>
        </Label>

        <Label label="제목">
          <Input
            type="text"
            name={TITLE_INPUT_NAME}
            required
            defaultValue={reference?.name}
          />
        </Label>

        <Label label="아티스트">
          <Input
            type="text"
            name={ARTIST_INPUT_NAME}
            required
            defaultValue={reference?.artists[0].name}
          />
        </Label>

        <button
          type="submit"
          className="bg-orange-600 text-stone-50 px-4 py-2 rounded-xl text-sm"
        >
          등록
        </button>
      </form>
    </section>
  );
}

function considerAs<Key extends string>(
  value: FormDataEntryValue | null,
  keys: Key[],
): Key {
  const stringValue = considerAsString(value);

  if (!keys.includes(stringValue as Key)) {
    throw new Error(`${stringValue} should be one of ${keys.join(", ")}`);
  }
  return stringValue as Key;
}

function considerAsString(value: FormDataEntryValue | null): string {
  const stringOrNull = considerAsStringOrNull(value);

  if (stringOrNull === null) {
    throw new Error("Cannot consider value as string");
  }

  return stringOrNull;
}

function considerAsStringOrNull(
  value: FormDataEntryValue | null,
): string | null {
  if (value instanceof File) {
    throw new Error("Cannot consider File as string or null");
  }

  return value;
}

function useStatePersistedWithSession<T extends string>(
  key: string,
  initialValue?: T,
) {
  const [value, setInnerValue] = useState(initialValue);

  const setValue = useCallback(
    (params: Parameters<typeof setInnerValue>[0]) => {
      setInnerValue(params);
      const nextValue =
        typeof params === "function"
          ? params(
              (window.sessionStorage.getItem(key) as T | null) ?? undefined,
            )
          : params;

      if (nextValue) {
        window.sessionStorage.setItem(key, nextValue);
      } else {
        window.sessionStorage.removeItem(key);
      }
    },
    [key],
  );

  useEffect(() => {
    const valueFromStorage = window.sessionStorage.getItem(key) as
      | T
      | undefined;

    if (initialValue !== valueFromStorage) {
      setInnerValue(valueFromStorage ?? undefined);
    }
  }, [initialValue, key]);

  return [value, setValue] as const;
}
