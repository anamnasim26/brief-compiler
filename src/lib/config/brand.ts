/**
 * Sample brand config — placeholder for a real design-system export.
 * Swap the values below for the actual brand's palette, forbidden
 * elements and tone words before using this for real work.
 */
export const brandConfig = {
  version: "brand-2026.09",
  name: "Aurora Home Goods",
  palette: [
    { name: "Deep Navy", hex: "#0B1F3A" },
    { name: "Warm Sand", hex: "#E8D9C5" },
    { name: "Coral Accent", hex: "#FF6B4A" },
    { name: "Sage", hex: "#8CA292" },
  ],
  forbiddenElements: [
    "competitor logos or packaging",
    "neon or saturated colours outside the brand palette",
    "cluttered or busy backgrounds",
    "stock-photo watermarks",
    "visible text or lettering baked into the image",
  ],
  forbiddenWords: ["neon", "cheap", "generic clipart", "stock photo"],
  toneWords: ["premium", "approachable", "warm"],
} as const;

export type BrandConfig = typeof brandConfig;
