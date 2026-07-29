import { Link } from "react-router-dom";
import type { Project } from "../../data/projects";
import { getProjectPreview } from "./previews";
import { ProjectPreviewFrame } from "./ProjectPreviewFrame";

type WorkProjectCardProps = {
  project: Project;
};

function projectTitle(project: Project) {
  return `${project.title1} ${project.title2}`;
}

export function WorkProjectCard({ project }: WorkProjectCardProps) {
  const title = projectTitle(project);
  const hasPreview = Boolean(getProjectPreview(project.slug));
  const hasImage = Boolean(project.src);

  return (
    <Link
      to={`/work/${project.slug}`}
      className="group flex h-full cursor-pointer flex-col gap-3 p-4 transition-transform duration-[160ms] [transition-timing-function:var(--ease-out)] active:scale-[0.98] sm:p-5"
    >
      <div className="flex aspect-[16/10] w-full items-center justify-center overflow-hidden border border-dotted border-border bg-foreground/3">
        {hasImage ? (
          <img
            src={project.src}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : hasPreview ? (
          <ProjectPreviewFrame slug={project.slug} compact />
        ) : (
          <span className="text-sm text-foreground/40">{title}</span>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
          {project.status ? (
            <span className="text-xs font-medium text-foreground underline decoration-wavy decoration-foreground underline-offset-[4px]">
              ({project.status})
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

type WorkProjectGridProps = {
  projects: Project[];
};

export function WorkProjectGrid({ projects }: WorkProjectGridProps) {
  if (projects.length === 0) {
    return (
      <p className="py-8 text-sm text-foreground/50">
        No projects in this category.
      </p>
    );
  }

  return (
    <div className="btn-bevel relative">
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
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {projects.map((project, index) => {
          const isLast = index === projects.length - 1;
          const isOddCount = projects.length % 2 === 1;
          const isLastRow = index >= projects.length - (isOddCount ? 1 : 2);

          return (
            <div
              key={project.slug}
              className={[
                !isLast ? "border-b border-dotted border-border" : "",
                !isLastRow
                  ? "sm:border-b sm:border-dotted sm:border-border"
                  : "sm:border-b-0",
                index % 2 === 0
                  ? "sm:border-r sm:border-dotted sm:border-border"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <WorkProjectCard project={project} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
