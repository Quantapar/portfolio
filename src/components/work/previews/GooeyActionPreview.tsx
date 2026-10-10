import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./gooey-action.css";

const glyphPaths = {
  O: "M50 15 C27 15 16 31 16 50 C16 72 29 85 50 85 C71 85 84 71 84 50 C84 29 72 15 50 15 Z",
  F: "M76 18 L24 18 L24 84 M24 50 L65 50",
  N: "M18 84 L18 18 L82 84 L82 18",
} as const;

const liquidPoints = Array.from({ length: 35 }, (_, index) => {
  const row = Math.floor(index / 5);

  return {
    x: -8 + (index % 5) * 94 + (((index * 17) % 9) - 4) * 1.6,
    y: 5 + row * 24.5 + (((index * 29) % 7) - 3) * 1.2,
    row,
    radius: 72 + ((index * 11) % 5) * 2,
    delayOffset: ((index * 29) % 7) * 0.007,
    durationOffset: ((index * 19) % 5) * 0.035,
  };
});

type GooeyGlyphProps = {
  char: keyof typeof glyphPaths | null;
  reduceMotion: boolean;
};

function GooeyGlyph({ char, reduceMotion }: GooeyGlyphProps) {
  const filterId = `gooey-glyph-${useId().replace(/:/g, "")}`;
  const pathRef = useRef<SVGPathElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const initializedRef = useRef(false);
  const path = char ? glyphPaths[char] : "";

  useEffect(() => {
    const guide = pathRef.current;
    const circles = Array.from(
      groupRef.current?.querySelectorAll("circle") ?? [],
    );
    const targets = circles.map((_, index) => {
      if (!guide || !path) return { x: 50, y: 50, r: 0 };

      const length = guide.getTotalLength();
      const point = guide.getPointAtLength((length * index) / circles.length);
      return { x: point.x, y: point.y, r: 5.8 };
    });

    if (reduceMotion || !initializedRef.current) {
      circles.forEach((circle, index) => {
        const target = targets[index];
        circle.setAttribute("cx", String(target.x));
        circle.setAttribute("cy", String(target.y));
        circle.setAttribute("r", String(target.r));
      });
      initializedRef.current = true;
      return;
    }

    const starts = circles.map((circle) => ({
      x: Number(circle.getAttribute("cx") ?? 50),
      y: Number(circle.getAttribute("cy") ?? 50),
      r: Number(circle.getAttribute("r") ?? 5.8),
    }));
    const startedAt = performance.now();
    const duration = 720;
    const stagger = 6;
    let animationFrame = 0;

    const update = (now: number) => {
      let isComplete = true;

      circles.forEach((circle, index) => {
        const progress = Math.min(
          1,
          Math.max(0, (now - startedAt - index * stagger) / duration),
        );
        const eased = progress * progress * (3 - 2 * progress);
        const start = starts[index];
        const target = targets[index];

        circle.setAttribute(
          "cx",
          String(start.x + (target.x - start.x) * eased),
        );
        circle.setAttribute(
          "cy",
          String(start.y + (target.y - start.y) * eased),
        );
        circle.setAttribute(
          "r",
          String(start.r + (target.r - start.r) * eased),
        );

        if (progress < 1) isComplete = false;
      });

      if (!isComplete) animationFrame = window.requestAnimationFrame(update);
    };

    animationFrame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [path, reduceMotion]);

  return (
    <svg
      className="gooey-action__glyph"
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <defs>
        <filter
          id={filterId}
          x="-20"
          y="-20"
          width="140"
          height="140"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -14"
          />
        </filter>
      </defs>

      <path ref={pathRef} d={path} fill="none" stroke="none" />
      <g ref={groupRef} filter={`url(#${filterId})`} fill="currentColor">
        {Array.from({ length: 38 }, (_, index) => (
          <circle key={index} cx="50" cy="50" r="5.8" />
        ))}
      </g>
    </svg>
  );
}

export function GooeyActionPreview() {
  const reduceMotion = Boolean(useReducedMotion());
  const filterId = `gooey-action-fill-${useId().replace(/:/g, "")}`;
  const [active, setActive] = useState(false);
  const [shadowTransitioning, setShadowTransitioning] = useState(false);
  const shadowTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (shadowTimerRef.current !== null) {
        window.clearTimeout(shadowTimerRef.current);
      }
    },
    [],
  );

  const toggle = () => {
    if (!reduceMotion) {
      setShadowTransitioning(true);

      if (shadowTimerRef.current !== null) {
        window.clearTimeout(shadowTimerRef.current);
      }

      shadowTimerRef.current = window.setTimeout(() => {
        setShadowTransitioning(false);
        shadowTimerRef.current = null;
      }, 800);
    }

    setActive((current) => !current);
  };

  return (
    <section
      className="gooey-action-stage"
      aria-label="Gooey text button demonstration"
    >
      <motion.button
        className="gooey-action"
        type="button"
        aria-pressed={active}
        aria-label={active ? "Reset gooey button" : "Activate gooey button"}
        data-state={active ? "on" : "off"}
        data-shadow-transition={shadowTransitioning ? "true" : undefined}
        onClick={toggle}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 32,
          mass: 0.45,
        }}
      >
        <svg
          className="gooey-action__liquid"
          viewBox="0 0 360 158"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <filter
              id={filterId}
              x="-80"
              y="-80"
              width="520"
              height="318"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="11"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -15"
              />
            </filter>
          </defs>

          <g filter={`url(#${filterId})`} fill="#d6d6d6">
            {liquidPoints.map((point) => {
              const delayIndex = active ? point.row : 6 - point.row;

              return (
                <motion.circle
                  key={`${point.x}-${point.y}`}
                  cx={point.x}
                  cy={point.y}
                  initial={false}
                  animate={{ r: active ? point.radius : 0 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : {
                          duration: 0.72 + point.durationOffset,
                          delay: delayIndex * 0.045 + point.delayOffset,
                          ease: [0.45, 0, 0.55, 1],
                        }
                  }
                />
              );
            })}
          </g>
        </svg>

        <span className="gooey-action__label" aria-hidden="true">
          <motion.span
            className="gooey-action__glyph-slot"
            animate={{ x: active ? -26.5 : -45.25 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.72, ease: [0.45, 0, 0.55, 1] }
            }
          >
            <GooeyGlyph char="O" reduceMotion={reduceMotion} />
          </motion.span>
          <motion.span
            className="gooey-action__glyph-slot"
            animate={{ x: active ? 27.75 : 5.1 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.72, ease: [0.45, 0, 0.55, 1] }
            }
          >
            <GooeyGlyph char={active ? "N" : "F"} reduceMotion={reduceMotion} />
          </motion.span>
          <motion.span
            className="gooey-action__glyph-slot"
            animate={{ x: 50.4 }}
            transition={{ duration: 0 }}
          >
            <GooeyGlyph
              char={active ? null : "F"}
              reduceMotion={reduceMotion}
            />
          </motion.span>
        </span>
      </motion.button>
    </section>
  );
}
