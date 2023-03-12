import { extractPaletteFromImageData } from "./extract-palette-from-image-data";

export async function createPalette(
  imageUrl: string,
  id: string,
): Promise<string[]> {
  const imageData = await getImageData(imageUrl);
  return await extractPaletteFromImageData(imageData, id);
}

async function getImageData(imageUrl: string): Promise<ImageData> {
  const image = await new Promise<HTMLImageElement>((resolve) => {
    const image = new Image();
    image.src = imageUrl;
    image.crossOrigin = "anonymous";
    image.onload = () => {
      resolve(image);
    };
  });
  const canvas = document.createElement("canvas");

  canvas.width = image.width;
  canvas.height = image.height;

  const context = canvas.getContext("2d");

  if (context === null) {
    throw new Error("Fail to create canvas context");
  }

  context.drawImage(image, 0, 0);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  return imageData;
}
