import { DisconnectModalPreview } from "../../components/showcase/DisconnectModalPreview";
import type { ComponentEntry } from "./types";

export const disconnectModal: ComponentEntry = {
  id: "disconnect-modal",
  name: "Disconnect Modal",
  description:
    "A wallet management modal with spring slide-up animation, balance display, backdrop blur, and a checkmark disconnect animation.",
  preview: <DisconnectModalPreview />,
  code: `import { useState } from "react";
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

interface DisconnectModalProps {
  address?: string;
  balance?: string;
  network?: string;
  onDisconnect?: () => void;
}

export default function DisconnectModal({
  address = "7nYB...x4Kq",
  balance = "4.2081",
  network = "Solana Mainnet",
  onDisconnect,
}: DisconnectModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [disconnected, setDisconnected] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const handleDisconnect = () => {
    setShowCheck(true);
    setTimeout(() => {
      setDisconnected(true);
      onDisconnect?.();
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
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        style={{
          padding: "10px 20px",
          borderRadius: 12,
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          color: "#e5e5e5",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
        }}
        whileTap={{ scale: 0.97 }}
      >
        Manage Wallet
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              padding: "0 16px 16px",
            }}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
          >
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(8px)",
              }}
              onClick={() => !showCheck && setIsOpen(false)}
            />

            <motion.div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 380,
                borderRadius: 16,
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                overflow: "hidden",
              }}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 16,
                borderBottom: "1px solid #2a2a2a",
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#e5e5e5" }}>Wallet</span>
                <button
                  onClick={() => !showCheck && setIsOpen(false)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                    border: "none",
                    color: "#888",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ padding: 20 }}>
                <AnimatePresence mode="wait">
                  {showCheck && disconnected ? (
                    <motion.div
                      key="success"
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "16px 0" }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <motion.div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          background: "rgba(34,197,94,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 28,
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
                      >
                        ✓
                      </motion.div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: "#e5e5e5" }}>Disconnected</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                        <div style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                          color: "white",
                        }}>
                          ◈
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#e5e5e5" }}>{address}</div>
                          <div style={{ fontSize: 12, color: "#888" }}>{network}</div>
                        </div>
                      </div>

                      <div style={{
                        padding: 16,
                        borderRadius: 12,
                        background: "#222",
                        marginBottom: 20,
                      }}>
                        <span style={{ fontSize: 12, color: "#888" }}>Balance</span>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
                          <span style={{ fontSize: 24, fontWeight: 700, color: "#e5e5e5" }}>{balance}</span>
                          <span style={{ fontSize: 14, color: "#888" }}>SOL</span>
                        </div>
                      </div>

                      <motion.button
                        onClick={handleDisconnect}
                        disabled={showCheck}
                        style={{
                          width: "100%",
                          padding: "10px 0",
                          borderRadius: 12,
                          fontSize: 14,
                          fontWeight: 500,
                          cursor: "pointer",
                          background: "rgba(239,68,68,0.1)",
                          color: "#ef4444",
                          border: "1px solid rgba(239,68,68,0.2)",
                          opacity: showCheck ? 0.5 : 1,
                        }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {showCheck ? "Disconnecting..." : "Disconnect Wallet"}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}`,
  npmCommand: "npm install framer-motion",
  props: [
    { name: "address", type: "string", required: false, description: "Wallet address to display. Default: '7nYB...x4Kq'" },
    { name: "balance", type: "string", required: false, description: "Wallet balance to display. Default: '4.2081'" },
    { name: "network", type: "string", required: false, description: "Network name. Default: 'Solana Mainnet'" },
    { name: "onDisconnect", type: "() => void", required: false, description: "Callback when wallet is disconnected" },
  ],
};
