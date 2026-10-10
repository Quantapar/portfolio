import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createPortal } from "react-dom";

export type ExperienceHover = {
  image: string;
  /** Viewport box of the hovered row. */
  rect: DOMRect;
};

const WIDTH = 328;
const HEIGHT = 208;
const GAP = 12;
const EDGE = 12;

const spring = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  filter: { type: "spring", stiffness: 400, damping: 40 },
} as const;

/** Sits beside the row: right of it when there is room, else left, else not at all. */
function place(rect: DOMRect) {
  let left = rect.right + GAP;

  if (left + WIDTH > window.innerWidth - EDGE) {
    left = rect.left - WIDTH - GAP;
  }

  // On narrow screens either side would cover the row being read.
  if (left < EDGE) return null;

  const lowest = Math.max(EDGE, window.innerHeight - HEIGHT - EDGE);

  return { left, top: Math.min(Math.max(EDGE, rect.top), lowest) };
}

type ExperiencePreviewProps = {
  hover: ExperienceHover | null;
};

export function ExperiencePreview({ hover }: ExperiencePreviewProps) {
  const shouldReduceMotion = useReducedMotion();
  const position = hover ? place(hover.rect) : null;

  return createPortal(
    <AnimatePresence>
      {hover && position ? (
        <motion.div
          // One shared element, so it glides from row to row instead of blinking.
          layoutId="experience-preview"
          aria-hidden="true"
          className="pointer-events-none fixed z-50"
          style={{ ...position, width: WIDTH }}
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, filter: "blur(4px)", x: -4 }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, filter: "blur(0px)", x: 0 }
          }
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, filter: "blur(4px)", x: -4 }
          }
          transition={shouldReduceMotion ? { duration: 0 } : spring}
        >
          <div
            className="btn-bevel btn-bevel-media relative p-1 drop-shadow-xl"
            style={{ backgroundColor: "var(--background)" }}
          >
            <span className="btn-bevel-frame" />
            <span className="btn-bevel-corner btn-bevel-corner-tl" />
            <span className="btn-bevel-corner btn-bevel-corner-tr" />
            <span className="btn-bevel-corner btn-bevel-corner-bl" />
            <span className="btn-bevel-corner btn-bevel-corner-br" />
            <img
              src={hover.image}
              alt=""
              className="block aspect-[16/10] w-full object-cover"
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
