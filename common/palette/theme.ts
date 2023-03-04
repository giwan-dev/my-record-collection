import { hexToRgb } from "./color";

export function getTheme(palette: string[]): "light" | "dark" {
  const textColors = palette.map(getTextColor);
  const whiteNeed = textColors.filter((color) => color === "light").length;
  const blackNeed = textColors.filter((color) => color === "dark").length;

  return whiteNeed > blackNeed ? "light" : "dark";
}

function getTextColor(bgColor: string) {
  const whiteContrast = getContrast(bgColor, "#ffffff");
  const blackContrast = getContrast(bgColor, "#000000");

  return whiteContrast > blackContrast ? "light" : "dark";
}

function getContrast(f: string, b: string) {
  const l1 = getLuminance(f);
  const l2 = getLuminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function getLuminance(hexColor: string) {
  const { r, g, b } = hexToRgb(hexColor);
  return (
    0.2126 * normalizeRgbToSrgb(r) +
    0.7152 * normalizeRgbToSrgb(g) +
    0.0722 * normalizeRgbToSrgb(b)
  );
}

function normalizeRgbToSrgb(value: number) {
  const ratio = value / 255;
  return ratio <= 0.03928
    ? ratio / 12.92
    : Math.pow((ratio + 0.055) / 1.055, 2.4);
}
