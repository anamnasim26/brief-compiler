"use client";

import Lozenge from "@atlaskit/lozenge";
import TextArea from "@atlaskit/textarea";
import { SEGMENT_KEYS, type CompiledPrompt, type SegmentKey } from "@/lib/schema/recipe";

const SEGMENT_LABELS: Record<SegmentKey, string> = {
  subject: "Subject",
  setting: "Setting",
  lighting: "Lighting",
  style: "Style",
  camera: "Camera",
};

/** Guided/expert is toggled from the workspace TopBar; this panel just renders the current mode. */
export function PromptPanel({
  prompt,
  expertMode,
  onEditSegment,
}: {
  prompt: CompiledPrompt | null;
  expertMode: boolean;
  onEditSegment: (key: SegmentKey, value: string) => void;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-3 rounded-md border bg-panel p-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold">Compiled prompt</div>
      {!prompt ? (
        <p className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">
          Pick swatches and generate to see the compiled prompt.
        </p>
      ) : expertMode ? (
        <div className="space-y-3">
          {SEGMENT_KEYS.map((key) => (
            <div key={key} className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium">{SEGMENT_LABELS[key]}</span>
                {prompt.overrides.includes(key) ? <Lozenge appearance="new">override</Lozenge> : null}
              </div>
              <TextArea
                value={prompt.segments[key]}
                onChange={(e) => onEditSegment(key, e.currentTarget.value)}
                minimumRows={2}
              />
            </div>
          ))}
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Exclusions (negativeText)</span>
            <p className="rounded-md border bg-muted/50 p-2 text-xs text-muted-foreground">{prompt.negative}</p>
          </div>
          <p className="text-[11px] text-muted-foreground">{prompt.characterCount} / 1024 characters</p>
        </div>
      ) : (
        <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
          <p className="text-sm leading-relaxed">
            {SEGMENT_KEYS.map((key) => prompt.segments[key]).join(". ")}
          </p>
          <p className="text-[11px] text-muted-foreground">{prompt.characterCount} / 1024 characters · exclusions applied automatically</p>
        </div>
      )}
    </div>
  );
}
