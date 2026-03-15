import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";

export const ProgressStakeCardPreview = () => {
  const [showUnstake, setShowUnstake] = useState(false);

  const earnedValue = useMotionValue(0);
  const earnedDisplay = useTransform(earnedValue, (v) => v.toFixed(4));
  const [earned, setEarned] = useState("0.0000");

  useEffect(() => {
    const controls = animate(earnedValue, 4.3218, {
      duration: 2.5,
      ease: "easeOut",
    });
    const unsub = earnedDisplay.on("change", (v) => setEarned(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, []);

  const stakingProgress = 67;

  return (
    <div className="w-full max-w-sm mx-auto">
      <motion.div
        className="rounded-2xl bg-(--bg-secondary) border border-(--border-color) p-5 space-y-5 cursor-pointer"
        onHoverStart={() => setShowUnstake(true)}
        onHoverEnd={() => setShowUnstake(false)}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #9945FF30, #14F19530)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9945FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-medium text-(--text-primary)">SOL Staking</span>
              <div className="text-[11px] text-(--text-muted)">Epoch 420</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-(--text-muted)">APY</div>
            <div className="text-sm font-semibold" style={{ color: "#14F195" }}>
              7.2%
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-(--bg-tertiary) p-3">
            <div className="text-[11px] text-(--text-muted) mb-1">Staked</div>
            <div className="text-lg font-semibold text-(--text-primary)">150 SOL</div>
          </div>
          <div className="rounded-xl bg-(--bg-tertiary) p-3">
            <div className="text-[11px] text-(--text-muted) mb-1">Earned</div>
            <motion.div className="text-lg font-semibold" style={{ color: "#14F195" }}>
              {earned} SOL
            </motion.div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-(--text-muted)">Staking period</span>
            <span className="text-(--text-secondary) font-medium">{stakingProgress}%</span>
          </div>
          <div className="relative h-2.5 rounded-full overflow-hidden bg-(--bg-tertiary)">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: "linear-gradient(90deg, #9945FF, #14F195)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${stakingProgress}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            {/* Glow effect at the end */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
              style={{
                background: "#14F195",
                filter: "blur(6px)",
                opacity: 0.6,
              }}
              initial={{ left: 0 }}
              animate={{ left: `calc(${stakingProgress}% - 8px)` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-(--text-muted)">
            <span>Jan 15</span>
            <span>~Apr 22</span>
          </div>
        </div>

        {/* Unstake section */}
        <AnimatePresence>
          {showUnstake && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-1 border-t border-(--border-color)">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-xs text-(--text-muted)">Unstaking cooldown</div>
                    <div className="text-sm text-(--text-secondary) font-medium">~2 epochs (~4 days)</div>
                  </div>
                  <motion.button
                    className="px-4 py-2 rounded-xl text-xs font-medium cursor-pointer"
                    style={{
                      background: "#FF453A20",
                      color: "#FF453A",
                      border: "1px solid #FF453A30",
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Unstake
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
