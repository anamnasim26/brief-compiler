/**
 * Describes a reference image in plain language so a designer never has
 * to write prompt vocabulary themselves (R2). The mock implementation
 * can't actually see pixels, so it produces a plausible, clearly-labeled
 * placeholder built from a phrase bank, deterministic per file so the
 * same upload always gets the same starting description. It's always
 * editable — see the "vision descriptions can be wrong" limitation in
 * the PRD.
 */
export interface VisionDescriber {
  describe(input: { fileName: string; sizeBytes: number }): Promise<string>;
}

const PHRASE_BANK = [
  "soft diffused daylight",
  "warm wood-grain surface",
  "muted earthy palette",
  "shallow depth of field",
  "minimalist framing with open negative space",
  "cool marble surface",
  "gentle directional shadow",
  "textured linen backdrop",
  "close, tightly cropped framing",
  "airy, uncluttered scene",
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export const mockVisionDescriber: VisionDescriber = {
  async describe({ fileName, sizeBytes }) {
    const seed = hashString(`${fileName}:${sizeBytes}`);
    const pick = (offset: number) => PHRASE_BANK[(seed + offset * 7) % PHRASE_BANK.length];
    const phrases = [pick(0), pick(1), pick(2)];
    const unique = Array.from(new Set(phrases));
    return `Looks like: ${unique.join(", ")}.`;
  },
};
