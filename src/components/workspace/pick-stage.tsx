"use client";

import Button from "@atlaskit/button/default/button";
import IconButton from "@atlaskit/button/icon/button";
import Lozenge from "@atlaskit/lozenge";
import Skeleton from "@atlaskit/skeleton";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { toAtlaskitIcon } from "@/lib/atlaskit-icon";
import { StageHeader } from "@/components/workspace/ad-canvas";
import { compositeTileDataUri } from "@/lib/providers/svg-tile";
import type { AdFormat, Layout, RecipeOutput, SwatchSelection } from "@/lib/schema/recipe";

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
}: {
  outputs: RecipeOutput[];
  generating: boolean;
  placeholderCount: number;
  format: AdFormat;
  swatches: SwatchSelection;
  layout: Layout;
  onToggleFavourite: (seed: number) => void;
  onUse: (seed: number) => void;
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {generating
            ? Array.from({ length: placeholderCount }).map((_, i) => (
                <div key={i} style={{ aspectRatio }} className="w-full overflow-hidden rounded-md">
                  <Skeleton width="100%" height="100%" borderRadius="var(--ds-radius-medium)" isShimmering />
                </div>
              ))
            : outputs.map((output) => {
                const dataUri = compositeTileDataUri(output.seed, format, swatches, layout);
                return (
                  <div key={output.seed} className="overflow-hidden rounded-md border bg-panel">
                    <div className="relative" style={{ aspectRatio }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={dataUri} alt={`Option, seed ${output.seed}`} className="size-full object-cover" />
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
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <span className="font-mono text-[10px] text-muted-foreground">Seed #{output.seed}</span>
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
        {Object.entries(swatches).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between py-2 text-xs">
            <span className="capitalize text-muted-foreground">{key}</span>
            <Lozenge>{value ?? "—"}</Lozenge>
          </div>
        ))}
      </div>
      <Button shouldFitContainer onClick={onEditShotList}>
        Edit shot list
      </Button>
    </div>
  );
}
