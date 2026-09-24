"use client";

import LinkButton from "@atlaskit/button/link";
import IconButton from "@atlaskit/button/icon/button";
import Lozenge from "@atlaskit/lozenge";
import Skeleton from "@atlaskit/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRecipeList } from "@/lib/store/use-recipe";
import { deleteRecipe } from "@/lib/store/recipe-store";
import { ASSET_TYPE_TEMPLATES } from "@/lib/templates/asset-types";
import { compositeTileDataUri } from "@/lib/providers/svg-tile";
import { toAtlaskitIcon } from "@/lib/atlaskit-icon";
import { Trash2 } from "lucide-react";

const TrashIcon = toAtlaskitIcon(Trash2);

export default function RecipesPage() {
  const { recipes, loading, refresh } = useRecipeList();

  async function handleDelete(id: string) {
    await deleteRecipe(id);
    await refresh();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Saved recipes</h1>
        <LinkButton href="/workspace/new" appearance="primary" spacing="compact">
          New recipe
        </LinkButton>
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton width="100%" height="80px" borderRadius="var(--ds-radius-medium)" isShimmering />
          <Skeleton width="100%" height="80px" borderRadius="var(--ds-radius-medium)" isShimmering />
        </div>
      ) : recipes.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No recipes yet. Every recipe you start is saved automatically in this browser.
        </p>
      ) : (
        <div className="space-y-2">
          {recipes.map((recipe) => {
            const template = recipe.asset_type ? ASSET_TYPE_TEMPLATES[recipe.asset_type] : null;
            const favourites = recipe.outputs.filter((o) => o.favourited).length;
            const chosen = recipe.outputs.find((o) => o.status === "chosen") ?? recipe.outputs[0];
            const thumb = recipe.format && chosen ? compositeTileDataUri(chosen.seed, recipe.format, recipe.swatches, recipe.layout) : null;
            return (
              <Card key={recipe.recipe_id}>
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-3">
                    {thumb && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt="" className="size-12 shrink-0 rounded-md border object-cover" />
                    )}
                    <div>
                      <CardTitle className="text-sm">{template?.label ?? "Untitled draft"}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {recipe.format?.name ?? "No format yet"} · updated {new Date(recipe.updated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {recipe.outputs.length > 0 ? <Lozenge>{recipe.outputs.length} outputs</Lozenge> : null}
                    {favourites > 0 ? (
                      <Lozenge appearance="success">
                        {favourites} favourite{favourites > 1 ? "s" : ""}
                      </Lozenge>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                  <LinkButton href={`/recipes/${recipe.recipe_id}`} spacing="compact">
                    View
                  </LinkButton>
                  <LinkButton href={`/workspace/new?id=${recipe.recipe_id}`} appearance="primary" spacing="compact">
                    Continue in workspace
                  </LinkButton>
                  <div className="ml-auto">
                    <IconButton
                      icon={TrashIcon}
                      appearance="subtle"
                      spacing="compact"
                      onClick={() => handleDelete(recipe.recipe_id)}
                      label="Delete recipe"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
