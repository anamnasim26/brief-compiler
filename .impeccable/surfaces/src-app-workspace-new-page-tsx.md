---
version: 1
slug: "src-app-workspace-new-page-tsx"
primary_target: "src/app/workspace/new/page.tsx"
related_targets: ["src/app/page.tsx","src/app/recipes/page.tsx","src/app/recipes/[id]/page.tsx"]
---

## Scope and visitor mode

Whole-app visual identity replacement (Operate mode). Applies to every surface: landing (`/`), the four-step workspace (`/workspace/new`), recipe list and detail (`/recipes`), export.

## Direction contract

**THESIS:** The product is a physical production document being marked up by hand, not a web app pretending to be one — the interface's central act (look at a grid, circle the winner) gets the exact ritual it's already named after in photography. Refuses the category default this build shipped with: generic instrument-panel SaaS (neutral grays, one soft indigo accent, bordered flat cards, Inter-on-white).

**OWN-WORLD:** Light-table white ground (`#F5F5F3`, faint cool cast) with near-black ink; one uncompromising grease-pencil red (`#C0392B`) as the system's only accent, used for primary actions and for the literal hand-marked selection ring — never diluted to a tint. Thin solid near-black 1px frame-lines (not soft gray hairlines) around every image tile, like sprocket-adjacent negative strips. Sharp or barely-eased corners on image frames and marks; a small conservative radius survives only on interactive chrome (buttons, inputs) where usability needs it. Geist Mono carries frame/seed numbers as literal negative edge-codes; Inter stays the UI workhorse (Operate mode; a system stack is the right register here, not a display face). Protected/fixed values (logo, exact brand color, copy, price, real product photo) are marked with a plain bracketed monospace tag, `[FIXED]`, replacing the lock-icon-everywhere pattern with the same plain, literal labeling a production form would use.

**STORY:** Priya reads every screen as a document she could staple into a production binder — the app trusts her the way a real set of call sheets and contact prints would, not the way a generic AI tool performs trustworthiness with soft gradients and sparkle icons.

**FIRST VIEWPORT (Pick step):** the variation grid sits on a lit, faintly-glowing white surface with thin black cell dividers; hovering a tile shows a loupe-style hover cue (slight scale + a drawn ring); the chosen tile gets a hand-drawn red grease-pencil circle, not a heart icon or a colored border.

**FORM:** Own top-ranked grounded candidate (IMPECCABLE'S PICK), chosen by the user over the script's assigned index-3 candidate (Call Sheet / Production Clipboard) and over re-roll and the standing exit. Seed key `42e6fbdb` (`impeccable concept-seed --scope direction --mode operate`). Six catalog challengers (one-bit desktop, CRT oscilloscope, civic bureau prospectus, orienteering map, iridescent cloud edge, industrial streetwear) were weighed and all declined on both audience-identification and product-clarity axes against the assigned direction; their disciplines were folded into the assigned direction's raises rather than this pick's, since the pick beat the assignment outright rather than needing a raise itself. Two disciplines carried forward into this pick anyway as good general practice: orienteering's strict color-always-means-this contract (red is reserved for marks/primary action only, never decorative), and industrial streetwear's plain literal labeling (`[FIXED]` instead of an icon-only convention).

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved decisions

None outstanding — no image generation is available this session, so this is a code-led build; no comp exists or is owed.
