import { ProgressStakeCardPreview } from "../../components/showcase/ProgressStakeCardPreview";
import type { ComponentEntry } from "./types";

export const progressStakeCard: ComponentEntry = {
  id: "progress-stake-card",
  name: "Progress Stake Card",
  description:
    "A staking dashboard card with animated progress bar, counting-up yield estimate, and a hover-reveal unstake section.",
  preview: <ProgressStakeCardPreview />,
  code: `import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";

interface ProgressStakeCardProps {
  staked?: number;
  apy?: number;
  earned?: number;
  progress?: number;
  onUnstake?: () => void;
}

export default function ProgressStakeCard({
  staked = 150,
  apy = 7.2,
  earned = 4.3218,
  progress = 67,
  onUnstake,
}: ProgressStakeCardProps) {
  const [showUnstake, setShowUnstake] = useState(false);
  const earnedValue = useMotionValue(0);
  const earnedDisplay = useTransform(earnedValue, (v) => v.toFixed(4));
  const [earnedText, setEarnedText] = useState("0.0000");

  useEffect(() => {
    const controls = animate(earnedValue, earned, { duration: 2.5, ease: "easeOut" });
    const unsub = earnedDisplay.on("change", (v) => setEarnedText(v));
    return () => { controls.stop(); unsub(); };
  }, [earned]);

  return (
    <div style={{ maxWidth: 384, margin: "0 auto" }}>
      <motion.div
        style={{ borderRadius: 16, background: "#1a1a1a", border: "1px solid #2a2a2a", padding: 20, display: "flex", flexDirection: "column", gap: 20, cursor: "pointer" }}
        onHoverStart={() => setShowUnstake(true)}
        onHoverEnd={() => setShowUnstake(false)}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #9945FF30, #14F19530)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9945FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
            </div>
            <div>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#e5e5e5" }}>SOL Staking</span>
              <div style={{ fontSize: 11, color: "#888" }}>Epoch 420</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "#888" }}>APY</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#14F195" }}>{apy}%</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ borderRadius: 12, background: "#222", padding: 12 }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Staked</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#e5e5e5" }}>{staked} SOL</div>
          </div>
          <div style={{ borderRadius: 12, background: "#222", padding: 12 }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Earned</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#14F195" }}>{earnedText} SOL</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
            <span style={{ color: "#888" }}>Staking period</span>
            <span style={{ color: "#ccc", fontWeight: 500 }}>{progress}%</span>
          </div>
          <div style={{ position: "relative", height: 10, borderRadius: 999, overflow: "hidden", background: "#333" }}>
            <motion.div
              style={{ position: "absolute", inset: "0 auto 0 0", borderRadius: 999, background: "linear-gradient(90deg, #9945FF, #14F195)" }}
              initial={{ width: 0 }}
              animate={{ width: \`\${progress}%\` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <motion.div
              style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", width: 16, height: 16, borderRadius: "50%", background: "#14F195", filter: "blur(6px)", opacity: 0.6 }}
              initial={{ left: 0 }}
              animate={{ left: \`calc(\${progress}% - 8px)\` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888" }}>
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
              style={{ overflow: "hidden" }}
            >
              <div style={{ paddingTop: 4, borderTop: "1px solid #2a2a2a" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0" }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#888" }}>Unstaking cooldown</div>
                    <div style={{ fontSize: 14, color: "#ccc", fontWeight: 500 }}>~2 epochs (~4 days)</div>
                  </div>
                  <motion.button
                    style={{ padding: "8px 16px", borderRadius: 12, fontSize: 12, fontWeight: 500, background: "#FF453A20", color: "#FF453A", border: "1px solid #FF453A30", cursor: "pointer" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onUnstake}
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
}`,
  npmCommand: "npm install framer-motion",
  props: [
    { name: "staked", type: "number", required: false, description: "Amount of SOL staked. Default: 150" },
    { name: "apy", type: "number", required: false, description: "Annual percentage yield. Default: 7.2" },
    { name: "earned", type: "number", required: false, description: "SOL earned so far (animates on mount). Default: 4.3218" },
    { name: "progress", type: "number", required: false, description: "Staking period progress 0-100. Default: 67" },
    { name: "onUnstake", type: "() => void", required: false, description: "Callback when Unstake button is clicked" },
  ],
};
