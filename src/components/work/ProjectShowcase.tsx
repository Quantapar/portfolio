import type { Project } from "../../data/projects";
import { workKey } from "../../data/work";
import { workTransitionName } from "../../lib/routeTransition";
import { Breadcrumb } from "../ui/Breadcrumb";

type ProjectShowcaseProps = {
  project: Project;
};

const mediaClassName =
  "block w-full border border-dotted border-border bg-foreground/3";

export function ProjectShowcase({ project }: ProjectShowcaseProps) {
  const title = `${project.title1} ${project.title2}`.trim();

  const links = [
    { label: "Live demo", href: project.liveUrl },
    { label: "Source", href: project.sourceUrl },
    { label: "My contribution", href: project.contributionUrl },
    { label: "Post on X", href: project.postUrl },
    { label: "Featured on Vibrant.design", href: project.featureUrl },
  ].filter((link) => link.href);

  return (
    <article className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Work", to: "/work", transitionName: "work-heading" },
          { label: title },
        ]}
      />

      <header className="mt-2 flex items-baseline justify-between gap-4">
        <h1 className="min-w-0 font-medium">{title}</h1>
        <time className="shrink-0 font-mono text-xs text-foreground/50">
          {project.year}
        </time>
      </header>

      <p className="text-pretty text-foreground/65">{project.summary}</p>

      <div>
        {/* The thumbnail that was clicked grows into this. */}
        <div
          style={{ viewTransitionName: workTransitionName(workKey(project)) }}
        >
          {project.videoSrc ? (
            <video
              src={project.videoSrc}
              poster={project.src}
              className={`${mediaClassName} aspect-[1250/720] object-contain`}
              aria-label={`${title} walkthrough`}
              autoPlay
              controls
              loop
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              src={project.hero ?? project.src}
              alt={title}
              className={`${mediaClassName} h-auto`}
            />
          )}
        </div>
        {project.archiveNote ? (
          <p className="mt-3 text-xs text-foreground/50">
            {project.archiveNote}
          </p>
        ) : null}
      </div>

      <p className="text-pretty text-foreground/65">{project.useCase}</p>

      {links.length > 0 ? (
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="link-inline"
            >
              {link.label}
            </a>
          ))}
        </p>
      ) : null}
    </article>
  );
}
