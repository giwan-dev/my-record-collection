import type { InputHTMLAttributes, PropsWithChildren } from "react";

export interface Album {
  id: string;
  title: string;
  artist: string;
  imageUrl: string | null;
}

const ID_INPUT_NAME = "album-identificator";
const TITLE_INPUT_NAME = "album-title";
const ARTIST_INPUT_NAME = "album-artist";
const IMAGE_URL_INPUT_NAME = "album-image-url";

export function NewAlbumRegisterForm() {
  const extractAlbumFromFormData = (formData: FormData): Album => {
    const id = considerAsString(formData.get(ID_INPUT_NAME));
    const title = considerAsString(formData.get(TITLE_INPUT_NAME));
    const artist = considerAsString(formData.get(ARTIST_INPUT_NAME));
    const imageUrl = considerAsStringOrNull(formData.get(IMAGE_URL_INPUT_NAME));

    return {
      id,
      title,
      artist,
      imageUrl,
    };
  };

  return (
    <form
      className="p-4 flex flex-col gap-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const album = extractAlbumFromFormData(formData);

        console.log(album);
      }}
    >
      <Label label="ID">
        <Input type="text" name={ID_INPUT_NAME} required />
      </Label>

      <Label label="제목">
        <Input type="text" name={TITLE_INPUT_NAME} required />
      </Label>

      <Label label="아티스트">
        <Input type="text" name={ARTIST_INPUT_NAME} required />
      </Label>

      <Label label="이미지 URL">
        <Input type="text" name={IMAGE_URL_INPUT_NAME} />
      </Label>

      <button
        type="submit"
        className="bg-emerald-500 text-neutral-50 px-4 py-2 rounded-xl text-sm"
      >
        등록
      </button>
    </form>
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
