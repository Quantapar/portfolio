"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, type ReactNode } from "react";
import { getProjectBySlug } from "../../data/projects";
import { enterEntry } from "../../lib/historyEntry";
import { markRouteReady } from "../../lib/routeTransition";
import { getProjectPreview } from "../work/previews";
import { PageShell } from "./PageShell";
import { SiteFooter } from "./SiteFooter";

// How far down each visited page was scrolled, by its place in the browser's history.
const scrollPositions = new Map<string, number>();

/** A new page starts at the top; one returned to with Back or Forward resumes where it was left. */
function RouteScroll() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    // Positions are restored here, so the browser's own attempt would only fight this one.
    window.history.scrollRestoration = "manual";
  }, []);

  useLayoutEffect(() => {
    const { key, returning } = enterEntry();
    const top = returning ? (scrollPositions.get(key) ?? 0) : 0;
    // Instant, not smooth: a page should be where it belongs, not scroll there.
    window.scrollTo({ top, left: 0, behavior: "instant" });

    // Live pieces load their code first and report ready themselves.
    if (!isLiveWorkPath(pathname)) markRouteReady();

    // Recorded as the visitor scrolls: by the time they leave, the page is already gone.
    const remember = () => scrollPositions.set(key, window.scrollY);
    window.addEventListener("scroll", remember, { passive: true });

    return () => window.removeEventListener("scroll", remember);
  }, [pathname]);

  return null;
}

function projectSlug(pathname: string) {
  return pathname.match(/^\/work\/([^/]+)\/?$/)?.[1];
}

/** Work rebuilt on this site takes the whole screen, with no column, fade or footer around it. */
function isLiveWorkPath(pathname: string) {
  const slug = projectSlug(pathname);
  return Boolean(slug && getProjectBySlug(slug) && getProjectPreview(slug));
}

type SiteLayoutProps = {
  children: ReactNode;
};

export function SiteLayout({ children }: SiteLayoutProps) {
  const pathname = usePathname();

  if (isLiveWorkPath(pathname)) {
    return (
      <>
        <RouteScroll />
        {children}
      </>
    );
  }

  return (
    <div className="min-h-dvh w-full overflow-x-clip">
      <RouteScroll />
      {/* Content scrolling up dissolves into the page instead of meeting a hard top edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-10 h-24 bg-linear-to-b from-background to-transparent"
      />
      <PageShell>
        {children}
        {/* The sign-off belongs to the home page; inner pages end with their content. */}
        {pathname === "/" ? <SiteFooter /> : null}
      </PageShell>
    </div>
  );
}
