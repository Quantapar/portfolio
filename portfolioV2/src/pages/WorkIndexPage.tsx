import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  getProjectsByType,
  projects,
  sortProjects,
} from "../data/projects";
import { WorkComponentDirectory } from "../components/work/WorkComponentDirectory";
import {
  WorkFilters,
  type WorkFilter,
} from "../components/work/WorkFilters";
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
    <main className="px-6 py-8">
      <LinkBack />
      <header className="mb-6 border-b border-dotted border-border pb-6">
        <h1 className="text-lg font-medium">Work</h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-foreground/75">
          Products, components, and mobile work — shown directly, no deep dive
          required.
        </p>
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

function LinkBack() {
  return (
    <Link
      to="/"
      className="pressable btn-bevel relative mb-8 inline-flex min-h-11 items-center gap-2 px-3 py-2 text-sm sm:w-auto"
    >
      <span className="btn-bevel-frame" aria-hidden="true" />
      <span
        className="btn-bevel-corner btn-bevel-corner-tl"
        aria-hidden="true"
      />
      <span
        className="btn-bevel-corner btn-bevel-corner-tr"
        aria-hidden="true"
      />
      <span
        className="btn-bevel-corner btn-bevel-corner-bl"
        aria-hidden="true"
      />
      <span
        className="btn-bevel-corner btn-bevel-corner-br"
        aria-hidden="true"
      />
      <span aria-hidden="true" className="text-foreground/50">
        ←
      </span>
      Home
    </Link>
  );
}
