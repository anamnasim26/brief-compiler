"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LinkButton from "@atlaskit/button/link";

export function SiteHeader() {
  const pathname = usePathname();
  if (pathname?.startsWith("/workspace")) {
    // The workspace has its own TopBar (stepper, format, generate) — no global nav on top of it.
    return null;
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Brief Compiler
        </Link>
        <nav className="flex items-center gap-1.5">
          <LinkButton href="/recipes" appearance="subtle" spacing="compact">
            Saved recipes
          </LinkButton>
          <LinkButton href="/workspace/new" appearance="primary" spacing="compact">
            New recipe
          </LinkButton>
        </nav>
      </div>
    </header>
  );
}
