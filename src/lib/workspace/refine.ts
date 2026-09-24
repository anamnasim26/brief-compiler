import { randomSeed } from "@/lib/providers/svg-tile";
import { mockImageProvider } from "@/lib/providers/image-provider";
import type { AdFormat, LockableKey, SwatchSelection } from "@/lib/schema/recipe";
import { SWATCH_CATALOG, type SwatchCategory } from "@/lib/templates/swatches";

/** A locked swatch category can't be changed — this is the guard the UI checks before applying an edit. */
export function canChangeSwatch(locked: LockableKey[], category: SwatchCategory): boolean {
  return !locked.includes(category);
}

/**
 * Applies a swatch change unless that category is locked, in which case
 * the recipe is returned unchanged (R7: "lock what I like and change
 * one thing").
 */
export function applySwatchChange(
  swatches: SwatchSelection,
  locked: LockableKey[],
  category: SwatchCategory,
  value: string | null
): SwatchSelection {
  if (locked.includes(category)) return swatches;
  return { ...swatches, [category]: value };
}

/**
 * Builds the seed list for a regeneration. If a seed is locked, it's
 * kept as the first seed so that tile's composition stays anchored
 * while everything else in the grid still varies (attribute
 * bracketing, per the PRD's Nova Canvas mapping).
 */
export function buildSeeds(count: number, lockedSeed: number | null): number[] {
  const seeds: number[] = [];
  if (lockedSeed !== null) seeds.push(lockedSeed);
  while (seeds.length < count) {
    const candidate = randomSeed();
    if (!seeds.includes(candidate)) seeds.push(candidate);
  }
  return seeds;
}

export interface BracketOption {
  optionId: string;
  label: string;
  dataUri: string;
}

/**
 * A real implementation of the PRD's "attribute bracketing" (Concept 3):
 * one tile per option in `category`'s vocabulary, all sharing the same
 * seed and every other swatch, so only the bracketed attribute changes
 * across the strip.
 */
export async function generateBracket(params: {
  seed: number;
  category: SwatchCategory;
  swatches: SwatchSelection;
  format: AdFormat;
}): Promise<BracketOption[]> {
  const options = SWATCH_CATALOG[params.category].slice(0, 5);
  const inputs = options.map((option) => ({
    seed: params.seed,
    format: params.format,
    swatches: { ...params.swatches, [params.category]: option.id },
  }));
  const tiles = await mockImageProvider.generate(inputs);
  return options.map((option, i) => ({ optionId: option.id, label: option.label, dataUri: tiles[i].dataUri }));
}
