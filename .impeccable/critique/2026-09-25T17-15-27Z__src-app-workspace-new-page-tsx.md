---
target: src/app/workspace/new/page.tsx
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:/Users/anamnasim/Desktop/Amazon Project/brief-compiler/src/app/workspace/new/page.tsx"
target_fingerprint: "sha256:56d283830084327f59ab96ed515f75165f08b570b0359bd2f6fd306d7c41b802"
target_path: /Users/anamnasim/Desktop/Amazon Project/brief-compiler/src/app/workspace/new/page.tsx
timestamp: 2026-09-25T17-15-27Z
slug: src-app-workspace-new-page-tsx
---
**Method: dual-agent (A: independent design review · B: detector + browser evidence)**

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Generation-loading UI (skeleton grid, "Generating N options…" banner) is architecturally unreachable — see P1 below |
| 2 | Match System / Real World | 3 | Vocabulary (bracket, lock, shot list, recipe) fits a designer's mental model well |
| 3 | User Control and Freedom | 2 | Pick-stage empty state names a recovery action but gives no clickable way to take it |
| 4 | Consistency and Standards | 2 | Step count disagrees with itself (4 vs. 5); the lock icon is applied to fields that aren't actually protected |
| 5 | Error Prevention | 3 | Brand-conflict detection in free text is a real, non-blocking guardrail |
| 6 | Recognition Rather Than Recall | 3 | Swatches always pair preview + text label; prior choices stay visible in the right rail |
| 7 | Flexibility and Efficiency | 1 | Expert mode's raw-prompt view disappears the moment a prompt actually exists |
| 8 | Aesthetic and Minimalist Design | 3 | Consistently restrained; matches DESIGN.md's Rare Iris / No-Shadow rules |
| 9 | Error Recovery | 2 | Upload validation is specific and actionable; the empty-grid dead end is not |
| 10 | Help and Documentation | 1 | The richest explanatory copy in the codebase (whatModelGenerates/whatStaysFixed) is written and never rendered |
| **Total** | | **22/40** | **Acceptable** |

## Design Specificity Verdict

**LLM assessment:** Grounded, not generic — with one significant undercut. The locked-row pattern, real bracketing interaction, and prompt-native swatch language are specific to this product's actual differentiators, not a reskinned generic tool. But the per-asset-type whatModelGenerates/whatStaysFixed copy — the single most product-specific explanation in the codebase — is defined and never rendered anywhere. Without it, the asset-type picker reads as generic template selection at exactly the moment specificity would matter most.

**Deterministic scan:** Clean scan (exit 0), one advisory finding: text-[9px] at src/app/page.tsx:58, off DESIGN.md's documented type ramp (closest steps are Eyebrow/10px and Mono/11px). Notably, this is the same element Assessment A flagged independently on UX grounds (P3 below) — the "not built here" corner label on four unbuilt landing-page cards. Mechanical and qualitative review converged on the same line for different reasons.

**Visual overlays:** Not available. Browser automation (claude-in-chrome) was not connected in this session — both assessments confirmed this independently. No screenshots, no live walkthrough, no runtime/console error capture exists for this run. Treat this as an evidence gap, not a clean bill of health on runtime behavior.

## Overall Impression

The product's real ideas — locked fields, bracketing, the recipe as a persistent object — are honestly built where they appear. But two P1s suggest the build's own wiring hasn't caught up with its intent: expert mode's prompt view vanishes right when it would matter, and the purpose-built loading state can structurally never render due to a React batching order issue. The flow also ends on its weakest screen (Export drops the Studio Console visual language right when a brand reviewer needs to trust it most) rather than its strongest (Refine).

## What's Working

1. **Bracketing is real, not decorative** — locked hero preview + explicit "Locked: composition and everything else" copy + one-attribute-at-a-time tabs (refine-stage.tsx).
2. **Brand-conflict handling respects "never force it"** — flags a forbidden word with Replace/Keep-anyway, never blocks (shot-list-panel.tsx).
3. **Swatches always pair a visual with a text label** — correctly implements the accessibility mandate rather than treating it as an afterthought.

