import { pageMetadata } from "../../lib/seo";
import { WorkIndexPage } from "../../views/WorkIndexPage";

export const metadata = pageMetadata({ title: "Work", path: "/work" });

export default function Page() {
  return <WorkIndexPage />;
}
