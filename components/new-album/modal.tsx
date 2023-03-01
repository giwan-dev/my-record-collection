import type { Album } from "@prisma/client";
import type { InputHTMLAttributes, PropsWithChildren, RefObject } from "react";

export interface InitialAlbum {
  title: string;
  artist: string;
  imageUrl: string;
}

export type ValuesForCreatingAlbum = Pick<
  Album,
  "title" | "artist" | "imageUrl"
>;

const TITLE_INPUT_NAME = "album-title";
const ARTIST_INPUT_NAME = "album-artist";
const IMAGE_URL_INPUT_NAME = "album-image-url";

export function NewAlbumRegisterFormModal({
  initialAlbum,
  dialogRef,
  onSubmit,
}: {
  initialAlbum: InitialAlbum | undefined;
  dialogRef: RefObject<HTMLDialogElement>;
  onSubmit: (values: ValuesForCreatingAlbum) => void;
}) {
  const initialTitle = initialAlbum?.title;
  const initialArtist = initialAlbum?.artist;
  const initialImageUrl = initialAlbum?.imageUrl;

  const extractValuesFromFormData = (
    formData: FormData,
  ): ValuesForCreatingAlbum => {
    const title = considerAsString(formData.get(TITLE_INPUT_NAME));
    const artist = considerAsString(formData.get(ARTIST_INPUT_NAME));
    const imageUrl = considerAsStringOrNull(formData.get(IMAGE_URL_INPUT_NAME));

    return {
      title,
      artist,
      imageUrl,
    };
  };

  return (
    <dialog
      className="fixed top-1/2 left-1/2 m-0 backdrop:bg-neutral-500 backdrop:opacity-80 -translate-x-1/2 -translate-y-1/2 shadow-lg rounded-xl p-0"
      ref={dialogRef}
    >
      <form
        method="dialog"
        className="p-4 flex flex-col gap-y-3"
        onSubmit={(e) => {
          const formData = new FormData(e.currentTarget);

          const values = extractValuesFromFormData(formData);

          onSubmit(values);
        }}
      >
        <Label label="제목">
          <Input
            type="text"
            name={TITLE_INPUT_NAME}
            required
            defaultValue={initialTitle}
          />
        </Label>

        <Label label="아티스트">
          <Input
            type="text"
            name={ARTIST_INPUT_NAME}
            required
            defaultValue={initialArtist}
          />
        </Label>

        <Label label="이미지 URL">
          <Input
            type="text"
            name={IMAGE_URL_INPUT_NAME}
            defaultValue={initialImageUrl}
          />
        </Label>

        <button
          type="submit"
          className="bg-emerald-500 text-neutral-50 px-4 py-2 rounded-xl text-sm"
        >
          등록
        </button>
      </form>
    </dialog>
  );
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

function Label({ label, children }: PropsWithChildren<{ label: string }>) {
  return (
    <label className="flex flex-col gap-y-1 text-base max-w-lg">
      <span className="text-xs text-neutral-700 font-medium">{label}</span>

      {children}
    </label>
  );
}

function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        className,
        "border border-neutral-400 rounded-lg px-2 py-1 text-sm",
      ]
        .filter((x) => !!x)
        .join(" ")}
    />
  );
}
