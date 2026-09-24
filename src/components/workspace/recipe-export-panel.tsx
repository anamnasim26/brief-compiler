"use client";

import { useState } from "react";
import Button from "@atlaskit/button/default/button";
import { toAtlaskitIcon } from "@/lib/atlaskit-icon";
import type { Recipe } from "@/lib/schema/recipe";
import { Check, Copy, Download } from "lucide-react";

const CheckIcon = toAtlaskitIcon(Check);
const CopyIcon = toAtlaskitIcon(Copy);
const DownloadIcon = toAtlaskitIcon(Download);

export function RecipeExportPanel({ recipe }: { recipe: Recipe }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(recipe, null, 2);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be unavailable; ignore */
    }
  }

  function handleDownload() {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${recipe.recipe_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <details className="group rounded-lg border">
      <summary className="flex cursor-pointer list-none items-center justify-between p-3 text-sm font-medium">
        Recipe (JSON)
        <span className="text-xs text-muted-foreground group-open:hidden">show</span>
        <span className="hidden text-xs text-muted-foreground group-open:inline">hide</span>
      </summary>
      <div className="space-y-2 border-t p-3">
        <div className="flex gap-2">
          <Button spacing="compact" iconBefore={copied ? CheckIcon : CopyIcon} onClick={handleCopy}>
            {copied ? "Copied" : "Copy JSON"}
          </Button>
          <Button spacing="compact" iconBefore={DownloadIcon} onClick={handleDownload}>
            Download
          </Button>
        </div>
        <pre className="max-h-80 overflow-auto rounded-md bg-muted/50 p-3 text-[11px] leading-relaxed">{json}</pre>
      </div>
    </details>
  );
}
