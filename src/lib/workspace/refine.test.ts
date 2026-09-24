import { describe, expect, it } from "vitest";
import { applySwatchChange, buildSeeds, canChangeSwatch, generateBracket } from "./refine";
import { AD_FORMATS } from "@/lib/templates/formats";
import { SWATCH_CATALOG } from "@/lib/templates/swatches";
import type { SwatchSelection } from "@/lib/schema/recipe";

const swatches: SwatchSelection = {
  lighting: "soft_window",
  palette: "warm_neutrals",
  mood: "calm",
  composition: "centered_low_angle",
};

describe("refine loop invariants", () => {
  it("keeps a locked swatch category unchanged while an unlocked one varies", () => {
    const locked = ["lighting" as const];
    const next = applySwatchChange(swatches, locked, "lighting", "golden_hour");
    expect(next.lighting).toBe("soft_window"); // locked: unchanged

    const nextMood = applySwatchChange(swatches, locked, "mood", "energetic");
    expect(nextMood.mood).toBe("energetic"); // unlocked: changed
    expect(nextMood.lighting).toBe("soft_window"); // still untouched
  });

  it("reports whether a category can be changed", () => {
    expect(canChangeSwatch(["palette"], "palette")).toBe(false);
    expect(canChangeSwatch(["palette"], "mood")).toBe(true);
  });

  it("keeps a locked seed as part of every regenerated grid", () => {
    const seeds = buildSeeds(6, 12345);
    expect(seeds).toHaveLength(6);
    expect(seeds[0]).toBe(12345);
    expect(new Set(seeds).size).toBe(6); // no duplicates
  });

  it("generates a full grid of unique random seeds with no lock", () => {
    const seeds = buildSeeds(6, null);
    expect(seeds).toHaveLength(6);
    expect(new Set(seeds).size).toBe(6);
  });
});

describe("generateBracket", () => {
  const format = AD_FORMATS[0];

  it("holds the seed constant across the whole bracket strip", async () => {
    const options = await generateBracket({ seed: 999, category: "lighting", swatches, format });
    expect(options).toHaveLength(Math.min(5, SWATCH_CATALOG.lighting.length));
    for (const option of options) {
      expect(decodeURIComponent(option.dataUri)).toContain("seed 999");
    }
  });

  it("varies the bracketed attribute across options, producing different tiles", async () => {
    const options = await generateBracket({ seed: 999, category: "lighting", swatches, format });
    const uniqueTiles = new Set(options.map((o) => o.dataUri));
    expect(uniqueTiles.size).toBeGreaterThan(1);
    expect(options.map((o) => o.optionId)).toEqual(SWATCH_CATALOG.lighting.slice(0, 5).map((o) => o.id));
  });
});
