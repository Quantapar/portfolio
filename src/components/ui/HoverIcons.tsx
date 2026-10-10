import { motion, useAnimate, useReducedMotion } from "framer-motion";
import { useEffect, type ReactNode } from "react";

type Animate = ReturnType<typeof useAnimate>[1];

type HoverIconProps = {
  className?: string;
};

type IconMotion = {
  start: (animate: Animate) => void;
  stop: (animate: Animate) => void;
};

/** An outline icon that plays its motion while the chip it sits in is hovered. */
function HoverIcon({
  motion: iconMotion,
  className = "",
  children,
}: HoverIconProps & { motion: IconMotion; children: ReactNode }) {
  const [scope, animate] = useAnimate<SVGSVGElement>();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // The whole chip is the hover target, not just the 15px glyph.
    const trigger = scope.current?.closest("a, button");
    if (!trigger || shouldReduceMotion) return;

    const onEnter = () => iconMotion.start(animate);
    const onLeave = () => iconMotion.stop(animate);

    trigger.addEventListener("mouseenter", onEnter);
    trigger.addEventListener("mouseleave", onLeave);

    return () => {
      trigger.removeEventListener("mouseenter", onEnter);
      trigger.removeEventListener("mouseleave", onLeave);
    };
  }, [scope, animate, iconMotion, shouldReduceMotion]);

  return (
    <svg
      ref={scope}
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 overflow-visible ${className}`.trim()}
    >
      {children}
    </svg>
  );
}

function wiggle(degrees: number): IconMotion {
  return {
    start: (animate) => {
      animate(
        ".hover-body",
        { scale: [1, 1.1, 1], rotate: [0, -degrees, degrees, 0] },
        { duration: 0.5, ease: "easeInOut" },
      );
    },
    stop: (animate) => {
      animate(
        ".hover-body",
        { scale: 1, rotate: 0 },
        { duration: 0.2, ease: "easeOut" },
      );
    },
  };
}

const xMotion = wiggle(10);
const githubMotion = wiggle(5);

const linkedInMotion: IconMotion = {
  start: (animate) => {
    animate(
      ".hover-frame",
      { scale: [1, 1.05, 1] },
      { duration: 0.4, ease: "easeInOut" },
    );
    animate(
      ".hover-lines",
      { pathLength: [0, 1] },
      { duration: 0.5, ease: "easeOut" },
    );
  },
  stop: (animate) => {
    animate(
      ".hover-lines, .hover-frame",
      { pathLength: 1, scale: 1 },
      { duration: 0.2 },
    );
  },
};

const calendarMotion: IconMotion = {
  start: (animate) => {
    animate(
      ".hover-rings",
      { scaleY: [1, 0.7, 1] },
      { duration: 0.4, ease: "easeOut" },
    );
    animate(
      ".hover-frame",
      { pathLength: [0, 1], opacity: [0, 1] },
      { duration: 0.5, ease: "easeOut" },
    );
  },
  stop: (animate) => {
    animate(
      ".hover-rings, .hover-frame",
      { pathLength: 1, opacity: 1, scaleY: 1 },
      { duration: 0.2 },
    );
  },
};

const centered = { transformOrigin: "center" };

export function XHoverIcon({ className }: HoverIconProps) {
  return (
    <HoverIcon motion={xMotion} className={className}>
      <motion.g className="hover-body" style={centered}>
        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
      </motion.g>
    </HoverIcon>
  );
}

export function GitHubHoverIcon({ className }: HoverIconProps) {
  return (
    <HoverIcon motion={githubMotion} className={className}>
      <motion.g className="hover-body" style={centered}>
        <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
      </motion.g>
    </HoverIcon>
  );
}

const drawn = { pathLength: 1 };

export function LinkedInHoverIcon({ className }: HoverIconProps) {
  return (
    <HoverIcon motion={linkedInMotion} className={className}>
      <motion.path className="hover-lines" d="M8 11v5" initial={drawn} />
      <motion.path className="hover-lines" d="M8 8v.01" initial={drawn} />
      <motion.path className="hover-lines" d="M12 16v-5" initial={drawn} />
      <motion.path
        className="hover-lines"
        d="M16 16v-3a2 2 0 1 0 -4 0"
        initial={drawn}
      />
      <motion.path
        className="hover-frame"
        d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z"
        style={centered}
      />
    </HoverIcon>
  );
}

const drawnOpaque = { pathLength: 1, opacity: 1 };

export function CalendarHoverIcon({ className }: HoverIconProps) {
  return (
    <HoverIcon motion={calendarMotion} className={className}>
      <motion.path
        className="hover-frame"
        d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z"
        initial={drawnOpaque}
      />
      <motion.path className="hover-rings" d="M8 3v4" style={centered} />
      <motion.path className="hover-rings" d="M16 3v4" style={centered} />
      <motion.path className="hover-frame" d="M4 11h16" initial={drawnOpaque} />
    </HoverIcon>
  );
}
