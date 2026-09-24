"use client";

import { forwardRef } from "react";
import Link from "next/link";
import type { RouterLinkComponentProps } from "@atlaskit/app-provider";

/**
 * Adapts Next.js's <Link> to the shape @atlaskit/app-provider expects, so
 * every Atlaskit LinkButton (and any other ADS component that renders a
 * navigational link) gets real client-side Next navigation instead of a
 * full page load.
 */
export const NextRouterLink = forwardRef<HTMLAnchorElement, RouterLinkComponentProps>(function NextRouterLink(
  { href, children, ...rest },
  ref
) {
  return (
    <Link href={href as string} ref={ref} {...rest}>
      {children}
    </Link>
  );
});
