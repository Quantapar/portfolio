import { useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import opentypeJs from "opentype.js";

type OpentypeApi = {
  parse: (buffer: ArrayBuffer) => opentypeJs.Font;
};

function getOpentype(): OpentypeApi {
  const mod = opentypeJs as OpentypeApi & { default?: OpentypeApi };
  if (typeof mod.parse === "function") return mod;
  if (mod.default && typeof mod.default.parse === "function") return mod.default;
  throw new Error("opentype.parse is unavailable");
}

type SignatureProps = {
  text?: string;
  color?: string;
  fontSize?: number;
  duration?: number;
  delay?: number;
  className?: string;
  inView?: boolean;
  once?: boolean;
  fontUrl?: string;
};

export function Signature({
  text = "Signature",
  color = "currentColor",
  fontSize = 32,
  duration = 1.5,
  delay = 0,
  className = "",
  inView = false,
  once = true,
  fontUrl = "/LastoriaBoldRegular.otf",
}: SignatureProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(fontSize * 3);
  const horizontalPadding = fontSize * 0.1;
  const maskId = `signature-reveal-${useId().replace(/:/g, "")}`;
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(fontUrl);
        if (!response.ok) {
          throw new Error(`Font fetch failed: ${response.status}`);
        }

        // opentype.js v2: parse(buffer) — load(url) is deprecated/broken
        const buffer = (await response.arrayBuffer()).slice(0);
        const font = getOpentype().parse(buffer);

        const pad = fontSize * 0.1;
        // Docs use fontSize * 1.5 — measure first so tall script ascenders don't clip
        const probeBaseline = fontSize * 1.5;

        let probeX = horizontalPadding;
        let minY = Infinity;
        let maxY = -Infinity;

        for (const char of text) {
          const glyph = font.charToGlyph(char);
          const path = glyph.getPath(probeX, probeBaseline, fontSize);
          const bb = path.getBoundingBox();
          minY = Math.min(minY, bb.y1);
          maxY = Math.max(maxY, bb.y2);
          const advanceWidth = glyph.advanceWidth ?? font.unitsPerEm;
          probeX += advanceWidth * (fontSize / font.unitsPerEm);
        }

        const baseline = probeBaseline + (minY < pad ? pad - minY : 0);

        let x = horizontalPadding;
        const newPaths: string[] = [];
        minY = Infinity;
        maxY = -Infinity;

        for (const char of text) {
          const glyph = font.charToGlyph(char);
          const path = glyph.getPath(x, baseline, fontSize);
          newPaths.push(path.toPathData(3));

          const bb = path.getBoundingBox();
          minY = Math.min(minY, bb.y1);
          maxY = Math.max(maxY, bb.y2);

          const advanceWidth = glyph.advanceWidth ?? font.unitsPerEm;
          x += advanceWidth * (fontSize / font.unitsPerEm);
        }

        if (cancelled) return;

        setPaths(newPaths);
        setWidth(x + horizontalPadding);
        setHeight(maxY + pad);
      } catch (error) {
        console.error("Signature component font load error:", error);
        if (!cancelled) {
          setPaths([]);
          setWidth(text.length * fontSize * 0.6);
          setHeight(fontSize * 3);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [text, fontSize, horizontalPadding, fontUrl]);

  const variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
  };

  return (
    <motion.svg
      key={paths.length}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={`overflow-visible text-foreground ${className}`.trim()}
      // With reduced motion it starts as it would end: already drawn, with nothing left to play.
      initial={shouldReduceMotion ? "visible" : "hidden"}
      whileInView={inView ? "visible" : undefined}
      animate={inView ? undefined : "visible"}
      viewport={{ once }}
      aria-label={text}
      role="img"
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          {paths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="white"
              strokeWidth={fontSize * 0.22}
              fill="none"
              variants={variants}
              transition={{
                pathLength: {
                  delay: delay + i * 0.2,
                  duration,
                  ease: "easeInOut",
                },
                opacity: {
                  delay: delay + i * 0.2 + 0.01,
                  duration: 0.01,
                },
              }}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </mask>
      </defs>

      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={2}
          fill="none"
          variants={variants}
          transition={{
            pathLength: {
              delay: delay + i * 0.2,
              duration,
              ease: "easeInOut",
            },
            opacity: {
              delay: delay + i * 0.2 + 0.01,
              duration: 0.01,
            },
          }}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="butt"
          strokeLinejoin="round"
        />
      ))}

      <g mask={`url(#${maskId})`}>
        {paths.map((d, i) => (
          <path key={i} d={d} fill={color} />
        ))}
      </g>
    </motion.svg>
  );
}
