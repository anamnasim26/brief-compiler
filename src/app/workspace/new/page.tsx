"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Skeleton from "@atlaskit/skeleton";
import { TopBar } from "@/components/workspace/top-bar";
import { FramePanel } from "@/components/workspace/frame-panel";
import { ShotListPanel } from "@/components/workspace/shot-list-panel";
import { PickStage, PickSidebar } from "@/components/workspace/pick-stage";
import { RefineStage, RefineSidebar } from "@/components/workspace/refine-stage";
import { BrandRulesPanel } from "@/components/workspace/brand-rules-panel";
import { RecipePanel } from "@/components/workspace/recipe-panel";
import { AdCanvas, StageHeader } from "@/components/workspace/ad-canvas";
import { PromptPanel } from "@/components/workspace/prompt-panel";
import { ExportScreen } from "./export-screen";
import { useRecipeDraft } from "@/lib/store/use-recipe";
import { mockPromptCompiler, applyOverride } from "@/lib/providers/prompt-compiler";
import { mockImageProvider } from "@/lib/providers/image-provider";
import { applySwatchChange, buildSeeds, generateBracket, type BracketOption } from "@/lib/workspace/refine";
import { placeholderTileDataUri } from "@/lib/providers/svg-tile";
import { ASSET_TYPE_TEMPLATES } from "@/lib/templates/asset-types";
import { brandConfig } from "@/lib/config/brand";
import type { AdFormat, AssetType, Layout, LockableKey, Reference, SegmentKey, WorkspaceStep } from "@/lib/schema/recipe";
import type { SwatchCategory } from "@/lib/templates/swatches";

function WorkspaceSkeleton() {
  return (
    <div className="flex h-screen flex-col">
      <Skeleton width="100%" height="56px" isShimmering />
      <div className="flex-1 p-8">
        <Skeleton width="100%" height="100%" borderRadius="var(--ds-radius-medium)" isShimmering />
      </div>
    </div>
  );
}

