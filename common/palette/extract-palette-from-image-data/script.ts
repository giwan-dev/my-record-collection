import { kmeans } from "ml-kmeans";

import { rgbToHex } from "../color";

import type { InputMessage, OutputMessage } from "./message";

addEventListener("message", (event: MessageEvent<InputMessage>) => {
  const message: OutputMessage = {
    id: event.data.id,
    palette: extractPaletteFromImageData(event.data.imageData),
  };

  postMessage(message);
});

function extractPaletteFromImageData({
  data: uint8ClampedArray,
}: ImageData): string[] {
  const rgbs = extractRgbs(uint8ClampedArray);
  const quantized = quantization(rgbs, 0);
  const centroidsWithInformation = kmeans(
    rgbs.map(({ r, g, b }) => [r, g, b]),
    4,
    {
      initialization: quantized.map(({ r, g, b }) => [r, g, b]),
    },
  ).computeInformation(rgbs.map(({ r, g, b }) => [r, g, b]));

  return centroidsWithInformation
    .sort((centroidA, centroidB) => centroidB.size - centroidA.size)
    .map(({ centroid: [r, g, b] }) => ({
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b),
    }))
    .map(rgbToHex);
}

function extractRgbs(array: Uint8ClampedArray) {
  const rgbs = [];
  for (let i = 0; i < array.length; i += 4) {
    const rgb = {
      r: array[i],
      g: array[i + 1],
      b: array[i + 2],
    };

    rgbs.push(rgb);
  }
  return rgbs;
}

function quantization(
  rgbs: { r: number; g: number; b: number }[],
  depth: number,
): { r: number; g: number; b: number }[] {
  const MAX_DEPTH = 2;

  if (depth === MAX_DEPTH || rgbs.length === 0) {
    const color = rgbs.reduce(
      (sum, pixel) => ({
        r: sum.r + pixel.r,
        g: sum.g + pixel.g,
        b: sum.b + pixel.b,
      }),
      {
        r: 0,
        g: 0,
        b: 0,
      },
    );

    return [
      {
        r: Math.round(color.r / rgbs.length),
        g: Math.round(color.g / rgbs.length),
        b: Math.round(color.b / rgbs.length),
      },
    ];
  }
  const componentToSortBy = findBiggestColorRange(rgbs);
  rgbs.sort((p1, p2) => p1[componentToSortBy] - p2[componentToSortBy]);
  const mid = rgbs.length / 2;
  return [
    ...quantization(rgbs.slice(0, mid), depth + 1),
    ...quantization(rgbs.slice(mid + 1), depth + 1),
  ];
}

function findBiggestColorRange(rgbs: { r: number; g: number; b: number }[]) {
  let rMin = Number.MAX_VALUE;
  let gMin = Number.MAX_VALUE;
  let bMin = Number.MAX_VALUE;

  let rMax = Number.MIN_VALUE;
  let gMax = Number.MIN_VALUE;
  let bMax = Number.MIN_VALUE;

  rgbs.forEach((pixel) => {
    rMin = Math.min(rMin, pixel.r);
    gMin = Math.min(gMin, pixel.g);
    bMin = Math.min(bMin, pixel.b);

    rMax = Math.max(rMax, pixel.r);
    gMax = Math.max(gMax, pixel.g);
    bMax = Math.max(bMax, pixel.b);
  });

  const rRange = rMax - rMin;
  const gRange = gMax - gMin;
  const bRange = bMax - bMin;

  const biggestRange = Math.max(rRange, gRange, bRange);

  switch (biggestRange) {
    case rRange:
      return "r";
    case gRange:
      return "g";
    case bRange:
      return "b";
    default:
      return "b";
  }
}
