import { LockKeyhole } from "lucide-react";
import { getSwatchOption } from "@/lib/templates/swatches";
import type { Recipe } from "@/lib/schema/recipe";

export function RecipePanel({ recipe }: { recipe: Recipe }) {
  const rows: [string, string][] = [
    ["Format", recipe.format?.name ?? "—"],
    ["Composition", getSwatchOption("composition", recipe.swatches.composition)?.label ?? "—"],
    ["Palette", getSwatchOption("palette", recipe.swatches.palette)?.label ?? "—"],
    ["Light", getSwatchOption("lighting", recipe.swatches.lighting)?.label ?? "—"],
    ["Mood", getSwatchOption("mood", recipe.swatches.mood)?.label ?? "—"],
    ["Seed", recipe.generation.lockedSeed !== null ? String(recipe.generation.lockedSeed) : "—"],
  ];

  return (
    <div className="space-y-4 p-5 text-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Recipe</h2>
        <span className="text-[10px] font-bold text-success">LIVE</span>
      </div>
      <p className="text-xs text-muted-foreground">Your exact choices, kept with the image.</p>
      <div className="divide-y border-t">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-2 py-2 text-xs">
            <span className="text-muted-foreground">{label}</span>
            <span className="flex items-center gap-1.5 font-medium">
              {value}
              <LockKeyhole className="size-3 text-muted-foreground" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
