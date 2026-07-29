import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Project as ProjectType } from "../../data/projects";
import { PROJECT_TYPE_LABELS } from "../../data/projects";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { getProjectPreview } from "./previews";
import { ProjectPreviewFrame } from "./ProjectPreviewFrame";

const ease = [0.23, 1, 0.32, 1] as const;

const anim = {
  initial: { width: 0 },
  open: {
    width: "auto",
    transition: { duration: 0.4, ease },
  },
  closed: {
    width: 0,
    transition: { duration: 0.4, ease },
  },
};

type ProjectProps = {
  project: ProjectType;
  showMeta?: boolean;
};

function projectTitle(project: ProjectType) {
  return `${project.title1} ${project.title2}`;
}

export function Project({ project, showMeta = false }: ProjectProps) {
  const [isActive, setIsActive] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 639px)");
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const { src, slug, type } = project;
  const isOpen = prefersReducedMotion ? false : isActive;
  const title = projectTitle(project);
  const typeLabel = PROJECT_TYPE_LABELS[type];
  const hasPreview = Boolean(getProjectPreview(slug));

  const previewMedia = hasPreview ? (
    <ProjectPreviewFrame slug={slug} compact />
  ) : (
    <img
      src={src}
      alt=""
      className="h-full w-auto max-w-full object-cover"
    />
  );

  if (isMobile) {
    return (
      <Link
        to={`/work/${slug}`}
        className="flex flex-col items-center gap-3 border-b border-dotted border-border px-4 py-5 last:border-b-0 sm:px-5"
      >
        <div className="flex w-full items-center justify-between gap-3">
          <p className="min-w-0 text-sm">{title}</p>
          {showMeta ? (
            <p className="shrink-0 text-right text-xs text-foreground/50">
              {typeLabel}
            </p>
          ) : (
            <p className="min-w-0 text-right text-sm">{project.title2}</p>
          )}
        </div>
        <div className="flex h-16 w-full justify-center overflow-hidden">
          {previewMedia}
        </div>
      </Link>
    );
  }

  if (showMeta) {
    return (
      <Link
        to={`/work/${slug}`}
        className="grid cursor-pointer grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-dotted border-border px-4 py-5 last:border-b-0 sm:px-5"
        onMouseEnter={() => canHover && setIsActive(true)}
        onMouseLeave={() => canHover && setIsActive(false)}
      >
        <p className="min-w-0 text-sm">{title}</p>

        <motion.div
          variants={anim}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          className="flex h-20 items-center justify-center overflow-hidden"
        >
          {previewMedia}
        </motion.div>

        <p className="min-w-0 text-right text-xs text-foreground/50">
          {typeLabel}
        </p>
      </Link>
    );
  }

  return (
    <Link
      to={`/work/${slug}`}
      className="flex cursor-pointer items-center justify-center gap-4 border-b border-dotted border-border px-4 py-5 last:border-b-0 sm:px-5"
      onMouseEnter={() => canHover && setIsActive(true)}
      onMouseLeave={() => canHover && setIsActive(false)}
    >
      <p className="min-w-0 shrink text-sm">{project.title1}</p>

      <motion.div
        variants={anim}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="flex h-20 justify-center overflow-hidden"
      >
        <img src={src} alt="" className="h-20 w-auto max-w-none object-cover" />
      </motion.div>

      <p className="min-w-0 shrink text-sm">{project.title2}</p>
    </Link>
  );
}
