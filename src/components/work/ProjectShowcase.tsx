import {
  PROJECT_TYPE_LABELS,
  type Project,
} from "../../data/projects";
import { BackHeading } from "../ui/BackHeading";
import { BevelBox } from "../ui/BevelBox";
import { WorkLink } from "./WorkLink";
import { ProjectPreviewOrImage } from "./ProjectPreviewFrame";

type ProjectShowcaseProps = {
  project: Project;
};

export function ProjectShowcase({ project }: ProjectShowcaseProps) {
  const typeLabel = PROJECT_TYPE_LABELS[project.type];
  const heroSrc = project.hero ?? project.src;

  return (
    <article className="px-4 py-10 sm:px-6">
      <header className="mb-6 border-b border-dotted border-border pb-6">
        <div className="flex items-center justify-between gap-4">
          <BackHeading to="/work" className="min-w-0">
            {project.title1} {project.title2}
          </BackHeading>
          <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-foreground/50">
            {project.type !== "product" ? (
              <span className="inline-flex items-center border border-dotted border-border px-2 py-0.5">
                {typeLabel}
              </span>
            ) : null}
            {project.status ? (
              <span className="text-foreground/65">{project.status}</span>
            ) : null}
          </div>
        </div>
      </header>

      {project.videoSrc ? (
        <div className="mb-6">
          <BevelBox media className="overflow-hidden bg-black">
            <video
              src={project.videoSrc}
              poster={project.src}
              className="block aspect-[1250/720] w-full bg-black object-contain"
              aria-label={`${project.title1} ${project.title2} walkthrough`}
              autoPlay
              controls
              loop
              muted
              playsInline
              preload="metadata"
            />
          </BevelBox>
          {project.archiveNote ? (
            <p className="mt-3 text-xs leading-relaxed text-foreground/55">
              {project.archiveNote}
            </p>
          ) : null}
        </div>
      ) : (
        <ProjectPreviewOrImage
          slug={project.slug}
          src={heroSrc}
          alt={`${project.title1} ${project.title2}`}
        />
      )}

      <div className="space-y-4 border-b border-dotted border-border pb-6 text-pretty text-base text-foreground">
        <p className="max-w-xl">{project.summary}</p>
        <p className="max-w-xl">{project.useCase}</p>
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

      {project.liveUrl ||
      project.sourceUrl ||
      project.contributionUrl ||
      project.featureUrl ? (
        <div className="pt-6">
          <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
            {project.liveUrl ? (
              <WorkLink href={project.liveUrl} label="Live demo" />
            ) : null}
            {project.sourceUrl ? (
              <WorkLink href={project.sourceUrl} label="Source" />
            ) : null}
            {project.contributionUrl ? (
              <WorkLink
                href={project.contributionUrl}
                label="My contribution"
              />
            ) : null}
            {project.featureUrl ? (
              <WorkLink
                href={project.featureUrl}
                label="Featured on Vibrant.design"
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}
