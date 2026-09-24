import type { AdFormat } from "@/lib/schema/recipe";

export function AdCanvas({ dataUri, format, alt = "Ad canvas preview" }: { dataUri: string; format: AdFormat; alt?: string }) {
  const aspectRatio = format.width / format.height;
  return (
    <div className="flex flex-1 items-center justify-center bg-canvas p-6">
      <div
        className="relative overflow-hidden bg-card ring-1 ring-foreground/15"
        style={{ aspectRatio, width: "100%", maxWidth: 560, maxHeight: 480 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dataUri} alt={alt} className="size-full object-cover" />
      </div>
    </div>
  );
}

export function StageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-center justify-between px-7 pt-5">
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
