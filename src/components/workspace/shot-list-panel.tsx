"use client";

import { useMemo, useState } from "react";
import TextArea from "@atlaskit/textarea";
import SectionMessage, { SectionMessageAction } from "@atlaskit/section-message";
import { SwatchCategoryPicker } from "@/components/workspace/swatch-category-picker";
import { ReferenceUploader } from "@/components/workspace/reference-uploader";
import { findBrandConflicts } from "@/lib/providers/prompt-compiler";
import { SWATCH_CATALOG } from "@/lib/templates/swatches";
import type { LockableKey, Reference, SwatchSelection } from "@/lib/schema/recipe";

export function ShotListPanel({
  references,
  onAddReference,
  onEditReferenceDescription,
  onRemoveReference,
  swatches,
  locked,
  onSelectSwatch,
  onToggleLock,
  freeText,
  onFreeTextChange,
}: {
  references: Reference[];
  onAddReference: (ref: Reference) => void;
  onEditReferenceDescription: (id: string, description: string) => void;
  onRemoveReference: (id: string) => void;
  swatches: SwatchSelection;
  locked: LockableKey[];
  onSelectSwatch: (category: keyof SwatchSelection, value: string) => void;
  onToggleLock: (category: LockableKey) => void;
  freeText: string;
  onFreeTextChange: (value: string) => void;
}) {
  const [dismissed, setDismissed] = useState<string | null>(null);
  const conflicts = useMemo(() => findBrandConflicts(freeText), [freeText]);
  const activeConflict = conflicts.find((c) => c !== dismissed);

  return (
    <div className="space-y-5 p-5 text-sm">
      <div>
        <p className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">Step 2 of 4</p>
        <h2 className="mt-1 text-lg font-semibold">Build the shot list</h2>
        <p className="mt-1 text-xs text-muted-foreground">Choose what your photographer would need to know.</p>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">References</h3>
        <ReferenceUploader
          references={references}
          onAdd={onAddReference}
          onEditDescription={onEditReferenceDescription}
          onRemove={onRemoveReference}
        />
      </div>

      <SwatchCategoryPicker
        title="Key light"
        options={SWATCH_CATALOG.lighting}
        value={swatches.lighting}
        locked={locked.includes("lighting")}
        onSelect={(id) => onSelectSwatch("lighting", id)}
        onToggleLock={() => onToggleLock("lighting")}
      />
      <SwatchCategoryPicker
        title="Palette"
        options={SWATCH_CATALOG.palette}
        value={swatches.palette}
        locked={locked.includes("palette")}
        onSelect={(id) => onSelectSwatch("palette", id)}
        onToggleLock={() => onToggleLock("palette")}
      />
      <SwatchCategoryPicker
        title="Mood"
        options={SWATCH_CATALOG.mood}
        value={swatches.mood}
        locked={locked.includes("mood")}
        onSelect={(id) => onSelectSwatch("mood", id)}
        onToggleLock={() => onToggleLock("mood")}
      />
      <SwatchCategoryPicker
        title="Angle and lens"
        options={SWATCH_CATALOG.composition}
        value={swatches.composition}
        locked={locked.includes("composition")}
        onSelect={(id) => onSelectSwatch("composition", id)}
        onToggleLock={() => onToggleLock("composition")}
      />

      {activeConflict && (
        <SectionMessage
          appearance="warning"
          title="Brand conflict"
          actions={[
            <SectionMessageAction
              key="replace"
              onClick={() =>
                onFreeTextChange(freeText.replace(new RegExp(activeConflict, "gi"), "").replace(/\s{2,}/g, " ").trim())
              }
            >
              Replace
            </SectionMessageAction>,
            <SectionMessageAction key="keep" onClick={() => setDismissed(activeConflict)}>
              Keep anyway
            </SectionMessageAction>,
          ]}
        >
          <p>&ldquo;{activeConflict}&rdquo; isn&apos;t in the brand palette or approved vocabulary.</p>
        </SectionMessage>
      )}

      <label className="block space-y-1.5">
        <span className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
          Anything else? <span className="font-normal normal-case">optional</span>
        </span>
        <TextArea
          value={freeText}
          onChange={(e) => onFreeTextChange(e.currentTarget.value)}
          placeholder="Add a detail the visual choices don't cover…"
          minimumRows={2}
        />
      </label>
    </div>
  );
}
