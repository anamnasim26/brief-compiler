import { describe, expect, it } from "vitest";
import { applyOverride, findBrandConflicts, mockPromptCompiler, type CompileInput } from "./prompt-compiler";
import { brandConfig } from "@/lib/config/brand";
import { SEGMENT_KEYS } from "@/lib/schema/recipe";

const baseInput: CompileInput = {
  assetType: "product_hero",
  swatches: { lighting: "soft_window", palette: "warm_neutrals", mood: "calm", composition: "centered_low_angle" },
  references: [],
};

describe("mockPromptCompiler", () => {
  it("puts brand exclusions in negativeText, never in the positive segments", () => {
    const compiled = mockPromptCompiler.compile(baseInput);
    const positiveText = SEGMENT_KEYS.map((k) => compiled.segments[k]).join(" ").toLowerCase();

    for (const word of brandConfig.forbiddenWords) {
      expect(compiled.negative.toLowerCase()).toContain(word.toLowerCase());
      expect(positiveText).not.toContain(word.toLowerCase());
    }
  });

  it("never leaks fixed-layer content (logo, price) into the prompt segments", () => {
    const compiled = mockPromptCompiler.compile({
      ...baseInput,
      references: [
        {
          id: "ref_1",
          fileName: "a.png",
          dataUrl: "data:image/png;base64,x",
          description: "features the brand logo and a $19.99 price sticker",
          autoDescription: "",
          edited: true,
        },
      ],
    });
    const positiveText = SEGMENT_KEYS.map((k) => compiled.segments[k]).join(" ").toLowerCase();
    expect(positiveText).not.toContain("logo");
    expect(positiveText).not.toContain("price");
    expect(positiveText).not.toContain("$");
  });

  it("respects the 1024-character budget on the compiled prompt", () => {
    const longDescription = "a very detailed reference description. ".repeat(60);
    const compiled = mockPromptCompiler.compile({
      ...baseInput,
      references: [
        {
          id: "ref_1",
          fileName: "a.png",
          dataUrl: "data:image/png;base64,x",
          description: longDescription,
          autoDescription: "",
          edited: true,
        },
      ],
    });
    const positiveText = SEGMENT_KEYS.map((k) => compiled.segments[k]).join(". ");
    expect(positiveText.length).toBeLessThanOrEqual(1024);
    expect(compiled.negative.length).toBeLessThanOrEqual(1024);
  });

  it("keeps an overridden segment's text across a recompile instead of overwriting it", () => {
    const first = mockPromptCompiler.compile(baseInput);
    const overridden = applyOverride(first, "subject", "a hand-written custom subject");

    const recompiled = mockPromptCompiler.compile({ ...baseInput, previousPrompt: overridden });

    expect(recompiled.segments.subject).toBe("a hand-written custom subject");
    expect(recompiled.overrides).toContain("subject");
  });

  it("recomputes non-overridden segments when a swatch changes", () => {
    const first = mockPromptCompiler.compile(baseInput);
    const changed = mockPromptCompiler.compile({
      ...baseInput,
      swatches: { ...baseInput.swatches, lighting: "golden_hour" },
      previousPrompt: first,
    });
    expect(changed.segments.lighting).not.toBe(first.segments.lighting);
  });

  it("folds the shot list's free text into the style segment", () => {
    const compiled = mockPromptCompiler.compile({ ...baseInput, freeText: "add a hint of morning fog" });
    expect(compiled.segments.style).toContain("add a hint of morning fog");
  });

  it("still respects the character budget with a long free-text note", () => {
    const compiled = mockPromptCompiler.compile({ ...baseInput, freeText: "extra detail. ".repeat(100) });
    const positiveText = SEGMENT_KEYS.map((k) => compiled.segments[k]).join(". ");
    expect(positiveText.length).toBeLessThanOrEqual(1024);
  });
});

describe("findBrandConflicts", () => {
  it("flags text containing a forbidden brand word", () => {
    const conflicts = findBrandConflicts("make it feel neon and cheap");
    expect(conflicts).toContain("neon");
    expect(conflicts).toContain("cheap");
  });

  it("returns nothing for on-brand text", () => {
    expect(findBrandConflicts("warm, premium, understated")).toEqual([]);
  });
});
