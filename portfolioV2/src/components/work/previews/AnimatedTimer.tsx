import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const DIGIT_HEIGHT = 72;
const easeOut = [0.23, 1, 0.32, 1] as const;

const AnimatedDigit = ({ digit = "0", index }: { digit?: string; index: number }) => (
  <motion.div
    className="relative flex cursor-default justify-center overflow-hidden rounded-xl border border-border bg-background shadow-sm"
    style={{ height: DIGIT_HEIGHT, width: DIGIT_HEIGHT * 0.75 }}
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
      animate={{ transform: `translateY(${-Number(digit) * DIGIT_HEIGHT}px)` }}
      transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.8 }}
    >
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <div
          key={num}
          className="flex w-full shrink-0 items-center justify-center text-[2rem] font-medium text-foreground"
          style={{ height: DIGIT_HEIGHT }}
        >
          {num}
        </div>
      ))}
    </motion.div>
  </motion.div>
);

const Colon = ({ index }: { index: number }) => (
  <motion.div
    className="text-[2rem] font-medium text-foreground/50"
    initial={{ opacity: 0, transform: "scale(0.95)" }}
    animate={{ opacity: 1, transform: "scale(1)" }}
    transition={{ duration: 0.2, ease: easeOut, delay: index * 0.04 }}
  >
    :
  </motion.div>
);

export const AnimatedTimerPreview = () => {
  const [time, setTime] = useState(new Date());
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const h = time.getHours().toString().padStart(2, "0");
  const m = time.getMinutes().toString().padStart(2, "0");
  const s = time.getSeconds().toString().padStart(2, "0");

  return (
    <div className="flex w-full items-center justify-center gap-4 tabular-nums">
      <div className="flex gap-1.5">
        <AnimatedDigit digit={h[0]} index={0} />
        <AnimatedDigit digit={h[1]} index={1} />
      </div>
      <Colon index={2} />
      <div className="flex gap-1.5">
        <AnimatedDigit digit={m[0]} index={3} />
        <AnimatedDigit digit={m[1]} index={4} />
      </div>
      <Colon index={5} />
      <div className="flex gap-1.5">
        {shouldReduceMotion ? (
          <>
            <span className="flex items-center justify-center rounded-xl border border-border bg-background text-[2rem] font-medium" style={{ height: DIGIT_HEIGHT, width: DIGIT_HEIGHT * 0.75 }}>{s[0]}</span>
            <span className="flex items-center justify-center rounded-xl border border-border bg-background text-[2rem] font-medium" style={{ height: DIGIT_HEIGHT, width: DIGIT_HEIGHT * 0.75 }}>{s[1]}</span>
          </>
        ) : (
          <>
            <AnimatedDigit digit={s[0]} index={6} />
            <AnimatedDigit digit={s[1]} index={7} />
          </>
        )}
      </div>
    </div>
  );
};
