import { useEffect } from "react";
import { matchPath, Outlet, useLocation } from "react-router-dom";
import { getProjectBySlug } from "../../data/projects";
import { PageShell } from "./PageShell";
import { SiteHeader } from "./SiteHeader";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function isNotFoundPath(pathname: string) {
  if (pathname === "/" || pathname === "/work") return false;

  const workProject = matchPath({ path: "/work/:slug", end: true }, pathname);
  if (workProject?.params.slug) {
    return !getProjectBySlug(workProject.params.slug);
  }

  return true;
}

export function SiteLayout() {
  const { pathname } = useLocation();
  const isNotFound = isNotFoundPath(pathname);

  return (
    <div className="min-h-dvh w-full overflow-x-clip">
      <ScrollToTop />
      <PageShell>
        <SiteHeader showBrand={!isNotFound} />
        <Outlet />
      </PageShell>
    </div>
  );
}
