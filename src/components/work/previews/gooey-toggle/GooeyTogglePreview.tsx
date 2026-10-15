import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./gooey-toggle.css";

const gooeyTogglePoints = Array.from(
  { length: 28 },
  (_, index) => 28 + (304 / 27) * index,
);

export function GooeyTogglePreview() {
  const reduceMotion = useReducedMotion();
  const filterId = `gooey-toggle-${useId().replace(/:/g, "")}`;
  const [enabled, setEnabled] = useState(false);
  const targetX = enabled ? 266 : 94;

  return (
    <section
      id="gooey-toggle-demo"
      className="gooey-toggle-demo"
      aria-label="Gooey toggle"
    >
      <motion.button
        type="button"
        className="gooey-toggle"
        role="switch"
        aria-checked={enabled}
        aria-label="Toggle setting"
        data-state={enabled ? "on" : "off"}
        onClick={() => setEnabled((current) => !current)}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 38,
          mass: 0.6,
        }}
      >
        <svg
          className="gooey-toggle__visual"
          viewBox="0 0 360 180"
          aria-hidden="true"
        >
          <defs>
            <filter
              id={filterId}
              x="-35%"
              y="-70%"
              width="170%"
              height="240%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="20"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -15"
              />
            </filter>
            <linearGradient id={`${filterId}-track`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e8eaf0" />
              <stop offset="1" stopColor="#d9dce5" />
            </linearGradient>
            <clipPath id={`${filterId}-clip`}>
              <rect x="10" y="6" width="340" height="168" rx="84" />
            </clipPath>
          </defs>

          <rect
            className="gooey-switch__track"
            x="10"
            y="6"
            width="340"
            height="168"
            rx="84"
            fill={`url(#${filterId}-track)`}
          />

          <motion.rect
            className="gooey-switch__active-track"
            x="10"
            y="6"
            width="340"
            height="168"
            rx="84"
            initial={false}
            animate={{ opacity: enabled ? 1 : 0 }}
            transition={{
              duration: reduceMotion ? 0 : enabled ? 0.1 : 0.07,
              delay: reduceMotion || !enabled ? 0 : 0.78,
              ease: [0.16, 1, 0.3, 1],
            }}
          />

          <g clipPath={`url(#${filterId}-clip)`}>
            <g filter={`url(#${filterId})`} fill="#111111">
              {gooeyTogglePoints.map((point, index) => {
                const delayIndex = enabled
                  ? index
                  : gooeyTogglePoints.length - index - 1;
                const delay = delayIndex * 0.009;

                return (
                <motion.circle
                  key={point}
                  cy="90"
                  initial={false}
                  animate={{
                    cx: enabled ? point : 94,
                    r: enabled ? 110 : 42,
                  }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : {
                          cx: {
                            duration: 0.62,
                            ease: [0.16, 1, 0.3, 1],
                            delay,
                          },
                          r: {
                            duration: 0.62,
                            ease: [0.16, 1, 0.3, 1],
                            delay,
                          },
                        }
                  }
                />
                );
              })}
            </g>
          </g>

          <motion.circle
            className="gooey-switch__knob"
            cy="90"
            r="77"
            initial={false}
            animate={{ cx: targetX }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 285,
                    damping: 27,
                    mass: 0.78,
                    delay: 0.045,
                  }
            }
          />
        </svg>
      </motion.button>
    </section>
  );
}

