"use client";

import Button from "@atlaskit/button/default/button";
import Tabs, { TabList, Tab, TabPanel } from "@atlaskit/tabs";
import { compositeTileDataUri } from "@/lib/providers/svg-tile";
import { SWATCH_CATEGORIES, type SwatchCategory } from "@/lib/templates/swatches";
import { cn } from "cn";
import { ArrowRight, Lock } from "lucide-react";
import { toAtlaskitIcon } from "@/lib/atlaskit-icon";
import { Pill, SelectedBadge } from "@/components/workspace/marks";
import type { AdFormat, Layout, RecipeOutput, SwatchSelection } from "@/lib/schema/recipe";
import type { BracketOption } from "@/lib/workspace/refine";
import type { ReactNode } from "react";

const ArrowRightIcon = toAtlaskitIcon(ArrowRight);

const ATTRIBUTE_LABELS: Record<SwatchCategory, string> = {
  lighting: "Light",
  palette: "Palette",
  mood: "Mood",
  composition: "Composition",
};

export function RefineStage({
  chosen,
  format,
  swatches,
  layout,
  attribute,
  onAttributeChange,
  bracketOptions,
  bracketLoading,
  onSelectOption,
  onExport,
  promptPanel,
}: {
  chosen: RecipeOutput;
  format: AdFormat;
  swatches: SwatchSelection;
  layout: Layout;
  attribute: SwatchCategory;
  onAttributeChange: (category: SwatchCategory) => void;
  bracketOptions: BracketOption[];
  bracketLoading: boolean;
  onSelectOption: (optionId: string) => void;
  onExport: () => void;
  /** Rendered inside this stage's own scroll region so it stacks naturally
   * instead of competing with `flex-1` for space as an external sibling. */
  promptPanel?: ReactNode;
}) {
  const heroUri = compositeTileDataUri(chosen.seed, format, swatches, layout);
  const aspectRatio = format.width / format.height;
  const currentValue = swatches[attribute];

  return (
    <div className="flex-1 space-y-4 overflow-auto pb-8">
      <div className="flex items-start justify-between px-7 pt-5">
        <div>
          <h1 className="text-lg font-semibold">Bracket the {ATTRIBUTE_LABELS[attribute].toLowerCase()}</h1>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Pill icon={<Lock className="size-2.5" />}>Locked</Pill> composition and everything else
          </p>
        </div>
        <Button appearance="primary" iconAfter={ArrowRightIcon} onClick={onExport}>
          Continue to export
        </Button>
      </div>

      <div className="px-7">
        <div className="relative mx-auto overflow-hidden rounded-2xl border bg-card shadow-sm ring-2 ring-primary ring-offset-2 ring-offset-background" style={{ aspectRatio, maxWidth: 560 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroUri} alt="Chosen direction" className="size-full object-cover" />
          <SelectedBadge className="absolute top-3 right-3" />
        </div>
      </div>

      <div className="px-7">
        <Tabs
          id="refine-attribute-tabs"
          selected={SWATCH_CATEGORIES.indexOf(attribute)}
          onChange={(index) => onAttributeChange(SWATCH_CATEGORIES[index])}
        >
          <TabList>
            {SWATCH_CATEGORIES.map((cat) => (
              <Tab key={cat}>{ATTRIBUTE_LABELS[cat]}</Tab>
            ))}
          </TabList>
          {SWATCH_CATEGORIES.map((cat) => (
            <TabPanel key={cat}>
              <p className="my-3 text-xs text-muted-foreground">
                Choose the {ATTRIBUTE_LABELS[attribute].toLowerCase()} that feels right. Only this attribute changes.
              </p>
              <div className="grid grid-cols-5 gap-2.5">
                {bracketLoading
                  ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-lg bg-secondary" />)
                  : bracketOptions.map((option) => {
                      const selected = option.optionId === currentValue;
                      return (
                        <button
                          key={option.optionId}
                          type="button"
                          onClick={() => onSelectOption(option.optionId)}
                          aria-pressed={selected}
                          className={cn(
                            "relative overflow-hidden rounded-lg border text-left transition-shadow",
                            selected ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : "hover:shadow-sm"
                          )}
                        >
                          <span className="relative block h-20 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={option.dataUri} alt={option.label} className="size-full object-cover" />
                            {selected && <SelectedBadge className="absolute top-1.5 right-1.5 size-4" />}
                          </span>
                          <strong className="flex h-7 items-center border-t px-2 text-[10px] font-medium">{option.label}</strong>
                        </button>
                      );
                    })}
              </div>
            </TabPanel>
          ))}
        </Tabs>
      </div>

      {promptPanel && <div className="px-7">{promptPanel}</div>}
    </div>
  );
}

export function RefineSidebar() {
  return (
    <div className="space-y-4 p-5 text-sm">
      <div>
        <p className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">Step 4 of 4</p>
        <h2 className="mt-1 text-lg font-semibold">Refine one thing</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Bracket one attribute while composition and all other choices remain locked.
        </p>
      </div>
      <div className="flex items-start gap-2.5 rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
        <Lock className="mt-0.5 size-3.5 shrink-0 text-primary" />
        <div>
          <strong className="block text-foreground">Everything else stays put</strong>
          <span>This makes changes predictable and easy to compare.</span>
        </div>
      </div>
    </div>
  );
}
