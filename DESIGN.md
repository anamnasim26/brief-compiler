---
name: Brief Compiler
description: A physical production document — light table, contact sheet, grease pencil — being marked up by hand, not a web app pretending to be one.
colors:
  grease-red: "oklch(0.543 0.174 29.7)"
  grease-red-foreground: "oklch(1 0 0)"
  red-wash: "oklch(0.94 0.03 30)"
  red-wash-foreground: "oklch(0.4 0.13 29)"
  light-table-white: "oklch(0.97 0.003 106)"
  paper: "oklch(0.955 0.004 90)"
  panel-white: "oklch(1 0 0)"
  ink: "oklch(0.2 0.004 85)"
  ink-muted: "oklch(0.46 0.006 85)"
  stamp-olive: "oklch(0.44 0.09 145)"
  amber-flag: "oklch(0.68 0.15 70)"
  alarm-red: "oklch(0.55 0.2 25)"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  stageTitle:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
  eyebrow:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.05em"
  edgeCode:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
rounded:
  sm: "2.4px"
  md: "3.2px"
  lg: "4px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "20px"
  xl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.grease-red}"
    textColor: "{colors.grease-red-foreground}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  button-subtle:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  edge-tag:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    typography: "{typography.edgeCode}"
  frame-tile:
    backgroundColor: "{colors.panel-white}"
    rounded: "0px"
  swatch-tile-selected:
    backgroundColor: "oklch(0.543 0.174 29.7 / 0.05)"
    textColor: "{colors.ink}"
    rounded: "0px"
---

# Design System: Brief Compiler

## Overview

**Creative North Star: "Light Table & Contact Sheet"**

Brief Compiler is a physical production document being marked up by hand — the interface's central act, look at a grid of variations and circle the winner, gets the exact ritual it's already named after in photography. Every screen reads like something that could be stapled into a production binder: light-table white, ruled black frame-lines around every image like sprocket-adjacent negative strips, and one uncompromising grease-pencil red that means exactly one thing everywhere it appears — this is the mark, this is the action. Nothing is decorative; nothing performs trustworthiness with soft gradients or a sparkle icon. It earns trust the way a real contact sheet does, by being legible, exact, and consistent.

This replaced an earlier, unreviewed default: neutral grays, one soft indigo accent, bordered flat cards on a generic Tailwind/shadcn base, running underneath Atlaskit components still wearing unbranded Atlassian blue. That system was never chosen — it was the shape the framework defaults settle into when nobody picks a world. This one was chosen: `impeccable concept-seed --scope direction --mode operate` (seed `42e6fbdb`) dealt six catalog challengers (a one-bit desktop, a CRT oscilloscope, a civic bureau prospectus, an orienteering map, an iridescent cloud edge, industrial streetwear); all six were weighed against the grounded direction list and declined on audience-identification and product-clarity grounds, and the user chose this direction — Impeccable's own top-ranked pick from that grounded list — over the assigned build candidate, re-roll, and the standing exit (a played-straight version of the old look). Two disciplines were kept from the declined challengers anyway as good general practice: an orienteering map's strict "this color always means this" contract, and industrial streetwear's plain, literal labeling.

**Key Characteristics:**
- One accent color, grease-pencil red, spent on primary actions and the literal hand-drawn "chosen" mark — never as decoration
- Solid black 1px frame-lines around every image tile, not soft gray hairlines — sharp corners on frames and marks, barely-eased corners on interactive chrome only
- A plain bracketed monospace tag, `[FIXED]` / `[LOCKED]`, replaces a lock icon wherever a value never touches the model or won't change this regeneration
- A hand-drawn grease-pencil circle (two overlapping, slightly misaligned red rings) is the system's one selection mark — used only where a human actually chose something
- Atlaskit's own components are rebranded to the same red via its supported `UNSAFE_themeOptions.brandColor` theming API, so `Button`, `Lozenge`, links, and focus rings match the rest of the system instead of defaulting to Atlassian blue
- Dark mode is the same world lit differently: a darkroom safelight (near-black ground, the same red now reading as safelight glow) rather than a separate identity

## Colors

Almost entirely neutral; color is a mark, not a mood.

### Primary
- **Grease-pencil red** (`oklch(0.543 0.174 29.7)` / `#C0392B`): the system's one saturated color. Used for the primary action per stage, the border of a selected tile, and the `GreaseCircle` hand-drawn selection ring. In dark mode it lightens to `oklch(0.62 0.19 29.7)` to hold contrast against the safelight-dark ground. This same red brands every Atlaskit primitive via `AppProvider`'s `defaultTheme={{ UNSAFE_themeOptions: { brandColor: "#C0392B" } }}` in `providers.tsx` — Atlaskit generates its own accessible hover/pressed ramp from that single hex.

