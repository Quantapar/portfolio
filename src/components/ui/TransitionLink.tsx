"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { canStepBack, rememberFrom } from "../../lib/historyEntry";
import { canTransition, startRouteTransition } from "../../lib/routeTransition";

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  /** A path on this site. */
  to: string;
  /**
   * Step back in history instead of opening `to`, when this page was reached from inside the site.
   * The visitor then lands where they left off; `to` is where anyone who arrived directly goes.
   */
  back?: boolean;
};

/** A router link whose page change morphs shared elements instead of cutting. */
export function TransitionLink({
  to,
  onClick,
  back = false,
  ...props
}: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Link
      href={to}
      // Each page sets its own scroll position once it has rendered (see SiteLayout).
      scroll={false}
      {...props}
      onClick={(event) => {
        onClick?.(event);

        // Leave new-tab clicks, already-handled clicks and same-page links to the browser and router.
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          to === pathname
        ) {
          return;
        }

        const stepBack = back && canStepBack();

        // Tells the next page where it was opened from.
        if (!stepBack) rememberFrom(pathname);
        if (!stepBack && !canTransition()) return;

        event.preventDefault();
        startRouteTransition(() => {
          if (stepBack) {
            router.back();
          } else {
            router.push(to, { scroll: false });
          }
        });
      }}
    />
  );
}
