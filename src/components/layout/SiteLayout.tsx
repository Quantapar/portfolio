import { useLayoutEffect } from "react";
import { matchPath, Outlet, useLocation } from "react-router-dom";
import { getProjectBySlug } from "../../data/projects";
import { markRouteReady } from "../../lib/routeTransition";
import { getProjectPreview } from "../work/previews";
import { PageShell } from "./PageShell";
import { SiteFooter } from "./SiteFooter";

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Instant, not smooth: a new page should start at the top, not scroll there.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Live pieces load their code first and report ready themselves.
    if (!isLiveWorkPath(pathname)) markRouteReady();
  }, [pathname]);

  return null;
}

function projectSlug(pathname: string) {
  return matchPath({ path: "/work/:slug", end: true }, pathname)?.params.slug;
}

/** Work rebuilt on this site takes the whole screen, with no column, fade or footer around it. */
function isLiveWorkPath(pathname: string) {
  const slug = projectSlug(pathname);
  return Boolean(slug && getProjectBySlug(slug) && getProjectPreview(slug));
}

export function SiteLayout() {
  const { pathname } = useLocation();

  if (isLiveWorkPath(pathname)) {
    return (
      <>
        <ScrollToTop />
        <Outlet />
      </>
    );
  }

  return (
    <div className="min-h-dvh w-full overflow-x-clip">
      <ScrollToTop />
      {/* Content scrolling up dissolves into the page instead of meeting a hard top edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-10 h-24 bg-linear-to-b from-background to-transparent"
      />
      <PageShell>
        <Outlet />
        {/* The sign-off belongs to the home page; inner pages end with their content. */}
        {pathname === "/" ? <SiteFooter /> : null}
      </PageShell>
    </div>
  );
}
