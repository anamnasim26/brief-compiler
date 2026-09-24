# Brief Compiler — concept prototype

A concept prototype of **Brief Compiler**, an in-house designer tool for turning a visual idea into
on-brand AI banner imagery through references and swatches instead of prompt-writing. Full product
context lives in [`../PRD Brief Compiler.md`](../PRD%20Brief%20Compiler.md).

This build implements **Flow A** ("idea, no words") end to end: pick an asset type and format, show
what you mean with references and swatches, review the compiled prompt, generate a grid of variations,
then lock what works and refine one control at a time.

## What's real vs. mocked

Everything runs client-side, with no backend and no API keys required:

| Piece | This build | Real version would be |
| --- | --- | --- |
| Reference description | Deterministic phrase-bank mock (`src/lib/providers/vision-describer.ts`) | Claude vision |
| Prompt compilation | Rule-based template filler (`src/lib/providers/prompt-compiler.ts`) | Claude, structured output |
| Image generation | Deterministic seed-derived SVG tiles (`src/lib/providers/svg-tile.ts`, `image-provider.ts`) | Amazon Nova Canvas via Bedrock |
| Storage | Browser IndexedDB (`src/lib/store/recipe-store.ts`) — private to your browser, nothing leaves your machine | Postgres + S3/Vercel Blob |

Each mocked piece sits behind a small interface (`VisionDescriber`, `PromptCompiler`, `ImageProvider`),
so a real provider can be dropped in later without touching the UI.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables or accounts needed.

```bash
npm test       # Vitest: schema, compiler rules, format mapping, lock invariants
npm run lint   # ESLint
npm run build  # production build / type-check
```

## What's implemented

- Asset type + ad format picker, with per-type "what the model generates / what stays fixed" (R1)
- Reference upload with an editable mock description (R2)
- Lighting / palette / mood / composition swatches (R3)
- Read-only brand constraint chips, always applied (R4)
- Compiled prompt panel — collapsed (guided) or editable per-segment (expert), edits flagged as overrides (R5)
- Variation grid (2–8 tiles), each tagged with its seed (R6)
- Lock a swatch category or a specific seed, then change one thing and regenerate (R7)
- Every recipe is saved automatically and viewable/exportable as JSON (R9)
- Recipe history list and a per-recipe detail/export page, with a "continue in workspace" resume flow

## Not in this slice

Flow B (paste-a-prompt diagnosis, R8), Flow C (adapt-from-recipe lineage, R10), layout/export
compositing of logo/copy/price with `sharp`, real AWS/Bedrock/Claude wiring, and auth. See the PRD's
"Requirements" section for the full P0–P2 list.

## Deploying

This is a static-ish Next.js app with no server dependencies, so it deploys to Vercel with no
configuration — connect the repo (or run `vercel`) and ship.
