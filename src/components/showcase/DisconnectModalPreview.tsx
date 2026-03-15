import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 28 },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.92,
    transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] },
  },
};

export const DisconnectModalPreview = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [disconnected, setDisconnected] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const handleDisconnect = () => {
    setShowCheck(true);
    setTimeout(() => {
      setDisconnected(true);
      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => {
          setDisconnected(false);
          setShowCheck(false);
        }, 300);
      }, 800);
    }, 600);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-2xl bg-(--bg-secondary) border border-(--border-color) p-5 flex flex-col items-center gap-4">
        {/* Wallet info summary */}
        <div className="flex items-center gap-3 w-full p-3 rounded-xl bg-(--bg-tertiary)">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-(--text-primary) truncate">7nYB...x4Kq</div>
            <div className="text-xs text-(--text-muted)">Solana Mainnet</div>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
        </div>

        {/* Connected button */}
        <motion.button
          onClick={() => setIsOpen(true)}
          className="w-full py-2.5 rounded-xl bg-(--bg-tertiary) border border-(--border-color) text-sm font-medium text-(--text-primary) cursor-pointer hover:border-(--text-muted) transition-colors"
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          Manage Wallet
        </motion.button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center pb-4 px-4 sm:items-center sm:pb-0"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
              onClick={() => !showCheck && setIsOpen(false)}
            />

            {/* Modal content */}
            <motion.div
              className="relative w-full max-w-sm rounded-2xl border overflow-hidden"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--border-color)" }}>
                <span className="text-sm font-semibold text-(--text-primary)">Wallet</span>
                <motion.button
                  onClick={() => !showCheck && setIsOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-tertiary) transition-colors cursor-pointer"
                  whileTap={{ scale: 0.9 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-5">
                <AnimatePresence mode="wait">
                  {showCheck && disconnected ? (
                    <motion.div
                      key="success"
                      className="flex flex-col items-center gap-3 py-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <motion.div
                        className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
                      >
                        <motion.svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                          <motion.path
                            d="M20 6L9 17l-5-5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                          />
                        </motion.svg>
                      </motion.div>
                      <span className="text-sm font-medium text-(--text-primary)">Disconnected</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="wallet-info"
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      {/* Avatar + Address */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shrink-0">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                            <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-(--text-primary)">7nYB...x4Kq</div>
                          <div className="text-xs text-(--text-muted)">Solana Mainnet</div>
                        </div>
                      </div>

                      {/* Balance */}
                      <div className="p-4 rounded-xl bg-(--bg-tertiary) space-y-1">
                        <span className="text-xs text-(--text-muted)">Balance</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-(--text-primary)">4.2081</span>
                          <span className="text-sm text-(--text-muted)">SOL</span>
                        </div>
                        <span className="text-xs text-(--text-muted)">$10,225.69</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Disconnect button */}
                {!disconnected && (
                  <motion.button
                    onClick={handleDisconnect}
                    disabled={showCheck}
                    className="w-full py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors disabled:opacity-50"
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      color: "#ef4444",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.15)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {showCheck ? "Disconnecting..." : "Disconnect Wallet"}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
