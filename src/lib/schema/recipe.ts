import { z } from "zod";

export const ASSET_TYPES = [
  "product_hero",
  "lifestyle_scene",
  "seasonal_promo",
  "type_led_banner",
] as const;
export type AssetType = (typeof ASSET_TYPES)[number];

export const SEGMENT_KEYS = [
  "subject",
  "setting",
  "lighting",
  "style",
  "camera",
] as const;
export type SegmentKey = (typeof SEGMENT_KEYS)[number];

/**
 * What a designer can lock during refine (R7): the four swatch
 * categories (so an accidental edit can't change them) plus the seed of
 * a favorited output tile. Distinct from `prompt.overrides`, which
 * tracks manual text edits to a compiled prompt segment (R5).
 */
export const LOCKABLE_KEYS = ["lighting", "palette", "mood", "composition", "seed"] as const;
export type LockableKey = (typeof LOCKABLE_KEYS)[number];

export const SWATCH_CATEGORIES = ["lighting", "palette", "mood", "composition"] as const;
export type SwatchCategoryKey = (typeof SWATCH_CATEGORIES)[number];

export const WORKSPACE_STEPS = ["frame", "shot_list", "pick", "refine", "export"] as const;
export type WorkspaceStep = (typeof WORKSPACE_STEPS)[number];

export const referenceSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  dataUrl: z.string(),
  description: z.string(),
  autoDescription: z.string(),
  edited: z.boolean().default(false),
});
export type Reference = z.infer<typeof referenceSchema>;

export const swatchSelectionSchema = z.object({
  lighting: z.string().nullable(),
  palette: z.string().nullable(),
  mood: z.string().nullable(),
  composition: z.string().nullable(),
});
export type SwatchSelection = z.infer<typeof swatchSelectionSchema>;

export const formatSchema = z.object({
  id: z.string(),
  name: z.string(),
  width: z.number(),
  height: z.number(),
  aspectLabel: z.string(),
  copySafeZone: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  extremeRatio: z.boolean().default(false),
});
export type AdFormat = z.infer<typeof formatSchema>;

export const promptSegmentsSchema = z.object({
  subject: z.string(),
  setting: z.string(),
  lighting: z.string(),
  style: z.string(),
  camera: z.string(),
});
export type PromptSegments = z.infer<typeof promptSegmentsSchema>;

export const compiledPromptSchema = z.object({
  segments: promptSegmentsSchema,
  negative: z.string(),
  overrides: z.array(z.enum(SEGMENT_KEYS)).default([]),
  characterCount: z.number(),
});
export type CompiledPrompt = z.infer<typeof compiledPromptSchema>;

export const outputSchema = z.object({
  seed: z.number(),
  dataUri: z.string(),
  status: z.enum(["candidate", "chosen", "rejected"]),
  favourited: z.boolean().default(false),
  createdAt: z.string(),
});
export type RecipeOutput = z.infer<typeof outputSchema>;

export const generationSchema = z.object({
  seeds: z.array(z.number()),
  variations: z.number().min(2).max(8),
  locked: z.array(z.enum(LOCKABLE_KEYS)).default([]),
  lockedSeed: z.number().nullable().default(null),
  bracketAttribute: z.enum(SWATCH_CATEGORIES).nullable().default(null),
});
export type Generation = z.infer<typeof generationSchema>;

export const modelInfoSchema = z.object({
  provider: z.string(),
  id: z.string(),
  version: z.string(),
});

/** The fixed layer's text content (R4/R9): logo, headline and price. Never sent to the compiler. */
export const layoutSchema = z.object({
  brandName: z.string(),
  headline: z.string(),
  price: z.string(),
});
export type Layout = z.infer<typeof layoutSchema>;

export const checklistSchema = z.object({
  productAccurate: z.boolean().default(false),
  copySafe: z.boolean().default(false),
  noUnexpectedText: z.boolean().default(false),
});
export type Checklist = z.infer<typeof checklistSchema>;

export const recipeSchema = z.object({
  recipe_id: z.string(),
  parent_id: z.string().nullable().default(null),
  entry_point: z.literal("idea_no_words"),
  asset_type: z.enum(ASSET_TYPES).nullable(),
  format: formatSchema.nullable(),
  references: z.array(referenceSchema).default([]),
  swatches: swatchSelectionSchema,
  brand_constraints_version: z.string(),
  prompt: compiledPromptSchema.nullable(),
  template_version: z.string().nullable(),
  model: modelInfoSchema,
  generation: generationSchema,
  outputs: z.array(outputSchema).default([]),
  layout: layoutSchema,
  free_text: z.string().default(""),
  checklist: checklistSchema,
  current_step: z.enum(WORKSPACE_STEPS).default("frame"),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Recipe = z.infer<typeof recipeSchema>;

function newId(prefix: string): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}_${rand}`;
}

export function createEmptyRecipe(): Recipe {
  const now = new Date().toISOString();
  return {
    recipe_id: newId("rcp"),
    parent_id: null,
    entry_point: "idea_no_words",
    asset_type: null,
    format: null,
    references: [],
    swatches: { lighting: null, palette: null, mood: null, composition: null },
    brand_constraints_version: "",
    prompt: null,
    template_version: null,
    model: { provider: "mock", id: "mock-nova-canvas", version: "0.1.0" },
    generation: { seeds: [], variations: 6, locked: [], lockedSeed: null, bracketAttribute: null },
    outputs: [],
    layout: { brandName: "", headline: "", price: "" },
    free_text: "",
    checklist: { productAccurate: false, copySafe: false, noUnexpectedText: false },
    current_step: "frame",
    created_at: now,
    updated_at: now,
  };
}

export function newReferenceId(): string {
  return newId("ref");
}
