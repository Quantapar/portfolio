import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { Project as ProjectType } from "../../data/projects";

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
};

export function Project({ project }: ProjectProps) {
  const [isActive, setIsActive] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { title1, title2, src } = project;
  const isOpen = prefersReducedMotion ? false : isActive;

  return (
    <div
      className="flex cursor-pointer items-center justify-center gap-4 border-b border-dotted border-border py-5 last:border-b-0"
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <p className="min-w-0 shrink text-sm">{title1}</p>

      <motion.div
        variants={anim}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="flex h-20 justify-center overflow-hidden"
      >
        <img src={src} alt="" className="h-20 w-auto max-w-none object-cover" />
      </motion.div>

      <p className="min-w-0 shrink text-sm">{title2}</p>
    </div>
  );
}
