import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const DIGIT_HEIGHT = 72;

const AnimatedDigit = ({
  digit = "0",
  index,
}: {
  digit?: string;
  index: number;
}) => (
  <motion.div
    className="relative flex cursor-default justify-center overflow-hidden rounded-xl border border-border bg-background shadow-sm"
    style={{ height: DIGIT_HEIGHT, width: DIGIT_HEIGHT * 0.75 }}
    initial={{ opacity: 0, y: 10, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{
      duration: 0.1,
      opacity: { duration: 0.5, delay: index * 0.08 },
    }}
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
          className="flex w-full shrink-0 items-center justify-center text-[2rem] font-medium text-foreground"
          style={{ height: DIGIT_HEIGHT }}
        >
          {num}
        </div>
      ))}
    </motion.div>
  </motion.div>
);

export const AnimatedCounterPreview = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => (prev + 1) % 1000);
    }, 900);
    return () => clearInterval(timer);
  }, []);

  const digits = count.toString().padStart(3, "0");

  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 tabular-nums">
      <div className="flex gap-1.5">
        <AnimatedDigit digit={digits[0]} index={0} />
        <AnimatedDigit digit={digits[1]} index={1} />
        <AnimatedDigit digit={digits[2]} index={2} />
      </div>
      <p className="text-xs text-foreground/40">Counting up</p>
    </div>
  );
};
