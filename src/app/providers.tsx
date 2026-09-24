"use client";

import AppProvider from "@atlaskit/app-provider";
import { NextRouterLink } from "@/components/atlaskit-router-link";

/** Atlaskit's own default theme (Atlassian blue light theme) — no custom branding. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <AppProvider routerLinkComponent={NextRouterLink}>{children}</AppProvider>;
}
