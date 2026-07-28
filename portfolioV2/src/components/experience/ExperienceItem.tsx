import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { Experience } from "../../data/experience";
import { BevelBox } from "../ui/BevelBox";

const easeOut = [0.23, 1, 0.32, 1] as const;

type ExperienceItemProps = {
  item: Experience;
  defaultOpen?: boolean;
};

function ExpandIcon({ open }: { open: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  const transition = {
    duration: shouldReduceMotion ? 0.12 : 0.2,
    ease: easeOut,
  };

  return (
    <span className="relative mt-0.5 flex size-4 shrink-0 items-center justify-center">
      <motion.span
        aria-hidden="true"
        className="absolute text-sm text-foreground/50"
        initial={false}
        animate={{
          opacity: open ? 0 : 1,
          scale: open ? 0.92 : 1,
          rotate: open ? -90 : 0,
        }}
        transition={transition}
      >
        +
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="absolute text-sm text-foreground/50"
        initial={false}
        animate={{
          opacity: open ? 1 : 0,
          scale: open ? 1 : 0.92,
          rotate: open ? 0 : 90,
        }}
        transition={transition}
      >
        −
      </motion.span>
    </span>
  );
}

export function ExperienceItem({
  item,
  defaultOpen = false,
}: ExperienceItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const shouldReduceMotion = useReducedMotion();

  const panelTransition = {
    duration: shouldReduceMotion ? 0.12 : open ? 0.22 : 0.18,
    ease: easeOut,
  };

  return (
    <BevelBox>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="pressable flex w-full items-start gap-3 px-4 py-4 text-left"
        aria-expanded={open}
      >
        <span
          className="flex size-10 shrink-0 items-center justify-center text-xs font-medium text-white"
          style={{ backgroundColor: item.logo.color }}
        >
          {item.logo.label}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{item.company}</span>
            <span className="border border-dotted border-border px-2 py-0.5 text-xs text-foreground/60">
              {item.roleType}
            </span>
          </span>
          <span className="mt-1 block text-sm text-foreground/50">
            {item.period}
          </span>
        </span>

        <ExpandIcon open={open} />
      </button>

      <motion.div
        initial={false}
        animate={
          shouldReduceMotion
            ? {
                height: open ? "auto" : 0,
                opacity: open ? 1 : 0,
              }
            : {
                height: open ? "auto" : 0,
                opacity: open ? 1 : 0,
                clipPath: open
                  ? "inset(0 0 0 0)"
                  : "inset(0 0 100% 0)",
              }
        }
        transition={panelTransition}
        className="overflow-hidden"
        aria-hidden={!open}
      >
        <div className="border-t border-dotted border-border px-4 pb-4 pt-3">
          <motion.ul
            initial={false}
            animate={{ opacity: open ? 1 : 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.12 : 0.18,
              ease: easeOut,
              delay: open && !shouldReduceMotion ? 0.04 : 0,
            }}
            className="space-y-2 text-sm leading-relaxed text-foreground/70"
          >
            {item.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span aria-hidden="true" className="text-foreground/35">
                  •
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={false}
            animate={{ opacity: open ? 1 : 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.12 : 0.18,
              ease: easeOut,
              delay: open && !shouldReduceMotion ? 0.06 : 0,
            }}
            className="mt-4 flex flex-wrap gap-2"
          >
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="border border-dotted border-border px-2 py-1 text-xs text-foreground/65"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </BevelBox>
  );
}
