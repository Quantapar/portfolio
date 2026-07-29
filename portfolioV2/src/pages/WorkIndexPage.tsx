import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { projects, sortProjects } from "../data/projects";
import { BevelBox } from "../components/ui/BevelBox";
import { Project } from "../components/work/Project";
import {
  WorkFilters,
  type WorkFilter,
} from "../components/work/WorkFilters";

export function WorkIndexPage() {
  const [filter, setFilter] = useState<WorkFilter>("all");

  const filteredProjects = useMemo(() => {
    const items =
      filter === "all"
        ? projects
        : projects.filter((project) => project.type === filter);

    return sortProjects(items);
  }, [filter]);

  return (
    <main className="px-6 py-8">
      <LinkBack />
      <header className="mb-6 border-b border-dotted border-border pb-6">
        <h1 className="text-lg font-medium">Work</h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-foreground/75">
          Projects, components, landing pages, and interface experiments.
        </p>
      </header>

      <WorkFilters value={filter} onChange={setFilter} />

      <BevelBox>
        {filteredProjects.map((project) => (
          <Project key={project.slug} project={project} showMeta />
        ))}
      </BevelBox>
    </main>
  );
}

function LinkBack() {
  return (
    <Link
      to="/"
      className="pressable mb-8 inline-flex min-h-11 items-center text-sm text-foreground/50"
    >
      ← Home
    </Link>
  );
}
