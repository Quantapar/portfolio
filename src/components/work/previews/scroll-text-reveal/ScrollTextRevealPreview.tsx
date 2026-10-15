import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

const phrase =
  "A well designed experience allows people to focus on what matters without being overwhelmed by unnecessary details. Clear structure, thoughtful spacing, and consistent visual elements help guide attention naturally, making information easier to understand and the overall experience more enjoyable";

const words = phrase.split(" ");
const letterCount = words.reduce((sum, word) => sum + word.length, 0);

function Letter({
  children,
  progress,
  index,
  reduceMotion,
}: {
  children: string;
  progress: MotionValue<number>;
  index: number;
  reduceMotion: boolean;
}) {
  const opacity = useTransform(progress, (v) => {
    const start = index / letterCount;
    const end = (index + 1) / letterCount;

    if (v >= end) return 1;
    if (v <= start) return 0.2;
    return 0.2 + ((v - start) / (end - start)) * 0.8;
  });

  return (
    <motion.span style={{ opacity: reduceMotion ? 1 : opacity }}>
      {children}
    </motion.span>
  );
}

export function ScrollTextRevealPreview() {
  const container = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  let letterIndex = 0;

  return (
    <section
      ref={container}
      className="relative h-[250vh] bg-black text-white"
      style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
      aria-label="Scroll text reveal"
    >
      <div className="sticky top-0 flex h-screen items-center">
        <p className="mx-auto flex w-full max-w-6xl flex-wrap justify-start px-8 text-[clamp(1.35rem,2.8vw,2.25rem)] font-bold leading-none text-white">
          {words.map((word, wordIndex) => (
            <span key={`${word}_${wordIndex}`} className="mr-[0.35em]">
              {word.split("").map((letter, i) => {
                const index = letterIndex++;
                return (
                  <Letter
                    key={`${wordIndex}_${i}`}
                    progress={scrollYProgress}
                    index={index}
                    reduceMotion={reduceMotion}
                  >
                    {letter}
                  </Letter>
                );
              })}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
