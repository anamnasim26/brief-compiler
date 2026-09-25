import { Check, Lock } from "lucide-react";
import { cn } from "cn";

/**
 * Small rounded-full status badge — the system's one recurring label
 * pattern (fixed/locked values, "Recommended", "Coming soon"), styled after
 * Linear/Vercel's own status pills rather than an icon standing alone.
 */
export function Pill({
  children,
  tone = "muted",
  icon,
  className,
}: {
  children: React.ReactNode;
  tone?: "muted" | "accent";
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        tone === "accent" ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground",
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}

/** Shorthand pill for a value that never reaches the model. */
export function FixedPill({ className }: { className?: string }) {
  return (
    <Pill className={className} icon={<Lock className="size-2.5" />}>
      Fixed
    </Pill>
  );
}

/**
 * Small circular checkmark badge marking a chosen tile — paired with an
 * accent-colored ring on the tile itself. The system's one selection
 * indicator, reused everywhere "chosen" needs to be shown.
 */
export function SelectedBadge({ className }: { className?: string }) {
  return (
    <span className={cn("grid size-5 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm", className)}>
      <Check className="size-3" strokeWidth={2.5} />
    </span>
  );
}
