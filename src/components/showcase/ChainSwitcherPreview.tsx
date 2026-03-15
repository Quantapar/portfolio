import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CHAINS = [
  { id: "bitcoin", name: "Bitcoin", color: "#F7931A", icon: (
    <svg width="20" height="20" viewBox="0 0 4091.27 4091.73">
      <path fill="#F7931A" fillRule="nonzero" d="M4030.06 2540.77c-273.24 1096.01-1383.32 1763.02-2479.46 1489.71-1095.68-273.24-1762.69-1383.39-1489.33-2479.31 273.12-1096.13 1383.2-1763.19 2479-1489.95 1096.06 273.24 1763.03 1383.51 1489.76 2479.57l.02-.02z" />
      <path fill="white" fillRule="nonzero" d="M2947.77 1754.38c40.72-272.26-166.56-418.61-450-516.24l91.95-368.8-224.5-55.94-89.51 359.09c-59.02-14.72-119.63-28.59-179.87-42.34l90.16-361.46-224.36-55.94-92 368.68c-48.84-11.12-96.81-22.11-143.35-33.69l.26-1.16-309.59-77.31-59.72 239.78c0 0 166.56 38.18 163.05 40.53 90.91 22.69 107.35 82.87 104.62 130.57l-104.74 420.15c6.26 1.59 14.38 3.89 23.34 7.49-7.49-1.86-15.46-3.89-23.73-5.87l-146.81 588.57c-11.11 27.62-39.31 69.07-102.87 53.33 2.25 3.26-163.17-40.72-163.17-40.72l-111.46 256.98 292.15 72.83c54.35 13.63 107.61 27.89 160.06 41.3l-92.9 373.03 224.24 55.94 92-369.07c61.26 16.63 120.71 31.97 178.91 46.43l-91.69 367.33 224.51 55.94 92.89-372.33c382.82 72.45 670.67 43.24 791.83-303.02 97.63-278.78-4.86-439.58-206.26-544.44 146.69-33.83 257.18-130.31 286.64-329.61l-.07-.05zm-512.93 719.26c-69.38 278.78-538.76 128.08-690.94 90.29l123.28-494.2c152.17 37.99 640.17 113.17 567.67 403.91zm69.43-723.3c-63.29 253.58-453.96 124.75-580.69 93.16l111.77-448.21c126.73 31.59 534.85 90.55 468.94 355.05l-.02 0z" />
    </svg>
  )},
  { id: "ethereum", name: "Ethereum", color: "#343434", icon: (
    <svg width="20" height="20" viewBox="0 0 784.37 1277.39">
      <polygon fill="#343434" fillRule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54" />
      <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,0 0,650.54 392.07,882.29 392.07,472.33" />
      <polygon fill="#3C3C3B" fillRule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89" />
      <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,1277.38 392.07,956.52 0,724.89" />
      <polygon fill="#141414" fillRule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33" />
      <polygon fill="#393939" fillRule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33" />
    </svg>
  )},
  { id: "solana", name: "Solana", color: "#9945FF", icon: (
    <svg width="20" height="20" viewBox="0 0 397.7 311.7" fill="none">
      <defs>
        <linearGradient id="cs-sol-1" x1="360" y1="-37" x2="141" y2="383" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 -1 0 314)">
          <stop offset="0" stopColor="#00FFA3"/><stop offset="1" stopColor="#DC1FFF"/>
        </linearGradient>
        <linearGradient id="cs-sol-2" x1="264" y1="-87" x2="45" y2="333" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 -1 0 314)">
          <stop offset="0" stopColor="#00FFA3"/><stop offset="1" stopColor="#DC1FFF"/>
        </linearGradient>
        <linearGradient id="cs-sol-3" x1="312" y1="-62" x2="92" y2="358" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 -1 0 314)">
          <stop offset="0" stopColor="#00FFA3"/><stop offset="1" stopColor="#DC1FFF"/>
        </linearGradient>
      </defs>
      <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="url(#cs-sol-1)"/>
      <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#cs-sol-2)"/>
      <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#cs-sol-3)"/>
    </svg>
  )},
  { id: "base", name: "Base", color: "#0052FF", icon: (
    <svg width="20" height="20" viewBox="0 0 111 111" fill="none">
      <circle cx="55.5" cy="55.5" r="55.5" fill="#0052FF"/>
      <path d="M55.4 93.3c20.9 0 37.8-16.9 37.8-37.8S76.3 17.7 55.4 17.7c-19.5 0-35.5 14.8-37.5 33.8h49.8v8h-49.8c2 19 18 33.8 37.5 33.8z" fill="white"/>
    </svg>
  )},
  { id: "polygon", name: "Polygon", color: "#6C00F6", icon: (
    <svg width="20" height="20" viewBox="0 0 178 161">
      <path d="M66.8,54.7l-16.7-9.7L0,74.1v58l50.1,29l50.1-29V41.9L128,25.8l27.8,16.1v32.2L128,90.2l-16.7-9.7v25.8l16.7,9.7l50.1-29V29L128,0L77.9,29v90.2l-27.8,16.1l-27.8-16.1V86.9l27.8-16.1l16.7,9.7V54.7z" fill="#6C00F6"/>
    </svg>
  )},
];

export const ChainSwitcherPreview = () => {
  const [activeChain, setActiveChain] = useState<typeof CHAINS[number]>(CHAINS[0]!);
  const [switching, setSwitching] = useState(false);

  const handleSwitch = (chain: typeof CHAINS[number]) => {
    if (chain.id === activeChain.id) return;
    setSwitching(true);
    setActiveChain(chain);
    setTimeout(() => setSwitching(false), 500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl bg-(--bg-secondary) border border-(--border-color) p-5 space-y-4">

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-(--text-primary)">Network</span>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: "#22c55e" }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-xs text-(--text-muted)">Connected</span>
          </div>
        </div>


        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-(--bg-tertiary)">
          {CHAINS.map((chain) => {
            const isActive = activeChain.id === chain.id;
            return (
              <motion.button
                key={chain.id}
                onClick={() => handleSwitch(chain)}
                className="relative flex flex-col items-center gap-1.5 py-2.5 px-3 rounded-xl cursor-pointer flex-1 z-0"
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-chain-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: `${chain.color}15`,
                      border: `1px solid ${chain.color}30`,
                      boxShadow: `0 0 12px ${chain.color}15`,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.div
                  className="relative z-10"
                  style={{ color: isActive ? chain.color : "var(--text-muted)" }}
                  animate={{
                    scale: isActive && switching ? [1, 1.3, 1] : 1,
                    rotate: isActive && switching ? [0, 360] : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {chain.icon}
                </motion.div>
                <motion.span
                  className="relative z-10 text-[10px] font-medium leading-none"
                  style={{ color: isActive ? chain.color : "var(--text-muted)" }}
                  animate={{ opacity: isActive ? 1 : 0.6 }}
                >
                  {chain.name.slice(0, 3)}
                </motion.span>
              </motion.button>
            );
          })}
        </div>


        <AnimatePresence mode="wait">
          <motion.div
            key={activeChain.id}
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{
              background: `${activeChain.color}08`,
              border: `1px solid ${activeChain.color}20`,
            }}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${activeChain.color}20`, color: activeChain.color }}
            >
              {activeChain.icon}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-(--text-primary)">{activeChain.name}</div>
              <div className="text-xs text-(--text-muted)">Chain ID: {activeChain.id}</div>
            </div>
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: activeChain.color }}
              animate={{
                boxShadow: [
                  `0 0 0 0 ${activeChain.color}40`,
                  `0 0 0 6px ${activeChain.color}00`,
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
