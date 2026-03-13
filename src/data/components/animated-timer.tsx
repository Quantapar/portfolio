import { AnimatedTimerPreview } from "../../components/showcase/AnimatedTimer";
import type { ComponentEntry } from "./types";

export const animatedTimer: ComponentEntry = {
  id: "animated-timer",
  name: "Animated Timer",
  description:
    "An animated digital clock with spring-based digit transitions and interactive hover effects.",
  preview: <AnimatedTimerPreview />,
  code: `import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedDigitProps {
  digit: string;
  index: number;
  height?: number;
  fontSize?: string;
}

const AnimatedDigit = ({
  digit,
  index,
  height = 80,
  fontSize = "2.5rem",
}: AnimatedDigitProps) => (
  <motion.div
    className="rounded-xl overflow-hidden relative flex justify-center shadow-sm cursor-default border"
    style={{ height, width: height * 0.8, backgroundColor: "#424242", borderColor: "#525252" }}
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{
      duration: 0.1,
      opacity: { duration: 0.5, delay: index * 0.08 },
    }}
    whileHover={{
      scale: 1.1,
      y: -4,
      borderColor: "#ffffff",
      transition: { type: "spring", stiffness: 400, damping: 25 },
    }}
  >
    <motion.div
      className="flex flex-col will-change-transform"
      animate={{ y: -Number(digit) * height }}
      transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.8 }}
    >
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <div
          key={num}
          className="shrink-0 w-full flex items-center justify-center font-medium text-zinc-100"
          style={{ height, fontSize }}
        >
          {num}
        </div>
      ))}
    </motion.div>
  </motion.div>
);

interface ColonProps {
  index: number;
  fontSize?: string;
}

const Colon = ({ index, fontSize = "2.5rem" }: ColonProps) => (
  <motion.div
    className="font-medium text-zinc-500 -mt-1 animate-pulse"
    style={{ fontSize }}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay: index * 0.08 }}
  >
    :
  </motion.div>
);

interface AnimatedTimerProps {
  showSeconds?: boolean;
  use24Hour?: boolean;
  digitHeight?: number;
  fontSize?: string;
  gap?: string;
}

export default function AnimatedTimer({
  showSeconds = true,
  use24Hour = true,
  digitHeight = 80,
  fontSize = "2.5rem",
  gap = "1.5rem",
}: AnimatedTimerProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const rawHours = time.getHours();
  const hours = (use24Hour ? rawHours : rawHours % 12 || 12)
    .toString()
    .padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <div className="flex items-center tabular-nums" style={{ gap }}>
      <div className="flex gap-2">
        <AnimatedDigit digit={hours[0]} index={0} height={digitHeight} fontSize={fontSize} />
        <AnimatedDigit digit={hours[1]} index={1} height={digitHeight} fontSize={fontSize} />
      </div>
      <Colon index={2} fontSize={fontSize} />
      <div className="flex gap-2">
        <AnimatedDigit digit={minutes[0]} index={3} height={digitHeight} fontSize={fontSize} />
        <AnimatedDigit digit={minutes[1]} index={4} height={digitHeight} fontSize={fontSize} />
      </div>
      {showSeconds && (
        <>
          <Colon index={5} fontSize={fontSize} />
          <div className="flex gap-2">
            <AnimatedDigit digit={seconds[0]} index={6} height={digitHeight} fontSize={fontSize} />
            <AnimatedDigit digit={seconds[1]} index={7} height={digitHeight} fontSize={fontSize} />
          </div>
        </>
      )}
    </div>
  );
}`,
  npmCommand: "npm install framer-motion",
  props: [
    {
      name: "showSeconds",
      type: "boolean",
      required: false,
      description: "Show seconds digits. Default: true",
    },
    {
      name: "use24Hour",
      type: "boolean",
      required: false,
      description: "Use 24-hour format. Default: true",
    },
    {
      name: "digitHeight",
      type: "number",
      required: false,
      description: "Height of each digit cell in px. Default: 80",
    },
    {
      name: "fontSize",
      type: "string",
      required: false,
      description: "Font size for digits. Default: '2.5rem'",
    },
    {
      name: "gap",
      type: "string",
      required: false,
      description: "Gap between hour/min/sec groups. Default: '1.5rem'",
    },
  ],
};
