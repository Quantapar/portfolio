import type { ButtonHTMLAttributes } from "react";
import "./sunset-button.css";

/* The soundtrack button as a little Vice City evening, in the colours of the VI logo,
   built as a real object: a glossy pill of tinted glass with the evening inside it. At rest: a sunset sky with a striped sun peeking up under the label.
   Hover: the sun sinks into dusk. Playing: night falls, stars come out and the label
   lights up in neon. */

// Stars as [left %, top %, size px, twinkle delay s].
const STARS: [number, number, number, number][] = [
  [24, 18, 1.5, 0.9],
  [33, 34, 1.5, 1.6],
  [41, 14, 2, 0.4],
  [52, 24, 1.5, 1.2],
  [60, 12, 2, 2.1],
  [68, 30, 1.5, 0.7],
  [47, 40, 1, 2.5],
  [29, 46, 1, 1.1],
  [74, 44, 1, 0.3],
];

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { playing: boolean };

export function SunsetButton({
  playing,
  children,
  className,
  ...props
}: Props) {
  return (
    <button
      type="button"
      className={className ? `sb ${className}` : "sb"}
      data-playing={playing || undefined}
      aria-pressed={playing}
      {...props}
    >
      <span className="sb-scene" aria-hidden="true">
        <span className="sb-sky" />
        <span className="sb-night" />
        <span className="sb-stars">
          {STARS.map(([x, y, s, d]) => (
            <i
              key={`${x}-${y}`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: s,
                height: s,
                animationDelay: `${d}s`,
              }}
            />
          ))}
        </span>
        <span className="sb-sun" />
        <span className="sb-glow" />
        <span className="sb-gloss" />
      </span>
      <span className="sb-label">{children}</span>
    </button>
  );
}