### Secondary
- **Red wash** (`oklch(0.94 0.03 30)`): pale tint used only as the selected-tile fill (paired with the red border), never standing alone as a background.
- **Red wash foreground** (`oklch(0.4 0.13 29)`): darker-red text/icon color on top of the wash.

### Neutral
- **Light-table white** (`oklch(0.97 0.003 106)`): the default page background outside the workspace shell.
- **Paper** (`oklch(0.955 0.004 90)`): secondary-button fill, badge fill, the guided/expert toggle track — the "blank form" neutral.
- **Panel white** (`oklch(1 0 0)`): sidebars, the top bar, cards — the brightest surface, reserved for content needing full attention.
- **Ink** (`oklch(0.2 0.004 85)`): primary text.
- **Ink, muted** (`oklch(0.46 0.006 85)`): secondary text, captions, eyebrow labels.
- **Frame** (`oklch(0.2 0.004 85)`, exposed as `border-frame`): solid, mostly-opaque ink used specifically for image-tile borders — deliberately distinct from `--border`, which stays a soft 22%-opacity ink for ordinary dividers and inputs. A negative strip's edge is drawn in solid ink; a form's ruling is faint. Keeping these as two different tokens is what stops every hairline in the app from turning into a heavy black rule.

### Semantic
- **Stamp olive** (`oklch(0.44 0.09 145)`): satisfied brand-rule dot, the "LIVE" recipe indicator — reads as a rubber-stamp green, not a system-blue checkmark.
- **Amber flag** (`oklch(0.68 0.15 70)`): warning state (reserved).
- **Alarm red** (`oklch(0.55 0.2 25)`): destructive actions and validation errors — a distinct, more saturated red from the grease-pencil red, so "delete this" is never visually confusable with "this is selected."

### Named Rules
**The One Red Rule.** Grease-pencil red means exactly two things: a primary action, or a human's hand-drawn choice. It never fills a background, never decorates a badge at rest, and never appears twice for two different reasons on the same screen.

**The Frame vs. Border Rule.** `border-frame` (solid ink) is reserved for the edge of an image tile. `border` (translucent ink) is for everything else — dividers, input outlines, panel edges. Promoting an ordinary divider to `border-frame` is the tell that this system is being imitated rather than used.

## Typography

**Body/UI Font:** Inter — a workhorse UI face is the right register for a dense, daily-use Operate tool; a display face here would be a costume.
**Edge-code Font:** Geist Mono — reserved for values the system generated or can reproduce exactly (seed numbers, hex codes, character counts), formatted like a negative strip's printed edge code (`#04821`, zero-padded).

### Hierarchy
- **Display** (600, 2.25rem/36px, -0.015em): the single landing headline ("What do you have?"). Not used inside the workspace.
- **Stage Title** (600, 1.125rem/18px): per-stage headings inside the workspace.
- **Body** (400, 0.875rem/14px): the default size for nearly everything.
- **Caption** (400, 0.75rem/12px): secondary/muted copy.
- **Eyebrow** (700, 0.625rem/10px, 0.05em tracking, uppercase): section-opening labels ("Step 1 of 4", "Brand colours").
- **Edge-code** (500, 0.6875rem/11px, mono): seed numbers, hex values, character-budget counters.

### Named Rules
**The Plain Label Rule.** A protected value gets the literal tag `[FIXED]` or `[LOCKED]` in Edge-code type, never a lock glyph standing alone. The label says exactly what's true; nothing is implied by an icon's convention.

## Layout

Unchanged in structure from the incumbent shell, reused because it was already right: a fixed three-column grid, `280px | minmax(0,1fr) | 280px`, under a 56px top bar. What changed is the material the shell is built from — solid `border-frame` edges instead of soft hairlines around anything that holds an image, and the workspace canvas now carries a faint radial "light table glow" (`radial-gradient(ellipse at center, var(--panel) 0%, transparent 70%)`) behind the ad-format preview, rather than a flat gray fill.

Outside the workspace, layout stays a centered content column (`max-w-3xl` header, `max-w-5xl` landing grid) with a responsive card grid — the one place in the system that behaves like a normal page rather than a console.

## Elevation & Depth

