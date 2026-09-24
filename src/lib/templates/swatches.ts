import { brandConfig } from "@/lib/config/brand";
import { SWATCH_CATEGORIES, type SwatchCategoryKey } from "@/lib/schema/recipe";

export { SWATCH_CATEGORIES };
export type SwatchCategory = SwatchCategoryKey;

export type SwatchPreview =
  | { type: "gradient"; css: string }
  | { type: "palette"; colors: string[] }
  | { type: "dot"; x: number; y: number };

export interface SwatchOption {
  id: string;
  label: string;
  promptPhrase: string;
  preview: SwatchPreview;
}

export const LIGHTING_OPTIONS: SwatchOption[] = [
  { id: "soft_window", label: "Soft window", promptPhrase: "soft diffused window light", preview: { type: "gradient", css: "linear-gradient(135deg,#fdf6ec,#cfd8e3)" } },
  { id: "hard_directional", label: "Hard directional", promptPhrase: "hard directional light with crisp shadows", preview: { type: "gradient", css: "linear-gradient(135deg,#fff9db,#1a1a1a)" } },
  { id: "golden_hour", label: "Golden hour", promptPhrase: "warm golden-hour side light", preview: { type: "gradient", css: "linear-gradient(135deg,#ffd9a0,#ff6b4a)" } },
  { id: "studio_softbox", label: "Studio softbox", promptPhrase: "even studio softbox lighting", preview: { type: "gradient", css: "linear-gradient(135deg,#ffffff,#d9d9d9)" } },
  { id: "overcast_diffuse", label: "Overcast diffuse", promptPhrase: "diffuse overcast daylight", preview: { type: "gradient", css: "linear-gradient(135deg,#dfe6ea,#aab4bd)" } },
  { id: "blue_hour", label: "Blue hour", promptPhrase: "cool blue-hour ambient light", preview: { type: "gradient", css: "linear-gradient(135deg,#2b3a55,#7c94b3)" } },
];

export const PALETTE_OPTIONS: SwatchOption[] = [
  { id: "warm_neutrals", label: "Warm neutrals", promptPhrase: "warm neutral tones", preview: { type: "palette", colors: ["#E8D9C5", "#C9A987", "#8B6F4E"] } },
  { id: "cool_neutrals", label: "Cool neutrals", promptPhrase: "cool neutral tones", preview: { type: "palette", colors: ["#D7DEE3", "#A9B4BD", "#5C6B73"] } },
  { id: "brand_primary", label: "Brand primary", promptPhrase: "the brand's primary palette direction", preview: { type: "palette", colors: brandConfig.palette.map((c) => c.hex) } },
  { id: "monochrome", label: "Monochrome", promptPhrase: "monochrome greyscale tones", preview: { type: "palette", colors: ["#111111", "#666666", "#EEEEEE"] } },
  { id: "pastel", label: "Pastel", promptPhrase: "soft pastel tones", preview: { type: "palette", colors: ["#F6D6D6", "#D6E8F6", "#EFF6D6"] } },
  { id: "vibrant", label: "Vibrant", promptPhrase: "vibrant saturated tones", preview: { type: "palette", colors: ["#FF6B4A", "#3AACFF", "#FFD23F"] } },
];

export const MOOD_OPTIONS: SwatchOption[] = [
  { id: "calm", label: "Calm", promptPhrase: "calm and quiet mood", preview: { type: "gradient", css: "linear-gradient(135deg,#eef3f1,#c9d6d1)" } },
  { id: "energetic", label: "Energetic", promptPhrase: "energetic and dynamic mood", preview: { type: "gradient", css: "linear-gradient(135deg,#ff9a5a,#ff4a6b)" } },
  { id: "luxurious", label: "Luxurious", promptPhrase: "luxurious and refined mood", preview: { type: "gradient", css: "linear-gradient(135deg,#2b2b2b,#a8894e)" } },
  { id: "playful", label: "Playful", promptPhrase: "playful and light-hearted mood", preview: { type: "gradient", css: "linear-gradient(135deg,#ffe66d,#6de0ff)" } },
  { id: "minimal", label: "Minimal", promptPhrase: "minimal and restrained mood", preview: { type: "gradient", css: "linear-gradient(135deg,#f7f7f7,#dedede)" } },
  { id: "festive", label: "Festive", promptPhrase: "festive and celebratory mood", preview: { type: "gradient", css: "linear-gradient(135deg,#c0392b,#e8b84b)" } },
];

export const COMPOSITION_OPTIONS: SwatchOption[] = [
  { id: "centered_low_angle", label: "Centered, low angle", promptPhrase: "centered subject, low camera angle", preview: { type: "dot", x: 50, y: 65 } },
  { id: "rule_of_thirds", label: "Rule of thirds", promptPhrase: "off-center subject following the rule of thirds", preview: { type: "dot", x: 33, y: 40 } },
  { id: "flat_lay", label: "Flat lay", promptPhrase: "overhead flat-lay composition", preview: { type: "dot", x: 50, y: 50 } },
  { id: "close_up_macro", label: "Close-up macro", promptPhrase: "close-up macro framing", preview: { type: "dot", x: 50, y: 50 } },
  { id: "negative_space_left", label: "Negative space, left", promptPhrase: "subject right-weighted with open negative space on the left", preview: { type: "dot", x: 75, y: 50 } },
  { id: "negative_space_right", label: "Negative space, right", promptPhrase: "subject left-weighted with open negative space on the right", preview: { type: "dot", x: 25, y: 50 } },
];

export const SWATCH_CATALOG: Record<SwatchCategory, SwatchOption[]> = {
  lighting: LIGHTING_OPTIONS,
  palette: PALETTE_OPTIONS,
  mood: MOOD_OPTIONS,
  composition: COMPOSITION_OPTIONS,
};

export function getSwatchOption(category: SwatchCategory, id: string | null): SwatchOption | undefined {
  if (!id) return undefined;
  return SWATCH_CATALOG[category].find((o) => o.id === id);
}
