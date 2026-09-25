"use client";

import Button from "@atlaskit/button/default/button";
import Tabs, { TabList, Tab, TabPanel } from "@atlaskit/tabs";
import { compositeTileDataUri } from "@/lib/providers/svg-tile";
import { SWATCH_CATEGORIES, type SwatchCategory } from "@/lib/templates/swatches";
import { cn } from "cn";
import { ArrowRight } from "lucide-react";
import { toAtlaskitIcon } from "@/lib/atlaskit-icon";
import { EdgeTag, GreaseCircle } from "@/components/workspace/marks";
import type { AdFormat, Layout, RecipeOutput, SwatchSelection } from "@/lib/schema/recipe";
import type { BracketOption } from "@/lib/workspace/refine";

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
            <EdgeTag>LOCKED</EdgeTag> composition and everything else
          </p>
        </div>
        <Button appearance="primary" iconAfter={ArrowRightIcon} onClick={onExport}>
          Continue to export
        </Button>
      </div>

      <div className="px-7">
        <div className="relative mx-auto overflow-visible" style={{ maxWidth: 560 }}>
          <div className="relative overflow-hidden border border-frame bg-card" style={{ aspectRatio }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroUri} alt="Chosen direction" className="size-full object-cover" />
          </div>
          <GreaseCircle />
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
                  ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-24 animate-pulse bg-secondary" />)
                  : bracketOptions.map((option) => {
                      const selected = option.optionId === currentValue;
                      return (
                        <button
                          key={option.optionId}
                          type="button"
                          onClick={() => onSelectOption(option.optionId)}
                          aria-pressed={selected}
                          className={cn(
                            "relative overflow-visible border text-left",
                            selected ? "border-primary" : "border-frame/60 hover:border-frame"
                          )}
                        >
                          <span className="relative block h-20 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={option.dataUri} alt={option.label} className="size-full object-cover" />
                          </span>
                          {selected && <GreaseCircle className="inset-[-10%] size-[120%]" />}
                          <strong className="flex h-7 items-center border-t border-frame/40 px-2 text-[10px] font-medium">
                            {option.label}
                          </strong>
                        </button>
                      );
                    })}
              </div>
            </TabPanel>
          ))}
        </Tabs>
      </div>
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
      <div className="flex items-start gap-2.5 border bg-secondary p-3 text-xs text-muted-foreground">
        <EdgeTag className="mt-0.5">LOCKED</EdgeTag>
        <div>
          <strong className="block text-foreground">Everything else stays put</strong>
          <span>This makes changes predictable and easy to compare.</span>
        </div>
      </div>
    </div>
  );
}