Flat, still no shadow token anywhere. Depth now comes from three things: tonal layering (canvas glow behind panel white), the solid-vs-translucent border distinction (`border-frame` vs `border`), and the `GreaseCircle` mark bleeding slightly outside its tile — the one place anything is allowed to overflow its box, because a hand-drawn circle never stays inside the lines.

### Named Rules
**The No-Shadow Rule.** Still holds. A `box-shadow` never indicates elevation, hover, or selection — those are a border/fill change or the grease-pencil mark.

## Shapes

Radius was halved (base `0.25rem`, was `0.5rem`) and applied unevenly on purpose: chrome (buttons, inputs, badges) keeps a small, barely-eased radius for usability; every image frame, swatch tile, and bracket-option tile drops to `0px` — sharp corners, like a real negative strip or a printed form. The one deliberately organic shape in the system is `GreaseCircle`, two overlapping hand-drawn-feeling ellipses (not a perfect CSS circle) marking a chosen tile.

### Named Rules
**The Sharp Frame Rule.** Anything that holds a generated or reference image gets a square corner and a solid `border-frame` edge. Rounding an image tile is the fastest way this system starts looking like the generic app it replaced.

## Components

Atlaskit primitives (`Button`, `IconButton`, `LinkButton`, `Select`, `Tabs`, `TextArea`, `Textfield`, `Lozenge`, `Skeleton`) still supply the interaction layer, now rebranded to the system's red via `providers.tsx`'s `UNSAFE_themeOptions.brandColor` — this is load-bearing: an Atlaskit app that skips this step ships two unrelated color systems stacked on top of each other, which is a large, easy-to-miss reason a "customized" Atlaskit product still reads as generic. Every interactive control defaults to `spacing="compact"`.

### Buttons
- **Shape:** `rounded-md` (now ~3.2px, barely eased), compact padding.
- **Primary:** grease-pencil red fill, white text.
- **Subtle:** transparent, ink text.

### EdgeTag (signature component)
`<EdgeTag>FIXED</EdgeTag>` — a bracketed, mono, uppercase, tracked tag (`[FIXED]`). Replaces every prior `LockKeyhole` icon instance. Used only where the label is literally true: a fixed-layer value (logo, exact brand color, copy, price, product photo) that never reaches the model, or a swatch category locked for this regeneration. Never used decoratively — `RecipePanel`'s prior blanket lock-icon-on-every-row (including rows that were never actually fixed) was removed rather than translated, since it was a misapplication the redesign also corrected.

### GreaseCircle (signature component)
Two overlapping SVG ellipses in the system's red, at slightly different centers, radii, and rotation, rendered absolutely over a tile (`inset-[-7%]`, so the mark bleeds past the frame like a real pencil stroke would). The system's only selection mark — appears on a favorited tile in the Pick grid, the chosen hero in Refine, and a selected bracket option. Never appears for hover or focus; only for an actual recorded choice.

### Tiles (swatch / asset-type / bracket option / image)
Square-cornered, `border-frame/50` at rest, full `border-primary` + red-wash fill when selected, `bg-muted` fill on hover. The reused choice pattern across the whole workspace.

### Wordmark
The literal app name is set as `[Brief Compiler]` in the top bar — brackets in Edge-code mono around the Inter wordmark — folding the product's own identity into the same bracket-tag vocabulary as `[FIXED]` and `[LOCKED]`, and replacing a generic `WandSparkles` icon that read as stock "AI tool" iconography.

## Do's and Don'ts

### Do:
- **Do** keep grease-pencil red to primary actions and the `GreaseCircle` mark only (The One Red Rule).
- **Do** use `border-frame` (solid) for image-tile edges and `border` (translucent) for everything else (The Frame vs. Border Rule).
- **Do** brand every new Atlaskit surface through `providers.tsx`'s theme options rather than letting a component default to Atlassian blue.
- **Do** use `[FIXED]` / `[LOCKED]` (`EdgeTag`) only where the claim is literally true.
- **Do** keep image tiles and swatch tiles square-cornered; keep interactive chrome barely-eased.

### Don't:
- **Don't** round an image or reference tile — that's the tell this system reverted to the generic default (The Sharp Frame Rule).
- **Don't** introduce a second saturated accent; route anything that isn't the grease-pencil red through ink/paper/frame neutrals.
- **Don't** add a `box-shadow` for elevation, hover, or selection state.
- **Don't** apply `GreaseCircle` or `EdgeTag` decoratively — both mean something specific and lose their force the moment they're sprinkled for texture.
- **Don't** leave a new Atlaskit component unbranded; check it picks up the red, not Atlassian blue, before shipping it.
