import type { AdFormat } from "@/lib/schema/recipe";

/**
 * copySafeZone is [x0, y0, x1, y1] as fractions of the frame (0-1),
 * marking the region the model should keep visually calm/empty so
 * copy, logo and price can sit over it in the layout layer.
 */
export const AD_FORMATS: AdFormat[] = [
  {
    id: "300x250",
    name: "Medium Rectangle (300x250)",
    width: 300,
    height: 250,
    aspectLabel: "6:5",
    copySafeZone: [0, 0.6, 1, 1],
    extremeRatio: false,
  },
  {
    id: "160x600",
    name: "Wide Skyscraper (160x600)",
    width: 160,
    height: 600,
    aspectLabel: "4:15",
    copySafeZone: [0, 0.75, 1, 1],
    extremeRatio: false,
  },
  {
    id: "728x90",
    name: "Leaderboard (728x90)",
    width: 728,
    height: 90,
    aspectLabel: "~8:1",
    copySafeZone: [0.55, 0, 1, 1],
    extremeRatio: true,
  },
];

export function getFormat(id: string): AdFormat | undefined {
  return AD_FORMATS.find((f) => f.id === id);
}
