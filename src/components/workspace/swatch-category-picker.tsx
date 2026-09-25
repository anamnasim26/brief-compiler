"use client";

import IconButton from "@atlaskit/button/icon/button";
import { cn } from "cn";
import { Lock, Unlock } from "lucide-react";
import { toAtlaskitIcon } from "@/lib/atlaskit-icon";
import type { SwatchOption } from "@/lib/templates/swatches";

const LockIcon = toAtlaskitIcon(Lock);
const UnlockIcon = toAtlaskitIcon(Unlock);

function SwatchPreview({ preview }: { preview: SwatchOption["preview"] }) {
  if (preview.type === "gradient") {
    return <div className="size-8 border border-frame/50" style={{ background: preview.css }} />;
  }
  if (preview.type === "palette") {
    return (
      <div className="flex size-8 overflow-hidden border border-frame/50">
        {preview.colors.slice(0, 3).map((c, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>
    );
  }
  return (
    <div className="relative size-8 border border-frame/50 bg-muted">
      <div
        className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
        style={{ left: `${preview.x}%`, top: `${preview.y}%` }}
      />
    </div>
  );
}

export function SwatchCategoryPicker({
  title,
  hint,
  options,
  value,
  locked,
  disabled,
  onSelect,
  onToggleLock,
}: {
  title: string;
  hint?: string;
  options: SwatchOption[];
  value: string | null;
  locked: boolean;
  disabled?: boolean;
  onSelect: (id: string) => void;
  onToggleLock: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <IconButton
          icon={locked ? LockIcon : UnlockIcon}
          isSelected={locked}
          onClick={onToggleLock}
          label={locked ? `Unlock ${title.toLowerCase()}` : `Lock ${title.toLowerCase()}`}
          spacing="compact"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled || locked}
              onClick={() => onSelect(option.id)}
              aria-pressed={selected}
              className={cn(
                "flex flex-col items-center gap-1 border p-1.5 text-center transition-colors",
                selected ? "border-primary bg-primary/5" : "border-frame/50 hover:bg-muted",
                (disabled || locked) && !selected && "cursor-not-allowed opacity-50"
              )}
              style={{ width: 76 }}
            >
              <SwatchPreview preview={option.preview} />
              <span className="text-[11px] leading-tight">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
