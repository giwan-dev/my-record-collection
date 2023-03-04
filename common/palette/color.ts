interface RgbColor {
  r: number;
  g: number;
  b: number;
}

type HexColor = string;

export function hexToRgb(hexColor: HexColor): RgbColor {
  const matched = hexColor.match(
    /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/,
  );

  if (matched === null) {
    throw new Error(`Invalid Hex color: ${hexColor}`);
  }

  const [, r, g, b] = matched;

  return { r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16) };
}

export function rgbToHex({ r, g, b }: RgbColor): HexColor {
  const numberToHex = (num: number) => num.toString(16).padStart(2, "0");

  return `#${[r, g, b].map(numberToHex).join("")}`;
}