## Priority Issues

**[P1] Expert mode's core promise — raw prompt access — is unreachable after generation.**
Why it matters: Arjun is explicitly defined as someone who routes around tools that hide the prompt; this build hides it completely the moment it exists (PromptPanel only mounts during shot_list, while recipe.prompt is still null).
Fix: Render a read-only PromptPanel in the right rail during pick/refine, sourced from the compiled recipe.
Suggested command: /impeccable harden

**[P1] The generation-loading state is dead code.**
Why it matters: current_step flips to pick and generating flips to false in the same React commit (page.tsx handleGenerate), so the purpose-built skeleton grid and "Generating N options…" banner can never render — Priya's highest-frequency wait (10–30x/day) has no real feedback.
Fix: Set the step/sub-state before awaiting the image provider, not after.
Suggested command: /impeccable optimize

**[P2] Export screen abandons the Studio Console language at the highest-stakes step.**
Why it matters: export-screen.tsx switches to the landing page's centered/rounded-lg/larger-type idiom — DESIGN.md explicitly prohibits this. The trust built over 4 console-styled screens evaporates exactly where a brand reviewer needs it most.
Fix: Keep Export inside the three-column shell's visual conventions.
Suggested command: /impeccable polish

**[P2] The "Final Check" checklist doesn't gate export.**
Why it matters: All three checklist items are togglable but never read by the Export button's disabled state — the reassurance at the highest-stakes moment is cosmetic, not functional.
Fix: Either gate export on the checks, or record checklist state in the exported artifact as a real audit trail.
Suggested command: /impeccable harden

**[P3] Landing page oversells four flows that don't exist.**
Why it matters: 5 equally-weighted cards all route to the same Flow A; the other 4 carry a barely-visible 9px "not built here" tag (the same line the detector independently flagged).
Fix: Dim/disable the unbuilt cards with a real "coming soon" treatment, or drop them from this build.
Suggested command: /impeccable clarify

## Persona Red Flags

**Alex / Arjun (power user):** No keyboard shortcuts found anywhere in the workspace despite DESIGN.md calling expert mode "keyboard-first"; Regenerate re-runs the whole grid with no targeted re-roll from Pick.

**Jordan / Meera (first-timer, junior designer):** Picks a landing card by its promised title, lands in a different flow; hits 24 simultaneous swatch options (4 categories × 6, no hints populated) with zero worked examples, despite PRODUCT.md naming exactly this as her abandonment trigger.

**Sam (accessibility-dependent):** Solid baseline (real buttons, aria-pressed, labeled icon buttons) — but the Pick-stage empty state is prose with no focusable control, a genuine keyboard dead end.

## Minor Observations

- Two icons both read as "lock" with different guarantees — LockKeyhole (permanent/never-generated) vs. Lock/Unlock (regeneration-only toggle) — never disambiguated in-product.
- RecipePanel shows a lock icon on Seed even when nothing is locked.
- export-screen.tsx's handleAdapt/parent_id lineage button is functionally Flow C, which PRODUCT.md lists as out of scope for this build — worth reconciling.
- SwatchCategoryPicker's hint prop exists for exactly Meera's stated need and is never populated at any call site.

## Questions to Consider

1. If the whatModelGenerates/whatStaysFixed copy already exists per asset type, what would the Frame step look like with it as primary content instead of dead data?
2. What if guided/expert weren't a global toggle but a per-panel disclosure — letting Arjun skip to prompt-editing while Meera still gets scaffolding?
3. The recipe is meant to be the product's real differentiator, yet it's only fully visible as raw JSON at Export — what if it were a live, readable strip from Frame step 1 onward?
4. Given 6 real options per swatch category, should the interaction change to a progressive "3-4 starters + show all 6" rather than exceeding the 4-per-group guideline outright?
5. Does "never force it" (Principle 3) apply to the creative/guided layer only — or should a final QA gate before export be allowed to actually block?
