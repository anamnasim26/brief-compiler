import { brandConfig } from "@/lib/config/brand";
import { LockKeyhole } from "lucide-react";

export function BrandRulesPanel() {
  return (
    <div className="space-y-4 p-5 text-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Brand rules</h2>
        <LockKeyhole className="size-4 text-muted-foreground" />
      </div>
      <p className="text-xs text-muted-foreground">Applied automatically to every generation.</p>

      <div>
        <h3 className="mb-2 text-[10px] font-bold tracking-wide text-muted-foreground uppercase">Brand colours</h3>
        <div className="overflow-hidden rounded-md border">
          {brandConfig.palette.map((color) => (
            <div key={color.hex} className="flex items-center gap-2 border-b px-2.5 py-2 text-xs last:border-b-0">
              <span className="size-4 rounded-sm border" style={{ backgroundColor: color.hex }} />
              <span className="flex-1">{color.name}</span>
              <code className="text-[10px] text-muted-foreground">{color.hex}</code>
              <LockKeyhole className="size-3 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-[10px] font-bold tracking-wide text-muted-foreground uppercase">Generation rules</h3>
        <div className="space-y-2">
          {brandConfig.forbiddenElements.map((rule) => (
            <div key={rule} className="flex items-center gap-2 border-b pb-2 text-xs last:border-b-0">
              <span className="size-1.5 shrink-0 rounded-full bg-success" />
              <span className="flex-1 text-muted-foreground">No {rule}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-t pt-3 text-[10px] text-muted-foreground">
        <LockKeyhole className="size-3" />
        {brandConfig.name} · {brandConfig.version}
      </div>
    </div>
  );
}
