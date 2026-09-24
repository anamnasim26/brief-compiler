import { describe, expect, it } from "vitest";
import { AD_FORMATS } from "./formats";

describe("ad formats", () => {
  it("every format has a copy-safe zone within the 0-1 frame", () => {
    for (const format of AD_FORMATS) {
      const [x0, y0, x1, y1] = format.copySafeZone;
      expect(x0).toBeGreaterThanOrEqual(0);
      expect(y0).toBeGreaterThanOrEqual(0);
      expect(x1).toBeLessThanOrEqual(1);
      expect(y1).toBeLessThanOrEqual(1);
      expect(x1).toBeGreaterThan(x0);
      expect(y1).toBeGreaterThan(y0);
    }
  });

  it("flags formats outside Nova Canvas's 1:4-4:1 supported ratio as extreme", () => {
    const leaderboard = AD_FORMATS.find((f) => f.id === "728x90")!;
    const ratio = leaderboard.width / leaderboard.height;
    expect(ratio).toBeGreaterThan(4);
    expect(leaderboard.extremeRatio).toBe(true);
  });

  it("does not flag formats inside the supported ratio range", () => {
    const rect = AD_FORMATS.find((f) => f.id === "300x250")!;
    expect(rect.extremeRatio).toBe(false);
  });
});
