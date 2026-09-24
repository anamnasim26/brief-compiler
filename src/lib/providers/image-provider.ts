import { tileDataUri } from "@/lib/providers/svg-tile";
import type { AdFormat, SwatchSelection } from "@/lib/schema/recipe";

export interface GenerateTileInput {
  seed: number;
  format: AdFormat;
  swatches: SwatchSelection;
}

export interface GeneratedTile {
  seed: number;
  dataUri: string;
}

/**
 * ImageProvider is the adapter boundary described in the PRD: a real
 * implementation (Bedrock Nova Canvas) can be dropped in later behind
 * this same interface without touching the UI or the compiler.
 */
export interface ImageProvider {
  generate(inputs: GenerateTileInput[]): Promise<GeneratedTile[]>;
}

export const mockImageProvider: ImageProvider = {
  async generate(inputs) {
    // Simulate network latency so the grid's loading state is exercised.
    await new Promise((resolve) => setTimeout(resolve, 200));
    return inputs.map((input) => ({
      seed: input.seed,
      dataUri: tileDataUri({
        seed: input.seed,
        width: input.format.width,
        height: input.format.height,
        copySafeZone: input.format.copySafeZone,
        lightingId: input.swatches.lighting,
        paletteId: input.swatches.palette,
        moodId: input.swatches.mood,
        compositionId: input.swatches.composition,
      }),
    }));
  },
};
