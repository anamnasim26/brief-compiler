"use client";

import Button from "@atlaskit/button/default/button";
import Textfield from "@atlaskit/textfield";
import { cn } from "cn";
import { ArrowRight, CircleAlert } from "lucide-react";
import { toAtlaskitIcon } from "@/lib/atlaskit-icon";
import { FixedPill } from "@/components/workspace/marks";
import { ASSET_TYPE_LIST } from "@/lib/templates/asset-types";
import type { AssetType, Layout } from "@/lib/schema/recipe";

const ArrowRightIcon = toAtlaskitIcon(ArrowRight);

function LayoutRow({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 border-b px-2.5 py-2 text-xs last:border-b-0">
      <span className="size-1.5 shrink-0 rounded-sm bg-primary" aria-hidden />
      <span className="w-14 shrink-0 text-muted-foreground">{label}</span>
      <Textfield
        appearance="none"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.currentTarget.value)}
        aria-label={label}
      />
      <FixedPill />
    </div>
  );
}

export function FramePanel({
  assetType,
  onSelectAssetType,
  layout,
  onLayoutChange,
  onNext,
}: {
  assetType: AssetType | null;
  onSelectAssetType: (type: AssetType) => void;
  layout: Layout;
  onLayoutChange: (layout: Layout) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-5 p-5 text-sm">
      <div>
        <p className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">Step 1 of 4</p>
        <h2 className="mt-1 text-lg font-semibold">Set up the frame</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Place everything that must stay readable before you generate the photograph.
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-[10px] font-bold tracking-wide text-muted-foreground uppercase">Asset type</h3>
        <div className="grid grid-cols-2 gap-1.5">
          {ASSET_TYPE_LIST.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectAssetType(t.id)}
              aria-pressed={assetType === t.id}
              className={cn(
                "rounded-md border p-2 text-left text-xs transition-colors",
                assetType === t.id ? "border-primary bg-accent" : "border-border hover:bg-secondary"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-[10px] font-bold tracking-wide text-muted-foreground uppercase">Layout blocks</h3>
        <div className="overflow-hidden rounded-md border">
          <LayoutRow label="Logo" value={layout.brandName} placeholder="Brand name" onChange={(v) => onLayoutChange({ ...layout, brandName: v })} />
          <LayoutRow
            label="Headline"
            value={layout.headline}
            placeholder="e.g. Mornings, perfected."
            onChange={(v) => onLayoutChange({ ...layout, headline: v })}
          />
          <LayoutRow label="Price" value={layout.price} placeholder="e.g. $149" onChange={(v) => onLayoutChange({ ...layout, price: v })} />
        </div>
      </div>

      <div className="flex gap-2 rounded-md border bg-secondary p-3 text-xs text-muted-foreground">
        <CircleAlert className="size-4 shrink-0 text-primary" />
        The image will be generated around this protected area — never on top of it.
      </div>

      <Button shouldFitContainer onClick={onNext} isDisabled={!assetType} iconAfter={ArrowRightIcon}>
        Continue to shot list
      </Button>
    </div>
  );
}
