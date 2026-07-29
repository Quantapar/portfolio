import { Outlet } from "react-router-dom";
import { PageShell } from "./PageShell";
import { SiteHeader } from "./SiteHeader";

export function SiteLayout() {
  return (
    <div className="min-h-dvh w-full overflow-x-clip">
      <PageShell>
        <SiteHeader />
        <Outlet />
      </PageShell>
    </div>
  );
}
