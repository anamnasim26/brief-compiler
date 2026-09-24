import { describe, expect, it } from "vitest";
import { createEmptyRecipe, recipeSchema } from "./recipe";

describe("recipe schema", () => {
  it("validates a freshly created empty recipe", () => {
    const recipe = createEmptyRecipe();
    const result = recipeSchema.safeParse(recipe);
    expect(result.success).toBe(true);
  });

  it("round-trips through JSON without losing data", () => {
    const recipe = createEmptyRecipe();
    recipe.asset_type = "product_hero";
    recipe.swatches = { lighting: "soft_window", palette: "warm_neutrals", mood: "calm", composition: "centered_low_angle" };

    const json = JSON.stringify(recipe);
    const parsed = recipeSchema.parse(JSON.parse(json));

    expect(parsed).toEqual(recipe);
  });

  it("rejects a recipe with an invalid asset type", () => {
    const recipe = createEmptyRecipe();
    // @ts-expect-error intentionally invalid for the test
    recipe.asset_type = "not_a_real_type";
    const result = recipeSchema.safeParse(recipe);
    expect(result.success).toBe(false);
  });

  it("keeps parent_id nullable for future lineage support", () => {
    const recipe = createEmptyRecipe();
    expect(recipe.parent_id).toBeNull();
  });

  it("defaults the workspace step to frame and the checklist to unchecked", () => {
    const recipe = createEmptyRecipe();
    expect(recipe.current_step).toBe("frame");
    expect(recipe.checklist).toEqual({ productAccurate: false, copySafe: false, noUnexpectedText: false });
  });

  it("validates a recipe with layout text, free text and a favourited output", () => {
    const recipe = createEmptyRecipe();
    recipe.layout = { brandName: "Aurora", headline: "Mornings, perfected.", price: "$149" };
    recipe.free_text = "add a hint of morning fog";
    recipe.outputs = [{ seed: 42, dataUri: "data:image/svg+xml,x", status: "chosen", favourited: true, createdAt: recipe.created_at }];
    recipe.generation.bracketAttribute = "lighting";
    const result = recipeSchema.safeParse(recipe);
    expect(result.success).toBe(true);
  });

  it("rejects an invalid workspace step", () => {
    const recipe = createEmptyRecipe();
    // @ts-expect-error intentionally invalid for the test
    recipe.current_step = "not_a_step";
    const result = recipeSchema.safeParse(recipe);
    expect(result.success).toBe(false);
  });
});
