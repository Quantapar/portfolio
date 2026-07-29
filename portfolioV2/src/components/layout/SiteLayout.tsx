import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { PageShell } from "./PageShell";
import { SiteHeader } from "./SiteHeader";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function SiteLayout() {
  return (
    <div className="min-h-dvh w-full overflow-x-clip">
      <ScrollToTop />
      <PageShell>
        <SiteHeader />
        <Outlet />
      </PageShell>
    </div>
  );
}
