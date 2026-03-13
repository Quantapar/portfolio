import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const DIGIT_HEIGHT = 72;

const AnimatedDigit = ({ digit = "0", index }: { digit?: string; index: number }) => (
  <motion.div
    className="rounded-xl overflow-hidden relative flex justify-center shadow-sm cursor-default border bg-(--bg-secondary) border-(--border-color)"
    style={{ height: DIGIT_HEIGHT, width: DIGIT_HEIGHT * 0.75 }}
    initial={{ opacity: 0, y: 10, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.1, opacity: { duration: 0.5, delay: index * 0.08 } }}
    whileHover={{
      scale: 1.1,
      y: -3,
      borderColor: "#ffffff",
      transition: { type: "spring", stiffness: 400, damping: 25 },
    }}
  >
    <motion.div
      className="flex flex-col will-change-transform"
      animate={{ y: -Number(digit) * DIGIT_HEIGHT }}
      transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.8 }}
    >
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <div
          key={num}
          className="shrink-0 w-full flex items-center justify-center text-[2rem] font-medium text-(--text-primary)"
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
    className="text-[2rem] font-medium text-(--text-muted) animate-pulse"
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay: index * 0.08 }}
  >
    :
  </motion.div>
);

export const AnimatedTimerPreview = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const h = time.getHours().toString().padStart(2, "0");
  const m = time.getMinutes().toString().padStart(2, "0");
  const s = time.getSeconds().toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-4 tabular-nums">
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
        <AnimatedDigit digit={s[0]} index={6} />
        <AnimatedDigit digit={s[1]} index={7} />
      </div>
    </div>
  );
};
