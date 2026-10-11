import { useLayoutEffect } from "react";
import {
  matchPath,
  Outlet,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { getProjectBySlug } from "../../data/projects";
import { markRouteReady } from "../../lib/routeTransition";
import { getProjectPreview } from "../work/previews";
import { PageShell } from "./PageShell";
import { SiteFooter } from "./SiteFooter";

// How far down each visited page was scrolled, by its place in the browser's history.
const scrollPositions = new Map<string, number>();

/** A new page starts at the top; one returned to with Back or Forward resumes where it was left. */
function RouteScroll() {
  const { pathname, key } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    // Positions are restored here, so the browser's own attempt would only fight this one.
    window.history.scrollRestoration = "manual";
  }, []);

  useLayoutEffect(() => {
    const top = navigationType === "POP" ? (scrollPositions.get(key) ?? 0) : 0;
    // Instant, not smooth: a page should be where it belongs, not scroll there.
    window.scrollTo({ top, left: 0, behavior: "instant" });

    // Live pieces load their code first and report ready themselves.
    if (!isLiveWorkPath(pathname)) markRouteReady();

    // Recorded as the visitor scrolls: by the time they leave, the page is already gone.
    const remember = () => scrollPositions.set(key, window.scrollY);
    window.addEventListener("scroll", remember, { passive: true });

    return () => window.removeEventListener("scroll", remember);
  }, [key, pathname, navigationType]);

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
        <RouteScroll />
        <Outlet />
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
        <Outlet />
        {/* The sign-off belongs to the home page; inner pages end with their content. */}
        {pathname === "/" ? <SiteFooter /> : null}
      </PageShell>
    </div>
  );
}
