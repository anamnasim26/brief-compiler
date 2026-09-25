"use client";

import AppProvider from "@atlaskit/app-provider";
import { NextRouterLink } from "@/components/atlaskit-router-link";

/**
 * Brands Atlaskit's design tokens to the indigo accent used throughout
 * globals.css (--primary), via Atlaskit's own supported theming API — so
 * Button/Lozenge/links/focus rings match the rest of the system instead of
 * defaulting to unbranded Atlassian blue (#1868DB).
 */
const BRAND_COLOR = "#5551F0";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider routerLinkComponent={NextRouterLink} defaultTheme={{ UNSAFE_themeOptions: { brandColor: BRAND_COLOR } }}>
      {children}
    </AppProvider>
  );
}
