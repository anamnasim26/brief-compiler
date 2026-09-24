import { getSwatchOption } from "@/lib/templates/swatches";
import { brandConfig } from "@/lib/config/brand";
import type { AdFormat, SwatchSelection } from "@/lib/schema/recipe";

/** Deterministic PRNG so the same seed always renders the same tile. */
export function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface TileOverlay {
  brandName: string;
  headline: string;
  price: string;
}

export interface TileParams {
  seed: number;
  width: number;
  height: number;
  copySafeZone: [number, number, number, number];
  lightingId: string | null;
  paletteId: string | null;
  moodId: string | null;
  compositionId: string | null;
  /** The fixed layer (logo/headline/price), composited into the safe zone. Omit to render the pure generated tile. */
  overlay?: TileOverlay;
}

const INK = "#1a1a2e";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderOverlay(w: number, h: number, zone: [number, number, number, number], overlay: TileOverlay): string {
  const [sx0, sy0, sx1, sy1] = zone;
  const zx = sx0 * w;
  const zy = sy0 * h;
  const zw = (sx1 - sx0) * w;
  const zh = (sy1 - sy0) * h;
  const pad = Math.max(4, Math.min(zw, zh) * 0.08);

  const backing = `<rect x="${zx.toFixed(1)}" y="${zy.toFixed(1)}" width="${zw.toFixed(1)}" height="${zh.toFixed(1)}" fill="white" opacity="0.55" />`;

  const brandSize = Math.max(6, Math.min(zh * 0.12, 11));
  const headlineSize = Math.max(9, Math.min(zh * 0.26, 20));
  const priceSize = Math.max(8, Math.min(zh * 0.2, 16));
  const lineGap = Math.max(2, zh * 0.04);

  const lines: string[] = [];
  let cursorY = zy + pad + brandSize;
  if (overlay.brandName) {
    lines.push(
      `<text x="${(zx + pad).toFixed(1)}" y="${cursorY.toFixed(1)}" font-family="sans-serif" font-weight="700" font-size="${brandSize.toFixed(1)}" letter-spacing="1" fill="${INK}">${escapeXml(overlay.brandName.toUpperCase())}</text>`
    );
    cursorY += headlineSize + lineGap;
  }
  if (overlay.headline) {
    lines.push(
      `<text x="${(zx + pad).toFixed(1)}" y="${cursorY.toFixed(1)}" font-family="sans-serif" font-weight="700" font-size="${headlineSize.toFixed(1)}" fill="${INK}">${escapeXml(overlay.headline)}</text>`
    );
  }
  if (overlay.price) {
    const priceY = zy + zh - pad;
    lines.push(
      `<text x="${(zx + pad).toFixed(1)}" y="${priceY.toFixed(1)}" font-family="sans-serif" font-weight="800" font-size="${priceSize.toFixed(1)}" fill="${INK}">${escapeXml(overlay.price)}</text>`
    );
  }

  return `<g clip-path="url(#safe-zone-clip)">${backing}${lines.join("")}</g>`;
}

const FALLBACK_PALETTE = brandConfig.palette.map((c) => c.hex);

function scaleViewBox(width: number, height: number): { w: number; h: number } {
  const maxDim = 420;
  const scale = maxDim / Math.max(width, height);
  return { w: Math.round(width * scale), h: Math.round(height * scale) };
}

