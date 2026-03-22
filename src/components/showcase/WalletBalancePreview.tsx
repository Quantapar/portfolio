import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COINS = [
  {
    id: "btc",
    name: "Bitcoin",
    bg: "#F7931A",
    icon: (
      <svg width="20" height="20" viewBox="0 0 4091.27 4091.73">
        <path fill="#F7931A" d="M4030.06 2540.77c-273.24 1096.01-1383.32 1763.02-2479.46 1489.71-1095.68-273.24-1762.69-1383.39-1489.33-2479.31 273.12-1096.13 1383.2-1763.19 2479-1489.95 1096.06 273.24 1763.03 1383.51 1489.76 2479.57l.02-.02z" />
        <path fill="white" d="M2947.77 1754.38c40.72-272.26-166.56-418.61-450-516.24l91.95-368.8-224.5-55.94-89.51 359.09c-59.02-14.72-119.63-28.59-179.87-42.34l90.16-361.46-224.36-55.94-92 368.68c-48.84-11.12-96.81-22.11-143.35-33.69l.26-1.16-309.59-77.31-59.72 239.78c0 0 166.56 38.18 163.05 40.53 90.91 22.69 107.35 82.87 104.62 130.57l-104.74 420.15c6.26 1.59 14.38 3.89 23.34 7.49-7.49-1.86-15.46-3.89-23.73-5.87l-146.81 588.57c-11.11 27.62-39.31 69.07-102.87 53.33 2.25 3.26-163.17-40.72-163.17-40.72l-111.46 256.98 292.15 72.83c54.35 13.63 107.61 27.89 160.06 41.3l-92.9 373.03 224.24 55.94 92-369.07c61.26 16.63 120.71 31.97 178.91 46.43l-91.69 367.33 224.51 55.94 92.89-372.33c382.82 72.45 670.67 43.24 791.83-303.02 97.63-278.78-4.86-439.58-206.26-544.44 146.69-33.83 257.18-130.31 286.64-329.61l-.07-.05zm-512.93 719.26c-69.38 278.78-538.76 128.08-690.94 90.29l123.28-494.2c152.17 37.99 640.17 113.17 567.67 403.91zm69.43-723.3c-63.29 253.58-453.96 124.75-580.69 93.16l111.77-448.21c126.73 31.59 534.85 90.55 468.94 355.05l-.02 0z" />
      </svg>
    ),
  },
  {
    id: "bnb",
    name: "BNB",
    bg: "#F0B90B",
    icon: (
      <svg width="18" height="18" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="16" fill="#F0B90B" />
        <path fill="#fff" d="M16 6l-3.5 3.5L16 13l3.5-3.5L16 6zM9.5 12.5L6 16l3.5 3.5L13 16l-3.5-3.5zM22.5 12.5L19 16l3.5 3.5L26 16l-3.5-3.5zM16 19l-3.5 3.5L16 26l3.5-3.5L16 19zM16 13l-3 3 3 3 3-3-3-3z" />
      </svg>
    ),
  },
  {
    id: "usdc",
    name: "USDC",
    bg: "#2775CA",
    icon: (
      <svg width="20" height="20" viewBox="0 0 2000 2000">
        <circle cx="1000" cy="1000" r="1000" fill="#2775CA" />
        <path d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84z" fill="#fff" />
      </svg>
    ),
  },
  {
    id: "eth",
    name: "Ethereum",
    bg: "#627EEA",
    icon: (
      <svg width="20" height="20" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="16" fill="#627EEA" />
        <path fill="#fff" opacity="0.6" d="M16.5 4v8.87l7.5 3.35L16.5 4z" />
        <path fill="#fff" d="M16.5 4L9 16.22l7.5-3.35V4z" />
        <path fill="#fff" opacity="0.6" d="M16.5 21.97v6.03L24 17.62l-7.5 4.35z" />
        <path fill="#fff" d="M16.5 28v-6.03L9 17.62l7.5 10.38z" />
        <path fill="#fff" opacity="0.2" d="M16.5 20.57l7.5-4.35-7.5-3.35v7.7z" />
        <path fill="#fff" opacity="0.6" d="M9 16.22l7.5 4.35v-7.7L9 16.22z" />
      </svg>
    ),
  },
];

function Dot({ className }: { className: string }) {
  return (
    <div
      className={`absolute w-1.5 h-1.5 rounded-full ${className}`}
      style={{ background: "rgba(0,0,0,0.25)" }}
    />
  );
}

export const WalletBalancePreview = () => {
  const [balance] = useState(12000.0);
  const [change] = useState(45.32);
  const [sent, setSent] = useState(false);
  const [swapping, setSwapping] = useState(false);

  const handleSwap = () => {
    setSwapping(true);
    setTimeout(() => setSwapping(false), 800);
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(() => setSent(false), 1200);
  };

  return (
    <div className="w-full mx-auto" style={{ maxWidth: 300 }}>
      <div
        className="rounded-3xl p-4 pb-0 flex flex-col"
        style={{ background: "#000000", border: "3px solid #222" }}
      >
        <div
          className="relative rounded-2xl p-5 flex flex-col items-center gap-3"
          style={{ background: "#86EFAC" }}
        >
          <Dot className="top-3 left-3" />
          <Dot className="top-3 right-3" />
          <Dot className="bottom-3 left-3" />
          <Dot className="bottom-3 right-3" />

          <div className="flex items-center -space-x-2">
            {COINS.map((coin, i) => (
              <motion.div
                key={coin.id}
                className="w-9 h-9 rounded-full flex items-center justify-center border-2"
                style={{
                  background: coin.bg,
                  borderColor: "#86EFAC",
                  zIndex: COINS.length - i,
                }}
                whileHover={{ y: -4, zIndex: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {coin.icon}
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={swapping ? "swapping" : "balance"}
                className="text-4xl font-bold tracking-tight"
                style={{ color: "#166534" }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </motion.p>
            </AnimatePresence>
            <p className="text-sm mt-0.5" style={{ color: "#15803d" }}>
              + ${change.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex items-center" style={{ height: 56 }}>
          <motion.button
            className="flex-1 flex items-center justify-center gap-2 cursor-pointer h-full"
            style={{ background: "transparent", border: "none", color: "#fff", fontSize: 15, fontWeight: 500 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSwap}
          >
            <motion.svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={swapping ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <path d="M21 12a9 9 0 1 1-3-6.7" />
              <path d="M21 4v5h-5" />
            </motion.svg>
            Swap
          </motion.button>

          <div style={{ width: 1, height: 20, background: "#333" }} />

          <motion.button
            className="flex-1 flex items-center justify-center gap-2 cursor-pointer h-full"
            style={{ background: "transparent", border: "none", color: "#fff", fontSize: 15, fontWeight: 500 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSend}
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.svg
                  key="check"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <path d="M20 6L9 17l-5-5" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="send"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <path d="M12 19V5" />
                  <path d="M5 12l7-7 7 7" />
                </motion.svg>
              )}
            </AnimatePresence>
            {sent ? "Sent!" : "Send"}
          </motion.button>
        </div>
      </div>
    </div>
  );
};
