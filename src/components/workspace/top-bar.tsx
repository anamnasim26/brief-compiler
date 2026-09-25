"use client";

import Button from "@atlaskit/button/default/button";
import Select from "@atlaskit/select";
import { cn } from "cn";
import { Check, RefreshCw, Sparkles } from "lucide-react";
import { toAtlaskitIcon } from "@/lib/atlaskit-icon";
import { WORKSPACE_STEPS, type AdFormat, type WorkspaceStep } from "@/lib/schema/recipe";
import { AD_FORMATS } from "@/lib/templates/formats";

const RefreshCwIcon = toAtlaskitIcon(RefreshCw);
const SparklesIcon = toAtlaskitIcon(Sparkles);

type FormatOption = { label: string; value: string };
const FORMAT_OPTIONS: FormatOption[] = AD_FORMATS.map((f) => ({ label: f.name, value: f.id }));

const STEP_LABELS: Record<WorkspaceStep, string> = {
  frame: "Frame",
  shot_list: "Shot list",
  pick: "Pick",
  refine: "Refine",
  export: "Export",
};

export function TopBar({
  step,
  onStepChange,
  format,
  onFormatChange,
  expertMode,
  onToggleExpert,
  onGenerate,
  generating,
  canGenerate,
}: {
  step: WorkspaceStep;
  onStepChange: (step: WorkspaceStep) => void;
  format: AdFormat | null;
  onFormatChange: (format: AdFormat) => void;
  expertMode: boolean;
  onToggleExpert: (v: boolean) => void;
  onGenerate: () => void;
  generating: boolean;
  canGenerate: boolean;
}) {
  const stepIndex = WORKSPACE_STEPS.indexOf(step);
  const isRegenerate = step === "pick";
  const showGenerateButton = step === "shot_list" || step === "pick";

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-panel px-5">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="grid size-5 place-items-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground">B</span>
        Brief Compiler
      </div>

      <div className="w-52">
        <Select<FormatOption>
          inputId="format-select"
          aria-label="Format"
          placeholder="Choose format…"
          spacing="compact"
          options={FORMAT_OPTIONS}
          value={FORMAT_OPTIONS.find((o) => o.value === format?.id) ?? null}
          onChange={(option) => {
            const next = AD_FORMATS.find((f) => f.id === option?.value);
            if (next) onFormatChange(next);
          }}
        />
      </div>

      <nav aria-label="Workspace steps" className="flex flex-1 items-center justify-center gap-0">
        {WORKSPACE_STEPS.map((s, i) => {
          const active = s === step;
          const complete = i < stepIndex;
          const reachable = i <= stepIndex;
          return (
            <button
              key={s}
              type="button"
              disabled={!reachable}
              onClick={() => reachable && onStepChange(s)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium disabled:cursor-not-allowed",
                active ? "text-foreground font-semibold" : complete ? "text-muted-foreground" : "text-muted-foreground/50"
              )}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-[10px] font-bold",
                  active ? "bg-primary text-primary-foreground" : complete ? "bg-accent text-primary" : "bg-secondary"
                )}
              >
                {complete ? <Check className="size-3" /> : i + 1}
              </span>
              {STEP_LABELS[s]}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-1 rounded-md bg-secondary p-0.5 text-[11px]">
        <Button spacing="compact" appearance={!expertMode ? "primary" : "subtle"} onClick={() => onToggleExpert(false)}>
          Guided
        </Button>
        <Button spacing="compact" appearance={expertMode ? "primary" : "subtle"} onClick={() => onToggleExpert(true)}>
          Expert
        </Button>
      </div>

      {showGenerateButton && (
        <Button
          appearance="primary"
          spacing="compact"
          iconBefore={isRegenerate ? RefreshCwIcon : SparklesIcon}
          onClick={onGenerate}
          isDisabled={!canGenerate || generating}
          isLoading={generating}
        >
          {generating ? "Generating…" : isRegenerate ? "Regenerate" : "Generate"}
        </Button>
      )}
    </header>
  );
}
