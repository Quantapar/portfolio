import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

const easeOut = [0.23, 1, 0.32, 1] as const;

function AnimatedDigit({
  digit = "0",
  index,
  digitHeight,
  fontSize,
}: {
  digit?: string;
  index: number;
  digitHeight: number;
  fontSize: string;
}) {
  return (
    <motion.div
      className="relative flex shrink-0 cursor-default justify-center overflow-hidden rounded-lg border border-border bg-background shadow-sm sm:rounded-xl"
      style={{ height: digitHeight, width: digitHeight * 0.75 }}
      initial={{ opacity: 0, transform: "translateY(8px) scale(0.95)" }}
      animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
      transition={{
        duration: 0.2,
        ease: easeOut,
        delay: index * 0.04,
      }}
    >
      <motion.div
        className="flex flex-col will-change-transform"
        animate={{ transform: `translateY(${-Number(digit) * digitHeight}px)` }}
        transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.8 }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <div
            key={num}
            className="flex w-full shrink-0 items-center justify-center font-medium text-foreground"
            style={{ height: digitHeight, fontSize }}
          >
            {num}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function Colon({
  index,
  fontSize,
}: {
  index: number;
  fontSize: string;
}) {
  return (
    <motion.div
      className="shrink-0 font-medium text-foreground/50"
      style={{ fontSize }}
      initial={{ opacity: 0, transform: "scale(0.95)" }}
      animate={{ opacity: 1, transform: "scale(1)" }}
      transition={{ duration: 0.2, ease: easeOut, delay: index * 0.04 }}
    >
      :
    </motion.div>
  );
}

export const AnimatedTimerPreview = () => {
  const [time, setTime] = useState(new Date());
  const shouldReduceMotion = useReducedMotion();
  const isNarrow = useMediaQuery("(max-width: 639px)");
  const digitHeight = isNarrow ? 44 : 72;
  const fontSize = isNarrow ? "1.25rem" : "2rem";
  const gapClass = isNarrow ? "gap-2" : "gap-4";
  const digitGap = isNarrow ? "gap-1" : "gap-1.5";

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const h = time.getHours().toString().padStart(2, "0");
  const m = time.getMinutes().toString().padStart(2, "0");
  const s = time.getSeconds().toString().padStart(2, "0");

  const staticDigit = (value: string) => (
    <span
      className="flex shrink-0 items-center justify-center rounded-lg border border-border bg-background font-medium sm:rounded-xl"
      style={{
        height: digitHeight,
        width: digitHeight * 0.75,
        fontSize,
      }}
    >
      {value}
    </span>
  );

  return (
    <div
      className={`flex w-full max-w-full items-center justify-center overflow-x-auto tabular-nums ${gapClass}`}
    >
      <div className={`flex ${digitGap}`}>
        <AnimatedDigit digit={h[0]} index={0} digitHeight={digitHeight} fontSize={fontSize} />
        <AnimatedDigit digit={h[1]} index={1} digitHeight={digitHeight} fontSize={fontSize} />
      </div>
      <Colon index={2} fontSize={fontSize} />
      <div className={`flex ${digitGap}`}>
        <AnimatedDigit digit={m[0]} index={3} digitHeight={digitHeight} fontSize={fontSize} />
        <AnimatedDigit digit={m[1]} index={4} digitHeight={digitHeight} fontSize={fontSize} />
      </div>
      <Colon index={5} fontSize={fontSize} />
      <div className={`flex ${digitGap}`}>
        {shouldReduceMotion ? (
          <>
            {staticDigit(s[0]!)}
            {staticDigit(s[1]!)}
          </>
        ) : (
          <>
            <AnimatedDigit digit={s[0]} index={6} digitHeight={digitHeight} fontSize={fontSize} />
            <AnimatedDigit digit={s[1]} index={7} digitHeight={digitHeight} fontSize={fontSize} />
          </>
        )}
      </div>
    </div>
  );
};
