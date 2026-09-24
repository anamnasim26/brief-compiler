import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

/**
 * Atlaskit's icon-carrying props (Button's `iconBefore`, IconButton's `icon`)
 * expect a component tolerant of Atlaskit's own icon prop shape (label,
 * color, spacing, size as a token name, etc.), not lucide's (size in px,
 * className, strokeWidth). This adapts a lucide icon to be droppable into
 * either without lucide ever needing its own package swap. Cast to
 * `ComponentType<any>` at the boundary: Atlaskit's IconProp union type isn't
 * importable in a form worth coupling to here, and the extra props it may
 * pass (label, color, testId, ...) are simply ignored at runtime, which is
 * exactly what we want.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- bridges two external icon prop shapes; extra props are ignored at runtime by design.
export function toAtlaskitIcon(Icon: LucideIcon): ComponentType<any> {
  const sizeMap: Record<string, number> = { small: 16, medium: 20, large: 24, xlarge: 28 };
  function AdaptedIcon({ size }: { size?: string }) {
    return <Icon size={size ? (sizeMap[size] ?? 16) : 16} aria-hidden focusable={false} />;
  }
  AdaptedIcon.displayName = `AtlaskitIcon(${Icon.displayName ?? Icon.name ?? "Icon"})`;
  return AdaptedIcon;
}
