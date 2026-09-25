"use client";

import Button from "@atlaskit/button/default/button";
import IconButton from "@atlaskit/button/icon/button";
import Lozenge from "@atlaskit/lozenge";
import Skeleton from "@atlaskit/skeleton";
import { cn } from "cn";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { toAtlaskitIcon } from "@/lib/atlaskit-icon";
import { StageHeader } from "@/components/workspace/ad-canvas";
import { compositeTileDataUri } from "@/lib/providers/svg-tile";
import { getSwatchOption, type SwatchCategory } from "@/lib/templates/swatches";
import type { AdFormat, Layout, RecipeOutput, SwatchSelection } from "@/lib/schema/recipe";
import type { ReactNode } from "react";

const ArrowRightIcon = toAtlaskitIcon(ArrowRight);

function FavouriteIcon({ filled }: { filled: boolean }) {
  return function Icon() {
    return <Heart size={16} fill={filled ? "currentColor" : "none"} aria-hidden focusable={false} />;
  };
}

export function PickStage({
  outputs,
  generating,
  placeholderCount,
  format,
  swatches,
  layout,
  onToggleFavourite,
  onUse,
  promptPanel,
}: {
  outputs: RecipeOutput[];
  generating: boolean;
  placeholderCount: number;
  format: AdFormat;
  swatches: SwatchSelection;
  layout: Layout;
  onToggleFavourite: (seed: number) => void;
  onUse: (seed: number) => void;
  /** Rendered inside this stage's own scroll region so it stacks naturally
   * instead of competing with `flex-1` for space as an external sibling. */
  promptPanel?: ReactNode;
}) {
  const aspectRatio = format.width / format.height;

  return (
    <div className="flex-1 space-y-5 overflow-auto pb-8">
      <StageHeader title="Pick the closest direction" subtitle="Results vary each time. Pick the closest, then refine one thing at a time." />
      <div className="px-7">
        {generating && (
          <div className="mb-3 flex items-center gap-2.5 rounded-md border border-primary/25 bg-accent px-3 py-2.5 text-xs">
            <Sparkles className="size-4 text-primary" />
            <span className="text-muted-foreground">
              <strong className="text-foreground">Generating {placeholderCount} options</strong> — a moment…
            </span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {generating
            ? Array.from({ length: placeholderCount }).map((_, i) => (
                <div key={i} style={{ aspectRatio }} className="w-full overflow-hidden rounded-xl">
                  <Skeleton width="100%" height="100%" borderRadius="var(--ds-radius-large)" isShimmering />
                </div>
              ))
            : outputs.map((output) => {
                const dataUri = compositeTileDataUri(output.seed, format, swatches, layout);
                return (
                  <div
                    key={output.seed}
                    className={cn(
                      "group overflow-hidden rounded-xl border bg-panel shadow-sm transition-shadow hover:shadow-md",
                      output.favourited && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    )}
                  >
                    <div className="relative" style={{ aspectRatio }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={dataUri}
                        alt={`Option, seed ${output.seed}`}
                        className="size-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                      />
                      <div className="absolute top-2 right-2">
                        <IconButton
                          icon={FavouriteIcon({ filled: output.favourited })}
                          isSelected={output.favourited}
                          appearance={output.favourited ? "primary" : "default"}
                          shape="circle"
                          spacing="compact"
                          onClick={() => onToggleFavourite(output.seed)}
                          label="Favourite"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t px-2.5 py-1.5">
                      <span className="font-mono text-[10px] tracking-wide text-muted-foreground">
                        #{String(output.seed).padStart(5, "0")}
                      </span>
                      <Button spacing="compact" iconAfter={ArrowRightIcon} onClick={() => onUse(output.seed)}>
                        Use this
                      </Button>
                    </div>
                  </div>
                );
              })}
        </div>
        {!generating && outputs.length === 0 && (
          <p className="rounded-md border border-dashed p-8 text-center text-xs text-muted-foreground">
            Nothing generated yet — go back to the shot list and hit Generate.
          </p>
        )}
        {promptPanel && <div className="mt-5">{promptPanel}</div>}
      </div>
    </div>
  );
}

export function PickSidebar({ swatches, onEditShotList }: { swatches: SwatchSelection; onEditShotList: () => void }) {
  return (
    <div className="space-y-4 p-5 text-sm">
      <div>
        <p className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">Step 3 of 4</p>
        <h2 className="mt-1 text-lg font-semibold">Pick a direction</h2>
        <p className="mt-1 text-xs text-muted-foreground">Options made from your locked shot list.</p>
      </div>
      <div className="divide-y border-t">
        {(Object.entries(swatches) as [SwatchCategory, string | null][]).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between py-2 text-xs">
            <span className="capitalize text-muted-foreground">{key}</span>
            <Lozenge>{getSwatchOption(key, value)?.label ?? "—"}</Lozenge>
          </div>
        ))}
      </div>
      <Button shouldFitContainer onClick={onEditShotList}>
        Edit shot list
      </Button>
    </div>
  );
}
