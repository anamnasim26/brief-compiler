import { cn } from "cn";

/**
 * Plain, literal tag for a fixed-layer value (logo, exact brand color, copy,
 * price, product photo) — anything that never touches the model. Replaces a
 * lock icon with the same unambiguous labeling a production form would use.
 */
export function EdgeTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center font-mono text-[10px] font-medium tracking-wide text-muted-foreground", className)}>
      [{children}]
    </span>
  );
}

/**
 * A hand-drawn grease-pencil circle — the system's one selection mark,
 * reused everywhere "chosen" needs to be shown. Two overlapping, slightly
 * misaligned rings in the same red read as circled by hand, not drawn once
 * by a computer. The parent must be `relative`.
 */
export function GreaseCircle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("pointer-events-none absolute inset-[-7%] size-[114%]", className)} aria-hidden="true">
      <ellipse cx="49" cy="52" rx="47" ry="43" fill="none" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" transform="rotate(-4 49 52)" />
      <ellipse cx="52" cy="49" rx="44" ry="46" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" transform="rotate(6 52 49)" />
    </svg>
  );
}
