"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import LinkButton from "@atlaskit/button/link";
import Lozenge from "@atlaskit/lozenge";
import Skeleton from "@atlaskit/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecipeExportPanel } from "@/components/workspace/recipe-export-panel";
import { getRecipe } from "@/lib/store/recipe-store";
import { compositeTileDataUri } from "@/lib/providers/svg-tile";
import type { Recipe } from "@/lib/schema/recipe";
import { ASSET_TYPE_TEMPLATES } from "@/lib/templates/asset-types";
import { getSwatchOption } from "@/lib/templates/swatches";
import { SEGMENT_KEYS } from "@/lib/schema/recipe";
import { ArrowLeft } from "lucide-react";

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [recipe, setRecipe] = useState<Recipe | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    getRecipe(id).then((r) => {
      if (!cancelled) setRecipe(r ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (recipe === undefined) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <Skeleton width="192px" height="32px" isShimmering />
        <Skeleton width="100%" height="256px" borderRadius="var(--ds-radius-medium)" isShimmering />
      </div>
    );
  }

  if (recipe === null) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <Link href="/recipes" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" /> Saved recipes
        </Link>
        <p className="text-sm text-muted-foreground">Recipe not found in this browser.</p>
      </div>
    );
  }

  const template = recipe.asset_type ? ASSET_TYPE_TEMPLATES[recipe.asset_type] : null;
  const swatchLabels = {
    lighting: getSwatchOption("lighting", recipe.swatches.lighting)?.label,
    palette: getSwatchOption("palette", recipe.swatches.palette)?.label,
    mood: getSwatchOption("mood", recipe.swatches.mood)?.label,
    composition: getSwatchOption("composition", recipe.swatches.composition)?.label,
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/recipes" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-3.5" /> Saved recipes
          </Link>
          <h1 className="mt-1 text-xl font-semibold">{template?.label ?? "Untitled draft"}</h1>
          <p className="text-xs text-muted-foreground">{recipe.recipe_id}</p>
        </div>
        <LinkButton href={`/workspace/new?id=${recipe.recipe_id}`} appearance="primary" spacing="compact">
          Continue in workspace
        </LinkButton>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          <p>
            <span className="text-muted-foreground">Format: </span>
            {recipe.format?.name ?? "—"}
          </p>
          <p>
            <span className="text-muted-foreground">Template: </span>
            {recipe.template_version ?? "not compiled yet"}
          </p>
          <p>
            <span className="text-muted-foreground">Brand rules: </span>
            {recipe.brand_constraints_version || "—"}
          </p>
          <p>
            <span className="text-muted-foreground">Created: </span>
            {new Date(recipe.created_at).toLocaleString()}
          </p>
          <div className="flex flex-wrap gap-1.5 sm:col-span-2">
            {Object.entries(swatchLabels)
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <Lozenge key={k}>
                  {k}: {v}
                </Lozenge>
              ))}
          </div>
        </CardContent>
      </Card>

      {recipe.references.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">References</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {recipe.references.map((r) => (
              <div key={r.id} className="w-40 space-y-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.dataUrl} alt={r.fileName} className="h-24 w-full rounded-md object-cover" />
                <p className="text-[11px] text-muted-foreground">{r.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {recipe.prompt ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Compiled prompt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm leading-relaxed">{SEGMENT_KEYS.map((k) => recipe.prompt!.segments[k]).join(". ")}</p>
            <p className="text-xs text-muted-foreground">Excludes: {recipe.prompt.negative}</p>
          </CardContent>
        </Card>
      ) : null}

      {recipe.outputs.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Outputs</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-2">
            {recipe.outputs.map((o) => (
              <div key={o.seed} className="relative overflow-hidden rounded-md border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={recipe.format ? compositeTileDataUri(o.seed, recipe.format, recipe.swatches, recipe.layout) : o.dataUri}
                  alt={`seed ${o.seed}`}
                  className="w-full object-cover"
                />
                <div className="absolute top-1 right-1 flex gap-1">
                  {o.status === "chosen" && <Lozenge appearance="success">used</Lozenge>}
                  {o.favourited && <Lozenge>♥</Lozenge>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <RecipeExportPanel recipe={recipe} />
    </div>
  );
}
