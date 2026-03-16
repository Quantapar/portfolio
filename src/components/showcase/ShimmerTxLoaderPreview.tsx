import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TxState = "idle" | "pending" | "confirming" | "confirmed";

export const ShimmerTxLoaderPreview = () => {
  const [state, setState] = useState<TxState>("idle");

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
      const t = setTimeout(() => setState("idle"), 2500);
      return () => clearTimeout(t);
    }
  }, [state]);

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
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-2xl bg-(--bg-secondary) border border-(--border-color) p-5 space-y-4">

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-(--text-primary)">Transaction</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={state}
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                background:
                  state === "confirmed"
                    ? "#00FFA320"
                    : state === "idle"
                      ? "var(--bg-tertiary)"
                      : "#9945FF20",
                color:
                  state === "confirmed"
                    ? "#00FFA3"
                    : state === "idle"
                      ? "var(--text-muted)"
                      : "#9945FF",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {label}
            </motion.span>
          </AnimatePresence>
        </div>


        <div className="relative h-3 rounded-full overflow-hidden bg-(--bg-tertiary)">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: "linear-gradient(90deg, #9945FF, #14F195)",
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
          {(state === "pending" || state === "confirming") && (
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
              transition={{
                duration: shimmerDuration,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}
        </div>


        <div className="flex items-center justify-center h-16">
          <AnimatePresence mode="wait">
            {state === "confirmed" ? (
              <motion.div
                key="check"
                className="flex items-center justify-center w-12 h-12 rounded-full"
                style={{ background: "#14F19520", border: "1px solid #14F19540" }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#14F195"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                >
                  <motion.path
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                  />
                </motion.svg>
              </motion.div>
            ) : state !== "idle" ? (
              <motion.div
                key="spinner"
                className="w-8 h-8 rounded-full"
                style={{
                  border: "2px solid var(--border-color)",
                  borderTopColor: "#9945FF",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-(--text-muted)"
              >
                Press Simulate Tx to begin
              </motion.div>
            )}
          </AnimatePresence>
        </div>


        <div className="text-xs text-(--text-muted) font-mono text-center truncate">
          {state !== "idle"
            ? "5KtPn1...vGx7Rp9dEHjkF3Q"
            : "\u00A0"}
        </div>


        <motion.button
          className="w-full py-3 rounded-xl text-sm font-medium text-white cursor-pointer"
          style={{
            background: state === "idle" ? "linear-gradient(135deg, #9945FF, #14F195)" : "var(--bg-tertiary)",
            color: state === "idle" ? "white" : "var(--text-muted)",
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
};
