import { useMemo, useState } from "react";
import { getProjectsByType, projects, sortProjects } from "../data/projects";
import { BackHeading } from "../components/ui/BackHeading";
import { WorkComponentDirectory } from "../components/work/WorkComponentDirectory";
import { WorkFilters, type WorkFilter } from "../components/work/WorkFilters";
import { WorkProjectGrid } from "../components/work/WorkProjectCard";

export function WorkIndexPage() {
  const [filter, setFilter] = useState<WorkFilter>("all");

  const productProjects = useMemo(() => getProjectsByType("product"), []);
  const mobileProjects = useMemo(() => getProjectsByType("mobile"), []);
  const componentProjects = useMemo(() => getProjectsByType("component"), []);

  const allVisualProjects = useMemo(
    () =>
      sortProjects(
        projects.filter(
          (project) => project.type === "product" || project.type === "mobile",
        ),
      ),
    [],
  );

  return (
    <main className="px-4 py-8 sm:px-6">
      <header className="mb-6 border-b border-dotted border-border pb-6">
        <BackHeading to="/">Work</BackHeading>
      </header>

      <WorkFilters value={filter} onChange={setFilter} />

      {filter === "all" ? (
        <div className="space-y-10">
          <WorkComponentDirectory
            projects={componentProjects}
            limit={9}
            onShowAll={() => setFilter("component")}
          />
          <WorkProjectGrid projects={allVisualProjects} />
        </div>
      ) : null}

      {filter === "product" ? (
        <WorkProjectGrid projects={productProjects} />
      ) : null}

      {filter === "mobile" ? (
        <WorkProjectGrid projects={mobileProjects} />
      ) : null}

      {filter === "component" ? (
        <WorkComponentDirectory projects={componentProjects} />
      ) : null}
    </main>
  );
}