export function renderTileSvg(params: TileParams): string {
  const rng = mulberry32(params.seed);
  const { w, h } = scaleViewBox(params.width, params.height);

  const lighting = getSwatchOption("lighting", params.lightingId);
  const palette = getSwatchOption("palette", params.paletteId);
  const mood = getSwatchOption("mood", params.moodId);
  const composition = getSwatchOption("composition", params.compositionId);

  const colors = palette?.preview.type === "palette" ? palette.preview.colors : FALLBACK_PALETTE;
  const colorA = colors[Math.floor(rng() * colors.length)] ?? FALLBACK_PALETTE[0];
  const colorB = colors[Math.floor(rng() * colors.length)] ?? FALLBACK_PALETTE[1];

  const isHardLight = params.lightingId === "hard_directional" || params.lightingId === "golden_hour";
  const angle = Math.round(rng() * 360);

  const moodCount: Record<string, number> = {
    energetic: 7,
    playful: 6,
    festive: 6,
    calm: 3,
    luxurious: 3,
    minimal: 2,
  };
  const shapeCount = params.moodId ? (moodCount[params.moodId] ?? 4) : 4;

  const dot = composition?.preview.type === "dot" ? composition.preview : { x: 50, y: 50 };

  const shapes: string[] = [];
  for (let i = 0; i < shapeCount; i++) {
    const jitterX = (rng() - 0.5) * 40;
    const jitterY = (rng() - 0.5) * 40;
    const cx = ((dot.x + jitterX) / 100) * w;
    const cy = ((dot.y + jitterY) / 100) * h;
    const r = (0.08 + rng() * 0.12) * Math.min(w, h);
    const opacity = (isHardLight ? 0.35 : 0.22) + rng() * 0.15;
    const fill = i % 2 === 0 ? colorA : colorB;
    shapes.push(
      `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${fill}" opacity="${opacity.toFixed(2)}" filter="url(#soften)" />`
    );
  }

  const [sx0, sy0, sx1, sy1] = params.copySafeZone;
  const safeZoneRect = `<rect x="${(sx0 * w).toFixed(1)}" y="${(sy0 * h).toFixed(1)}" width="${((sx1 - sx0) * w).toFixed(1)}" height="${((sy1 - sy0) * h).toFixed(1)}" fill="none" stroke="white" stroke-opacity="0.5" stroke-dasharray="4 4" />`;

  const seedLabel = `<g><rect x="${w - 58}" y="${h - 22}" width="54" height="16" rx="3" fill="black" opacity="0.55" /><text x="${w - 51}" y="${h - 10}" font-family="monospace" font-size="9" fill="white">seed ${params.seed}</text></g>`;

  const caption = [lighting?.label, mood?.label].filter(Boolean).join(" · ");
  const captionLabel = caption
    ? `<text x="8" y="${h - 10}" font-family="sans-serif" font-size="9" fill="white" opacity="0.85">${caption}</text>`
    : "";

  const overlayGroup = params.overlay ? renderOverlay(w, h, params.copySafeZone, params.overlay) : "";
  const clipZoneWidth = (sx1 - sx0) * w;
  const clipZoneHeight = (sy1 - sy0) * h;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
    <defs>
      <linearGradient id="bg" gradientTransform="rotate(${angle} 0.5 0.5)">
        <stop offset="0%" stop-color="${colorA}" />
        <stop offset="100%" stop-color="${colorB}" />
      </linearGradient>
      <filter id="soften" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="${(Math.min(w, h) * 0.03).toFixed(1)}" />
      </filter>
      <clipPath id="safe-zone-clip">
        <rect x="${(sx0 * w).toFixed(1)}" y="${(sy0 * h).toFixed(1)}" width="${clipZoneWidth.toFixed(1)}" height="${clipZoneHeight.toFixed(1)}" />
      </clipPath>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)" />
    ${shapes.join("\n    ")}
    ${safeZoneRect}
    ${overlayGroup}
    ${captionLabel}
    ${seedLabel}
  </svg>`;
}

export function tileDataUri(params: TileParams): string {
  const svg = renderTileSvg(params);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 2_147_483_646);
}

/**
 * Regenerates the exact same background as a given output (deterministic
 * from its seed + the recipe's current swatches) with the fixed layer
 * composited on top. No separate "composited" storage is needed — the
 * same seed always reproduces the same background (R9).
 */
export function compositeTileDataUri(
  seed: number,
  format: AdFormat,
  swatches: SwatchSelection,
  overlay?: TileOverlay
): string {
  return tileDataUri({
    seed,
    width: format.width,
    height: format.height,
    copySafeZone: format.copySafeZone,
    lightingId: swatches.lighting,
    paletteId: swatches.palette,
    moodId: swatches.mood,
    compositionId: swatches.composition,
    overlay,
  });
}

/** A neutral preview tile for steps before any real generation exists (Frame, Shot list). */
export function placeholderTileDataUri(
  width: number,
  height: number,
  copySafeZone: [number, number, number, number],
  overlay?: TileOverlay
): string {
  return tileDataUri({
    seed: 7,
    width,
    height,
    copySafeZone,
    lightingId: null,
    paletteId: null,
    moodId: null,
    compositionId: null,
    overlay,
  });
}
