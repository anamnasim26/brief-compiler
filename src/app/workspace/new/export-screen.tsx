"use client";

import { useRouter } from "next/navigation";
import Button from "@atlaskit/button/default/button";
import { RecipeExportPanel } from "@/components/workspace/recipe-export-panel";
import { compositeTileDataUri } from "@/lib/providers/svg-tile";
import { saveRecipe } from "@/lib/store/recipe-store";
import { createEmptyRecipe, type Checklist, type Recipe } from "@/lib/schema/recipe";
import { toAtlaskitIcon } from "@/lib/atlaskit-icon";
import { ArrowLeft, Check, Download, RefreshCw } from "lucide-react";

const DownloadIcon = toAtlaskitIcon(Download);
const RefreshCwIcon = toAtlaskitIcon(RefreshCw);

const CHECKLIST_ITEMS: { key: keyof Checklist; label: string }[] = [
  { key: "productAccurate", label: "Product looks accurate" },
  { key: "copySafe", label: "Nothing covers the copy area" },
  { key: "noUnexpectedText", label: "No unexpected text in image" },
];

async function downloadPng(dataUri: string, width: number, height: number, filename: string) {
  const img = new Image();
  img.src = dataUri;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Could not rasterize the artwork"));
  });
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(img, 0, 0, width, height);
  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportScreen({
  recipe,
  update,
  onBack,
}: {
  recipe: Recipe;
  update: (updater: (prev: Recipe) => Recipe) => void;
  onBack: () => void;
}) {
  const router = useRouter();
  const chosen = recipe.outputs.find((o) => o.status === "chosen") ?? recipe.outputs[0];
  if (!recipe.format || !chosen) {
    return <p className="p-8 text-sm text-muted-foreground">Nothing to export yet — go back and pick a direction.</p>;
  }
  const format = recipe.format;
  const artworkUri = compositeTileDataUri(chosen.seed, format, recipe.swatches, recipe.layout);
  const allChecked = recipe.checklist.productAccurate && recipe.checklist.copySafe && recipe.checklist.noUnexpectedText;

  function toggleCheck(key: keyof Checklist) {
    update((prev) => ({ ...prev, checklist: { ...prev.checklist, [key]: !prev.checklist[key] } }));
  }

  async function handleAdapt() {
    const next = createEmptyRecipe();
    next.parent_id = recipe.recipe_id;
    next.asset_type = recipe.asset_type;
    next.format = recipe.format;
    next.swatches = recipe.swatches;
    next.layout = recipe.layout;
    next.brand_constraints_version = recipe.brand_constraints_version;
    next.current_step = "frame";
    await saveRecipe(next);
    router.push(`/workspace/new?id=${next.recipe_id}`);
  }

  const summary: [string, string][] = [
    ["Format", format.name],
    ["Lighting", recipe.swatches.lighting ?? "—"],
    ["Palette", recipe.swatches.palette ?? "—"],
    ["Mood", recipe.swatches.mood ?? "—"],
    ["Composition", recipe.swatches.composition ?? "—"],
    ["Brand rules", recipe.brand_constraints_version],
    ["Model", `${recipe.model.provider} · ${recipe.model.id}`],
    ["Seed", String(chosen.seed)],
    ["Created", new Date(recipe.created_at).toLocaleDateString()],
  ];

  return (
    <div className="flex-1 overflow-auto bg-canvas p-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <button onClick={onBack} className="mb-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <ArrowLeft className="size-3.5" /> Back to refine
            </button>
            <h1 className="text-lg font-semibold">Ready to hand off</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">Your final artwork and the recipe that made it.</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Button
              appearance="primary"
              iconBefore={DownloadIcon}
              isDisabled={!allChecked}
              onClick={() => downloadPng(artworkUri, format.width, format.height, `${recipe.recipe_id}.png`)}
            >
              Export PNG
            </Button>
            {!allChecked && <span className="text-[11px] text-muted-foreground">Check all three boxes below to export</span>}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-4 rounded-2xl border bg-panel p-4 shadow-sm">
            <div className="flex items-center justify-between text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
              <span>Final artwork</span>
              <span>
                {format.width} × {format.height} · PNG
              </span>
            </div>
            <div
              className="mx-auto overflow-hidden rounded-xl border bg-card"
              style={{ aspectRatio: format.width / format.height, maxWidth: 560 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={artworkUri} alt="Final artwork" className="size-full object-cover" />
            </div>
            <div className="flex flex-wrap items-center gap-4 border-t pt-4">
              <h3 className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">Final check</h3>
              {CHECKLIST_ITEMS.map((item) => (
                <button key={item.key} type="button" onClick={() => toggleCheck(item.key)} className="flex items-center gap-1.5 text-[11px]">
                  <span
                    className={`grid size-4 place-items-center rounded-full border ${recipe.checklist[item.key] ? "border-success bg-success text-white" : ""}`}
                  >
                    {recipe.checklist[item.key] && <Check className="size-2.5" />}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <aside className="space-y-4 rounded-2xl border bg-panel p-4 shadow-sm">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">Recipe</span>
                <h2 className="text-sm font-semibold">{recipe.template_version ?? "Untitled"}</h2>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">{recipe.recipe_id.slice(0, 12)}</span>
            </div>
            <div className="divide-y">
              {summary.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 py-1.5 text-xs">
                  <span className="text-muted-foreground">{k}</span>
                  <strong className="text-right font-medium">{v}</strong>
                </div>
              ))}
            </div>
            <Button shouldFitContainer iconBefore={RefreshCwIcon} onClick={handleAdapt}>
              Start next banner from this recipe
            </Button>
            <RecipeExportPanel recipe={recipe} />
          </aside>
        </div>
      </div>
    </div>
  );
}
