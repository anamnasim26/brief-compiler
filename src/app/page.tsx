"use client";

import Link from "next/link";
import { cn } from "cn";
import {
  ArrowRight,
  Briefcase,
  Clock3,
  FileImage,
  Image as ImageIcon,
  Layers3,
  LayoutTemplate,
} from "lucide-react";
import { useRecipeList } from "@/lib/store/use-recipe";
import { compositeTileDataUri } from "@/lib/providers/svg-tile";
import { ASSET_TYPE_TEMPLATES } from "@/lib/templates/asset-types";

const STARTS = [
  { title: "A brief", desc: "Start with a campaign idea", icon: Briefcase, recommended: false },
  { title: "Some references", desc: "Build from visual inspiration", icon: ImageIcon, recommended: true },
  { title: "A layout", desc: "Protect an existing composition", icon: LayoutTemplate, recommended: false },
  { title: "An existing banner", desc: "Create a related variation", icon: Layers3, recommended: false },
  { title: "An image that isn't working", desc: "Diagnose and rebuild it", icon: FileImage, recommended: false },
];

export default function Home() {
  const { recipes, loading } = useRecipeList();
  const recent = recipes.filter((r) => r.outputs.length > 0).slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="mb-2 text-[11px] font-bold tracking-wide text-primary uppercase">New image recipe</p>
      <h1 className="text-4xl font-semibold tracking-tight">What do you have?</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Choose the best starting point. We&apos;ll turn it into a controlled image brief.
      </p>

      <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {STARTS.map(({ title, desc, icon: Icon, recommended }) => (
          <Link
            key={title}
            href="/workspace/new"
            className={cn(
              "relative flex min-h-[168px] flex-col rounded-lg border bg-panel p-5 transition-colors",
              recommended ? "border-primary" : "border-border hover:border-primary/50"
            )}
          >
            <span className={cn("mb-7 grid size-10 place-items-center rounded-lg", recommended ? "bg-accent text-primary" : "bg-secondary")}>
              <Icon className="size-4" />
            </span>
            <strong className="text-sm">{title}</strong>
            <span className="mt-1.5 text-xs text-muted-foreground">{desc}</span>
            <ArrowRight className="absolute right-4 bottom-4 size-4 text-muted-foreground" />
            {recommended && (
              <span className="absolute top-3 right-3 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-primary">Recommended</span>
            )}
            {!recommended && (
              <span className="absolute top-3 left-3 rounded bg-secondary px-1.5 py-0.5 text-[9px] text-muted-foreground">not built here</span>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-14 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent recipes</h2>
        <Link href="/recipes" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          View all <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {!loading && recent.length === 0 && (
          <p className="col-span-full rounded-lg border border-dashed p-8 text-center text-xs text-muted-foreground">
            No recipes yet — start one above.
          </p>
        )}
        {recent.map((r) => {
          const chosen = r.outputs.find((o) => o.status === "chosen") ?? r.outputs[0];
          const thumb = r.format && chosen ? compositeTileDataUri(chosen.seed, r.format, r.swatches, r.layout) : null;
          return (
            <Link key={r.recipe_id} href={`/recipes/${r.recipe_id}`} className="overflow-hidden rounded-lg border bg-panel">
              <div className="h-24 bg-secondary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {thumb && <img src={thumb} alt="" className="size-full object-cover" />}
              </div>
              <div className="p-3">
                <strong className="block text-xs">{r.asset_type ? ASSET_TYPE_TEMPLATES[r.asset_type].label : "Untitled draft"}</strong>
                <span className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock3 className="size-3" /> {new Date(r.updated_at).toLocaleDateString()} {r.format ? `· ${r.format.name}` : ""}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
