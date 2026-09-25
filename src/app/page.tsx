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
import { EdgeTag } from "@/components/workspace/marks";

const STARTS = [
  { title: "A brief", desc: "Start with a campaign idea", icon: Briefcase, built: false },
  { title: "Some references", desc: "Build from visual inspiration", icon: ImageIcon, built: true },
  { title: "A layout", desc: "Protect an existing composition", icon: LayoutTemplate, built: false },
  { title: "An existing banner", desc: "Create a related variation", icon: Layers3, built: false },
  { title: "An image that isn't working", desc: "Diagnose and rebuild it", icon: FileImage, built: false },
];

export default function Home() {
  const { recipes, loading } = useRecipeList();
  const recent = recipes.filter((r) => r.outputs.length > 0).slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <EdgeTag className="text-primary">NEW RECIPE</EdgeTag>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">What do you have?</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Choose the best starting point. We&apos;ll turn it into a controlled image brief.
      </p>

      <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {STARTS.map(({ title, desc, icon: Icon, built }) => {
          const inner = (
            <>
              <span className={cn("mb-7 grid size-10 place-items-center border border-frame/50", built ? "bg-accent text-primary" : "bg-secondary text-muted-foreground")}>
                <Icon className="size-4" />
              </span>
              <strong className="text-sm">{title}</strong>
              <span className="mt-1.5 text-xs text-muted-foreground">{desc}</span>
              {built && <ArrowRight className="absolute right-4 bottom-4 size-4 text-muted-foreground" />}
              <EdgeTag className={cn("absolute top-3 right-3", built ? "text-primary" : "")}>
                {built ? "RECOMMENDED" : "COMING SOON"}
              </EdgeTag>
            </>
          );
          const cardClass = cn(
            "relative flex min-h-[168px] flex-col border p-5 transition-colors",
            built ? "border-primary bg-panel" : "cursor-not-allowed border-dashed border-frame/40 bg-panel/60 opacity-70"
          );
          return built ? (
            <Link key={title} href="/workspace/new" className={cardClass}>
              {inner}
            </Link>
          ) : (
            <div key={title} className={cardClass} aria-disabled="true">
              {inner}
            </div>
          );
        })}
      </div>

      <div className="mt-14 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent recipes</h2>
        <Link href="/recipes" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          View all <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {!loading && recent.length === 0 && (
          <p className="col-span-full border border-dashed border-frame/40 p-8 text-center text-xs text-muted-foreground">
            No recipes yet — start one above.
          </p>
        )}
        {recent.map((r) => {
          const chosen = r.outputs.find((o) => o.status === "chosen") ?? r.outputs[0];
          const thumb = r.format && chosen ? compositeTileDataUri(chosen.seed, r.format, r.swatches, r.layout) : null;
          return (
            <Link key={r.recipe_id} href={`/recipes/${r.recipe_id}`} className="overflow-hidden border border-frame/60 bg-panel">
              <div className="h-24 bg-secondary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {thumb && <img src={thumb} alt="" className="size-full object-cover" />}
              </div>
              <div className="border-t border-frame/40 p-3">
                <strong className="block text-xs">{r.asset_type ? ASSET_TYPE_TEMPLATES[r.asset_type].label : "Untitled draft"}</strong>
                <span className="mt-1 flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
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
