import { Link } from "react-router-dom";
import {
  PROJECT_TYPE_LABELS,
  type Project,
} from "../../data/projects";
import { WorkLink } from "./WorkLink";
import { ProjectPreviewOrImage } from "./ProjectPreviewFrame";

type ProjectShowcaseProps = {
  project: Project;
};

export function ProjectShowcase({ project }: ProjectShowcaseProps) {
  const typeLabel = PROJECT_TYPE_LABELS[project.type];
  const heroSrc = project.hero ?? project.src;

  return (
    <article className="px-6 py-8">
      <Link
        to="/work"
        className="pressable mb-8 inline-flex min-h-11 items-center text-sm text-foreground/50"
      >
        ← Work
      </Link>

      <header className="mb-6 border-b border-dotted border-border pb-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="min-w-0 text-lg font-medium">{project.title1} {project.title2}</h1>
          <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-foreground/50">
            <span className="inline-flex items-center border border-dotted border-border px-2 py-0.5">
              {typeLabel}
            </span>
            {project.status ? (
              <span className="text-foreground/65">{project.status}</span>
            ) : null}
          </div>
        </div>
      </header>

      <ProjectPreviewOrImage
        slug={project.slug}
        src={heroSrc}
        alt={`${project.title1} ${project.title2}`}
      />

      <div className="space-y-4 border-b border-dotted border-border pb-6 text-sm leading-relaxed text-foreground/75">
        <p>{project.summary}</p>
        <p>{project.useCase}</p>
      </div>

      {project.tech && project.tech.length > 0 ? (
        <div className="border-b border-dotted border-border py-6">
          <h2 className="mb-3 text-sm font-medium">Tech</h2>
          <ul className="flex flex-wrap gap-2">
            {project.tech.map((item) => (
              <li
                key={item}
                className="border border-dotted border-border px-2 py-1 text-xs text-foreground/65"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {project.liveUrl || project.sourceUrl ? (
        <div className="pt-6">
          <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
            {project.liveUrl ? (
              <WorkLink href={project.liveUrl} label="Live demo" />
            ) : null}
            {project.sourceUrl ? (
              <WorkLink href={project.sourceUrl} label="Source" />
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}
