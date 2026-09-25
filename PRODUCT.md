# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary user: **Priya**, a mid-level in-house designer with strong visual skills and little AI-model prompting fluency. She turns marketing briefs into AI-generated banner imagery, 10 to 30 assets a week, under real production pressure (formats, deadlines, brand review).

Secondary roles the design must account for even though they are not the primary optimization target:
- **Arjun**, senior designer — wants speed, raw prompt access, no hand-holding; will route around the tool if it hides the prompt or forces a wizard.
- **Meera**, junior designer — wants guardrails, worked examples, confidence she's on-brand; abandons on blank fields with no guidance.
- **Brand reviewer** — not a hands-on user of the generation flow, but reads the saved recipe at review time to understand how an asset was made.
- **Design system owner** — owns brand config and templates; wants visibility into drift, ideally without needing engineering to update rules.

These are proto-personas from secondary research, not yet validated in interviews with real designers (per the PRD's research plan).

## Product Purpose

Brief Compiler is a creative-direction workspace that helps in-house designers turn a creative brief into on-brand, production-viable AI banner imagery without needing to learn prompt-writing. It solves the second of two translations designers do: brief → visual intent (their existing skill) and visual intent → words a model understands (where they struggle). The tool only helps with the second translation; creative judgment and the concept itself stay with the designer.

Success means a designer reaches a usable, on-brand image in fewer attempts, and can explain and reproduce how she got there. The product does not replace concepting, does not generate finished banners (logo/copy/price stay out of the model), and does not auto-score brand compliance.

## Positioning

Differentiates on **designer control, reproducibility, and team consistency**, not on raw generation quality — image models and platforms like Amazon Ads Creative Agent and Adobe GenStudio already generate ads from briefs; the unsolved gap this product targets is trustworthy, explainable, repeatable output inside an in-house team.

Mechanism a competitor can't casually copy: every entry point reads and writes one shared object, **the recipe** (inputs, compiled prompt, seed, model version, lineage). Three structural commitments carry this:
1. **Three-layer split** — fixed elements (logo, exact colors, copy, price, product photo) never touch the model; guided elements (lighting, mood, composition, asset type) are structured swatch/reference choices; open elements (free text, references) are the designer's space.
2. **Reliable range, not one output** — every run returns a grid of variations; success is "some are usable," not "the first one is perfect."
3. **Traceable, bracketed change** — each control maps to one prompt segment; designers lock what works and change one attribute at a time (bracketing), so cause and effect stay visible instead of a blind re-roll.

## Operating Context

- **Entry flow shipped in this build (Flow A / "idea, no words"):** pick asset type + ad format → drop references and pick lighting/palette/mood/composition swatches → review the compiled prompt (collapsed in guided mode, editable per-segment in expert mode) → generate a grid of 2–8 variations, each tagged with its seed → lock what works and refine one control at a time → recipe is saved automatically and is viewable/exportable as JSON.
- **Not in this build:** Flow B (paste-a-prompt diagnosis), Flow C (adapt-from-a-saved-recipe lineage), layout/export compositing of logo+copy+price, real AWS/Bedrock/Claude wiring, auth. See PRD "Requirements" (R8, R10, R13–R21) for the deferred scope.
- **Guided vs. expert mode:** juniors get structure, examples, and explanations; seniors get an editable raw prompt and keyboard-first interaction. Both read/write the same recipe.
- **Two audiences at review time:** the designer curating a grid, and a brand reviewer later reading the attached recipe to understand how an asset was made — the recipe is the shared artifact between them.
- **Volume shapes behavior:** always-on/high-stakes-low work (deal banners) wants templates and fast defaults; tentpole work (e.g., a flagship campaign hero) wants more variations and wider style range.

## Capabilities and Constraints

- **Mocked in this build, real interfaces are already abstracted behind swappable providers** (`VisionDescriber`, `PromptCompiler`, `ImageProvider`): reference description is a deterministic phrase-bank mock, prompt compilation is a rule-based template filler, image generation is deterministic seed-derived SVG tiles, storage is browser IndexedDB (nothing leaves the browser). The real-version targets are Claude (vision + structured-output prompt compilation) and Amazon Nova Canvas via Bedrock.
- **Brand constraints are non-negotiable in guided mode:** loaded from a versioned brand config, shown as read-only chips, present in every compiled prompt, and cannot be removed by a guided-mode user.
- **The recipe is the data backbone:** `recipe_id`, `parent_id`, `entry_point`, `asset_type`, `format` (with copy-safe zone), `brief`, `references`, `swatches`, `brand_constraints_version`, `prompt` (segments + negative + overrides), `template_version`, `model`, `generation` (seeds/variations/locked), `outputs`, `ratings`. Every entry point writes to it; every output keeps one.
- **Prompt templates vary by asset type** (product hero, lifestyle scene, seasonal/promo, type-led banner) because each needs a different structure and a different "what's fixed vs. generated" split.
- **Nova Canvas request limits that shape the UI:** `text`/`negativeText` ≤ 1,024 characters each; `numberOfImages` 1–5 per request (so a 6-image grid costs two requests); seed range 0–2,147,483,646; sizes 320–4,096px per side, divisible by 16, aspect 1:4–4:1 (extreme ratios like 728×90 need crop/outpaint).
- **Accessibility target:** keyboard-operable workspace, text-labeled swatches (never color/thumbnail alone), WCAG 2.2 AA contrast.
- **Terminology to keep consistent:** "recipe" (not "project" or "session"), "bracket"/"bracketing" (varying one attribute across a set with the seed locked), "lock" (pin a segment or seed across a regeneration), "guided mode" / "expert mode", "compiled prompt", "swatch."
- **Stack (existing codebase, confirmed by code):** Next.js (App Router) + TypeScript, Tailwind v4, shadcn/ui components alongside Atlaskit components (`@atlaskit/*`) used as real, functioning UI primitives — not a placeholder set. Zod for schemas, IndexedDB (`idb`) for local recipe storage, Vitest for tests. Inter (sans) and Geist Mono (mono) via `next/font/google`.

## Brand Commitments

This is a **design case study / portfolio project**, not a real Amazon-deployed tool. Amazon is the simulated client/context the PRD is written against; the product itself does not need real Amazon trademarks or branding.

The prototype's brand is intentionally a fictional stand-in, confirmed to keep:
- **Brand name:** Aurora Home Goods (`brand-2026.09` config version)
- **Palette:** Deep Navy `#0B1F3A`, Warm Sand `#E8D9C5`, Coral Accent `#FF6B4A`, Sage `#8CA292`
- **Tone words:** premium, approachable, warm
- **Forbidden elements:** competitor logos/packaging, neon/saturated colors outside the palette, cluttered/busy backgrounds, stock-photo watermarks, visible baked-in text/lettering
- **Forbidden words:** neon, cheap, generic clipart, stock photo

Any UI or generated-imagery direction work should render Aurora Home Goods as the demonstrated brand the tool is constraining output against — this is what "brand constraints applied automatically" should look like in the workspace, not a placeholder to swap out later.

## Evidence on Hand

- `PRD Brief Compiler.md` (project root, one level up): the full PRD — personas, JTBD, ten scored concepts, MVP rationale, flows, requirements (P0–P2), recipe schema, edge cases, metrics tree, testing plan, milestones, risks. Treat as authoritative product reasoning; this PRODUCT.md summarizes what's durable for design decisions, not a replacement for it.
- Working prototype implementing Flow A end-to-end (see `README.md` for the real-vs-mocked table).
- No real user interviews, usability sessions, or pilot data exist yet — the PRD's personas, hypotheses (H1–H6), and severity ratings are explicitly unvalidated. Do not present them as confirmed research in any case-study narrative; state them as hypotheses.
- No real brand assets, logos, or approved banners exist — Aurora Home Goods is invented for this project (see Brand Commitments). Do not fabricate customer testimonials, real Amazon screenshots, or real reviewer quotes.

## Product Principles

1. **Only help with the second translation.** The tool turns visual intent into model language; it never picks or overrides the creative concept.
2. **Fixed things stay fixed.** Logo, exact brand color, copy, price, and real product photography never pass through the generative model — no exception, no "just this once" affordance.
3. **Show, don't tell — but never force it.** References and swatches lead; free text is always available, never required, and guided mode never blocks on an empty field without an example.
4. **Make change traceable.** One control, one prompt segment. Locking and bracketing exist so a designer can explain why an image changed, not just that it did.
5. **Every image remembers how it was made.** The recipe is what turns a lucky generation into a repeatable, reviewable, reusable asset — this is the product's actual differentiation, so it should never feel like an afterthought in the UI.

## Accessibility & Inclusion

WCAG 2.2 AA contrast; fully keyboard-operable workspace; swatches (lighting, palette, mood, composition) must always carry a text label, never rely on thumbnail/color alone to convey meaning.
