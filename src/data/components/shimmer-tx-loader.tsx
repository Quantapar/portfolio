import { ShimmerTxLoaderPreview } from "../../components/showcase/ShimmerTxLoaderPreview";
import type { ComponentEntry } from "./types";

export const shimmerTxLoader: ComponentEntry = {
  id: "shimmer-tx-loader",
  name: "Shimmer Tx Loader",
  description:
    "A transaction loading indicator with gradient shimmer wave animation, cycling through Pending, Confirming, and Confirmed states with a checkmark bloom.",
  preview: <ShimmerTxLoaderPreview />,
  code: `import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TxState = "idle" | "pending" | "confirming" | "confirmed";

interface ShimmerTxLoaderProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export default function ShimmerTxLoader({ onComplete, autoStart = false }: ShimmerTxLoaderProps) {
  const [state, setState] = useState<TxState>(autoStart ? "pending" : "idle");

  useEffect(() => {
    if (state === "pending") {
      const t = setTimeout(() => setState("confirming"), 2000);
      return () => clearTimeout(t);
    }
    if (state === "confirming") {
      const t = setTimeout(() => setState("confirmed"), 1500);
      return () => clearTimeout(t);
    }
    if (state === "confirmed") {
      onComplete?.();
      const t = setTimeout(() => setState("idle"), 2500);
      return () => clearTimeout(t);
    }
  }, [state, onComplete]);

  const progress = state === "pending" ? 35 : state === "confirming" ? 80 : state === "confirmed" ? 100 : 0;
  const shimmerDuration = state === "confirming" ? 0.6 : 1.2;

  const label =
    state === "pending"
      ? "Pending..."
      : state === "confirming"
        ? "Confirming..."
        : state === "confirmed"
          ? "Confirmed"
          : "Ready";

  return (
    <div style={{ maxWidth: 384, margin: "0 auto" }}>
      <div style={{ borderRadius: 16, background: "#1a1a1a", border: "1px solid #2a2a2a", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#e5e5e5" }}>Transaction</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={state}
              style={{
                fontSize: 12,
                fontWeight: 500,
                padding: "4px 10px",
                borderRadius: 999,
                background: state === "confirmed" ? "#00FFA320" : state === "idle" ? "#333" : "#9945FF20",
                color: state === "confirmed" ? "#00FFA3" : state === "idle" ? "#888" : "#9945FF",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {label}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div style={{ position: "relative", height: 12, borderRadius: 999, overflow: "hidden", background: "#333" }}>
          <motion.div
            style={{ position: "absolute", inset: "0 auto 0 0", borderRadius: 999, background: "linear-gradient(90deg, #9945FF, #14F195)" }}
            animate={{ width: \`\${progress}%\` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
          {(state === "pending" || state === "confirming") && (
            <motion.div
              style={{
                position: "absolute",
                inset: "0 auto 0 0",
                borderRadius: 999,
                width: \`\${progress}%\`,
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
              transition={{ duration: shimmerDuration, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>

        {/* Checkmark / Spinner */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 64 }}>
          <AnimatePresence mode="wait">
            {state === "confirmed" ? (
              <motion.div
                key="check"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: "50%", background: "#14F19520", border: "1px solid #14F19540" }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#14F195" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <motion.path d="M5 13l4 4L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.15 }} />
                </motion.svg>
              </motion.div>
            ) : state !== "idle" ? (
              <motion.div
                key="spinner"
                style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid #333", borderTopColor: "#9945FF" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontSize: 12, color: "#888" }}>
                Press Simulate Tx to begin
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tx hash */}
        <div style={{ fontSize: 12, color: "#888", fontFamily: "monospace", textAlign: "center" }}>
          {state !== "idle" ? "5KtPn1...vGx7Rp9dEHjkF3Q" : "\\u00A0"}
        </div>

        {/* Button */}
        <motion.button
          style={{
            width: "100%",
            padding: "12px 0",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 500,
            border: "none",
            cursor: state === "idle" ? "pointer" : "default",
            background: state === "idle" ? "linear-gradient(135deg, #9945FF, #14F195)" : "#333",
            color: state === "idle" ? "white" : "#888",
          }}
          whileHover={state === "idle" ? { scale: 1.02 } : {}}
          whileTap={state === "idle" ? { scale: 0.98 } : {}}
          onClick={() => state === "idle" && setState("pending")}
          disabled={state !== "idle"}
        >
          {state === "idle" ? "Simulate Tx" : "Processing..."}
        </motion.button>
      </div>
    </div>
  );
}`,
  npmCommand: "npm install framer-motion",
  props: [
    { name: "onComplete", type: "() => void", required: false, description: "Callback fired when the transaction reaches Confirmed state" },
    { name: "autoStart", type: "boolean", required: false, description: "Start the simulation automatically on mount. Default: false" },
  ],
};
