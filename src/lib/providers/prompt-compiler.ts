import { brandConfig } from "@/lib/config/brand";
import { ASSET_TYPE_TEMPLATES } from "@/lib/templates/asset-types";
import { getSwatchOption } from "@/lib/templates/swatches";
import {
  SEGMENT_KEYS,
  type AssetType,
  type CompiledPrompt,
  type PromptSegments,
  type Reference,
  type SegmentKey,
  type SwatchSelection,
} from "@/lib/schema/recipe";

const MAX_PROMPT_CHARS = 1024;
const MAX_NEGATIVE_CHARS = 1024;

/** Words that must never appear in a positive prompt segment — they belong to the fixed layer (logo/copy/price). */
const FIXED_LAYER_WORDS = ["logo", "price", "$", "copy text"];

export interface CompileInput {
  assetType: AssetType;
  swatches: SwatchSelection;
  references: Reference[];
  freeText?: string;
  previousPrompt?: CompiledPrompt | null;
}

/** Words in free text or a reference description that conflict with brand rules (the "brand spellcheck" edge case). */
export function findBrandConflicts(text: string): string[] {
  const lower = text.toLowerCase();
  return brandConfig.forbiddenWords.filter((word) => lower.includes(word.toLowerCase()));
}

export interface PromptCompiler {
  compile(input: CompileInput): CompiledPrompt;
}

function buildSegments(input: CompileInput): PromptSegments {
  const template = ASSET_TYPE_TEMPLATES[input.assetType];
  const lighting = getSwatchOption("lighting", input.swatches.lighting);
  const palette = getSwatchOption("palette", input.swatches.palette);
  const mood = getSwatchOption("mood", input.swatches.mood);
  const composition = getSwatchOption("composition", input.swatches.composition);

  const refDescriptions = input.references.map((r) => r.description).filter(Boolean);

  const subject = template.subjectPhrase;
  const setting = refDescriptions.length
    ? `informed by references: ${refDescriptions.join("; ")}`
    : "a setting consistent with the chosen mood and palette";
  const lightingSeg = lighting ? lighting.promptPhrase : "neutral, evenly balanced light";
  const freeTextNote = input.freeText?.trim();
  const style =
    [mood?.promptPhrase, palette?.promptPhrase, freeTextNote].filter(Boolean).join(", ") ||
    "on-brand, understated style";
  const camera = composition ? composition.promptPhrase : "balanced composition with room for overlay content";

  return { subject, setting, lighting: lightingSeg, style, camera };
}

function buildNegative(input: CompileInput): string {
  const template = ASSET_TYPE_TEMPLATES[input.assetType];
  const parts = [
    ...brandConfig.forbiddenElements,
    ...brandConfig.forbiddenWords,
    ...template.extraNegative,
    "text",
    "watermark",
    "logo",
    "price tag",
    "extra limbs",
    "blurry",
  ];
  return Array.from(new Set(parts)).join(", ");
}

function truncateToBudget(text: string, max: number): string {
  if (text.length <= max) return text;
  if (max <= 1) return text.slice(0, Math.max(0, max));
  return text.slice(0, max - 1).trimEnd() + "…";
}

function stripFixedLayerWords(value: string): string {
  let out = value;
  for (const bad of FIXED_LAYER_WORDS) {
    const escaped = bad.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(escaped, "gi"), "");
  }
  return out.replace(/\s{2,}/g, " ").trim();
}

function segmentsToText(segments: PromptSegments): string {
  return SEGMENT_KEYS.map((k) => segments[k]).join(". ");
}

export const mockPromptCompiler: PromptCompiler = {
  compile(input) {
    const fresh = buildSegments(input);
    const overrides = input.previousPrompt?.overrides ?? [];
    const segments: PromptSegments = { ...fresh };

    // Respect manual edits: an overridden segment keeps its saved text
    // instead of being silently recomputed (R5).
    if (input.previousPrompt) {
      for (const key of overrides) {
        segments[key] = input.previousPrompt.segments[key];
      }
    }

    for (const key of SEGMENT_KEYS) {
      segments[key] = stripFixedLayerWords(segments[key]);
    }

    let combined = segmentsToText(segments);
    if (combined.length > MAX_PROMPT_CHARS) {
      const shrinkOrder: SegmentKey[] = ["setting", "style", "camera", "lighting", "subject"];
      for (const key of shrinkOrder) {
        if (combined.length <= MAX_PROMPT_CHARS) break;
        if (overrides.includes(key)) continue;
        const over = combined.length - MAX_PROMPT_CHARS;
        const budget = Math.max(20, segments[key].length - over);
        segments[key] = truncateToBudget(segments[key], budget);
        combined = segmentsToText(segments);
      }
      if (combined.length > MAX_PROMPT_CHARS) {
        combined = truncateToBudget(combined, MAX_PROMPT_CHARS);
      }
    }

    const negative = truncateToBudget(buildNegative(input), MAX_NEGATIVE_CHARS);

    return {
      segments,
      negative,
      overrides,
      characterCount: segmentsToText(segments).length,
    };
  },
};

/** Flags a segment as a manual override so future recompiles preserve it (R5). */
export function applyOverride(prompt: CompiledPrompt, key: SegmentKey, value: string): CompiledPrompt {
  const segments = { ...prompt.segments, [key]: stripFixedLayerWords(value) };
  const overrides = Array.from(new Set([...prompt.overrides, key]));
  return {
    ...prompt,
    segments,
    overrides,
    characterCount: segmentsToText(segments).length,
  };
}