function NewWorkspaceInner() {
  const searchParams = useSearchParams();
  const existingId = searchParams.get("id") ?? undefined;
  const { recipe, loading, update } = useRecipeDraft(existingId);
  const [expertMode, setExpertMode] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [bracketOptions, setBracketOptions] = useState<BracketOption[]>([]);
  const [bracketLoading, setBracketLoading] = useState(false);

  const chosen = recipe?.outputs.find((o) => o.status === "chosen") ?? null;
  const bracketAttribute: SwatchCategory = recipe?.generation.bracketAttribute ?? "lighting";

  useEffect(() => {
    if (!recipe || recipe.current_step !== "refine" || !chosen || !recipe.format) return;
    let cancelled = false;
    const format = recipe.format;
    const swatches = recipe.swatches;
    async function run() {
      setBracketLoading(true);
      const options = await generateBracket({ seed: chosen!.seed, category: bracketAttribute, swatches, format });
      if (cancelled) return;
      setBracketOptions(options);
      setBracketLoading(false);
    }
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe?.current_step, bracketAttribute, chosen?.seed, recipe?.format?.id]);

  if (loading || !recipe) return <WorkspaceSkeleton />;

  function selectAssetType(type: AssetType) {
    update((prev) => ({ ...prev, asset_type: type }));
  }
  function selectFormat(format: AdFormat) {
    update((prev) => ({ ...prev, format }));
  }
  function layoutChange(layout: Layout) {
    update((prev) => ({ ...prev, layout }));
  }
  function freeTextChange(value: string) {
    update((prev) => ({ ...prev, free_text: value }));
  }

  function addReference(ref: Reference) {
    update((prev) => ({ ...prev, references: [...prev.references, ref].slice(0, 5) }));
  }
  function editReferenceDescription(id: string, description: string) {
    update((prev) => ({
      ...prev,
      references: prev.references.map((r) => (r.id === id ? { ...r, description, edited: description !== r.autoDescription } : r)),
    }));
  }
  function removeReference(id: string) {
    update((prev) => ({ ...prev, references: prev.references.filter((r) => r.id !== id) }));
  }

  function selectSwatch(category: SwatchCategory, value: string) {
    update((prev) => ({ ...prev, swatches: applySwatchChange(prev.swatches, prev.generation.locked, category, value) }));
  }
  function toggleSwatchLock(category: LockableKey) {
    update((prev) => {
      const isLocked = prev.generation.locked.includes(category);
      const locked = isLocked ? prev.generation.locked.filter((k) => k !== category) : [...prev.generation.locked, category];
      return { ...prev, generation: { ...prev.generation, locked } };
    });
  }

  function editSegment(key: SegmentKey, value: string) {
    update((prev) => (prev.prompt ? { ...prev, prompt: applyOverride(prev.prompt, key, value) } : prev));
  }

  async function handleGenerate() {
    if (!recipe || !recipe.asset_type || !recipe.format) return;
    setGenerating(true);
    const assetType = recipe.asset_type;
    const format = recipe.format;
    const compiled = mockPromptCompiler.compile({
      assetType,
      swatches: recipe.swatches,
      references: recipe.references,
      freeText: recipe.free_text,
      previousPrompt: recipe.prompt,
    });
    const seeds = buildSeeds(recipe.generation.variations, recipe.generation.lockedSeed);
    const tiles = await mockImageProvider.generate(seeds.map((seed) => ({ seed, format, swatches: recipe.swatches })));
    const now = new Date().toISOString();
    update((prev) => ({
      ...prev,
      template_version: ASSET_TYPE_TEMPLATES[assetType].templateVersion,
      brand_constraints_version: brandConfig.version,
      prompt: compiled,
      generation: { ...prev.generation, seeds },
      outputs: tiles.map((t) => ({ seed: t.seed, dataUri: t.dataUri, status: "candidate" as const, favourited: false, createdAt: now })),
      current_step: "pick",
    }));
    setGenerating(false);
  }

  function toggleFavourite(seed: number) {
    update((prev) => ({ ...prev, outputs: prev.outputs.map((o) => (o.seed === seed ? { ...o, favourited: !o.favourited } : o)) }));
  }

  function useDirection(seed: number) {
    update((prev) => ({
      ...prev,
      outputs: prev.outputs.map((o) => ({
        ...o,
        status: o.seed === seed ? ("chosen" as const) : o.status === "chosen" ? ("candidate" as const) : o.status,
      })),
      generation: {
        ...prev.generation,
        lockedSeed: seed,
        locked: Array.from(new Set([...prev.generation.locked, "seed" as const])),
        bracketAttribute: prev.generation.bracketAttribute ?? "lighting",
      },
      current_step: "refine",
    }));
  }

  function attributeChange(category: SwatchCategory) {
    update((prev) => ({ ...prev, generation: { ...prev.generation, bracketAttribute: category } }));
  }

  function selectBracketOption(optionId: string) {
    if (!recipe || !recipe.format || !chosen) return;
    const format = recipe.format;
    const assetType = recipe.asset_type;
    const nextSwatches = { ...recipe.swatches, [bracketAttribute]: optionId };
    const seed = chosen.seed;
    (async () => {
      const [tile] = await mockImageProvider.generate([{ seed, format, swatches: nextSwatches }]);
      const compiled = assetType
        ? mockPromptCompiler.compile({
            assetType,
            swatches: nextSwatches,
            references: recipe.references,
            freeText: recipe.free_text,
            previousPrompt: recipe.prompt,
          })
        : recipe.prompt;
      update((prev) => ({
        ...prev,
        swatches: nextSwatches,
        prompt: compiled,
        outputs: prev.outputs.map((o) => (o.seed === seed ? { ...o, dataUri: tile.dataUri } : o)),
      }));
    })();
  }

  function goToStep(step: WorkspaceStep) {
    update((prev) => ({ ...prev, current_step: step }));
  }

  if (recipe.current_step === "export") {
    return (
      <div className="flex h-screen flex-col">
        <TopBar
          step={recipe.current_step}
          onStepChange={goToStep}
          format={recipe.format}
          onFormatChange={selectFormat}
          expertMode={expertMode}
          onToggleExpert={setExpertMode}
          onGenerate={handleGenerate}
          generating={generating}
          canGenerate={Boolean(recipe.asset_type && recipe.format)}
        />
        <ExportScreen recipe={recipe} update={update} onBack={() => goToStep("refine")} />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <TopBar
        step={recipe.current_step}
        onStepChange={goToStep}
        format={recipe.format}
        onFormatChange={selectFormat}
        expertMode={expertMode}
        onToggleExpert={setExpertMode}
        onGenerate={handleGenerate}
        generating={generating}
        canGenerate={Boolean(recipe.asset_type && recipe.format)}
      />
      <div className="grid min-h-0 flex-1" style={{ gridTemplateColumns: "280px minmax(0,1fr) 280px" }}>
        <aside className="overflow-auto border-r bg-panel">
          {recipe.current_step === "frame" && (
            <FramePanel
              assetType={recipe.asset_type}
              onSelectAssetType={selectAssetType}
              layout={recipe.layout}
              onLayoutChange={layoutChange}
              onNext={() => goToStep("shot_list")}
            />
          )}
          {recipe.current_step === "shot_list" && (
            <ShotListPanel
              references={recipe.references}
              onAddReference={addReference}
              onEditReferenceDescription={editReferenceDescription}
              onRemoveReference={removeReference}
              swatches={recipe.swatches}
              locked={recipe.generation.locked}
              onSelectSwatch={selectSwatch}
              onToggleLock={toggleSwatchLock}
              freeText={recipe.free_text}
              onFreeTextChange={freeTextChange}
            />
          )}
          {recipe.current_step === "pick" && <PickSidebar swatches={recipe.swatches} onEditShotList={() => goToStep("shot_list")} />}
          {recipe.current_step === "refine" && <RefineSidebar />}
        </aside>

        <section className="flex min-w-0 flex-col overflow-auto">
          {recipe.current_step === "frame" &&
            (recipe.format ? (
              <>
                <StageHeader title="Frame" subtitle={`${recipe.format.name} · protected copy area shown`} />
                <AdCanvas
                  format={recipe.format}
                  dataUri={placeholderTileDataUri(recipe.format.width, recipe.format.height, recipe.format.copySafeZone, recipe.layout)}
                />
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                Choose a format above to preview the frame.
              </div>
            ))}

          {recipe.current_step === "shot_list" && recipe.format && (
            <>
              <StageHeader title="Shot list" subtitle="Previewing the protected copy area" />
              <AdCanvas
                format={recipe.format}
                dataUri={placeholderTileDataUri(recipe.format.width, recipe.format.height, recipe.format.copySafeZone, recipe.layout)}
              />
              {expertMode && (
                <div className="p-4">
                  <PromptPanel prompt={recipe.prompt} expertMode={expertMode} onEditSegment={editSegment} />
                </div>
              )}
            </>
          )}

          {recipe.current_step === "pick" && recipe.format && (
            <PickStage
              outputs={recipe.outputs}
              generating={generating}
              placeholderCount={recipe.generation.variations}
              format={recipe.format}
              swatches={recipe.swatches}
              layout={recipe.layout}
              onToggleFavourite={toggleFavourite}
              onUse={useDirection}
            />
          )}

          {recipe.current_step === "refine" && recipe.format && chosen && (
            <RefineStage
              chosen={chosen}
              format={recipe.format}
              swatches={recipe.swatches}
              layout={recipe.layout}
              attribute={bracketAttribute}
              onAttributeChange={attributeChange}
              bracketOptions={bracketOptions}
              bracketLoading={bracketLoading}
              onSelectOption={selectBracketOption}
              onExport={() => goToStep("export")}
            />
          )}
        </section>

        <aside className="overflow-auto border-l bg-panel">
          {recipe.current_step === "frame" || recipe.current_step === "shot_list" || recipe.current_step === "pick" ? (
            <BrandRulesPanel />
          ) : (
            <RecipePanel recipe={recipe} />
          )}
        </aside>
      </div>
    </div>
  );
}

export default function NewWorkspacePage() {
  return (
    <Suspense fallback={<WorkspaceSkeleton />}>
      <NewWorkspaceInner />
    </Suspense>
  );
}
