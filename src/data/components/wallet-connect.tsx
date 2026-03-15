import { WalletConnectPreview } from "../../components/showcase/WalletConnectPreview";
import type { ComponentEntry } from "./types";

export const walletConnect: ComponentEntry = {
  id: "wallet-connect",
  name: "Wallet Connect",
  description:
    "A connect wallet button with hover glow pulse, spring-tap feedback, truncated address display, and an animated chain selector.",
  preview: <WalletConnectPreview />,
  code: `import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CHAINS = [
  { id: "bitcoin", name: "Bitcoin", color: "#F7931A", icon: "₿" },
  { id: "ethereum", name: "Ethereum", color: "#343434", icon: "⟠" },
  { id: "solana", name: "Solana", color: "#9945FF", icon: "◎" },
  { id: "usdc", name: "USDC", color: "#2775CA", icon: "$" },
  { id: "polygon", name: "Polygon", color: "#6C00F6", icon: "⬡" },
];

interface WalletConnectProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onChainSwitch?: (chainId: string) => void;
}

export default function WalletConnect({ onConnect, onDisconnect, onChainSwitch }: WalletConnectProps) {
  const [connected, setConnected] = useState(false);
  const [activeChain, setActiveChain] = useState(CHAINS[0]);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (connected) {
      setConnected(false);
      onDisconnect?.();
    } else {
      setConnected(true);
      onConnect?.();
    }
  };

  const handleChainSwitch = (chain: typeof CHAINS[number]) => {
    setActiveChain(chain);
    onChainSwitch?.(chain.id);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div style={{ borderRadius: 16, background: "#1a1a1a", border: "1px solid #2a2a2a", padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <motion.button
            onClick={handleClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            style={{
              position: "relative",
              padding: "12px 24px",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              overflow: "hidden",
              background: connected ? "#2a2a2a" : activeChain.color,
              color: connected ? "#e5e5e5" : "#fff",
              border: \`1px solid \${connected ? "#333" : activeChain.color}\`,
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 12,
                    boxShadow: \`0 0 20px 4px \${activeChain.color}60\`,
                    pointerEvents: "none",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.8, 0.4, 0.8] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.span
                key={connected ? "addr" : "connect"}
                style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", gap: 8 }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                {connected ? (
                  <>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
                    0x1a2...f4b
                  </>
                ) : (
                  "Connect Wallet"
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>

        <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 12, background: "#222" }}>
          {CHAINS.map((chain) => (
            <motion.button
              key={chain.id}
              onClick={() => handleChainSwitch(chain)}
              style={{
                position: "relative",
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 8,
                cursor: "pointer",
                background: "transparent",
                border: "none",
                fontSize: 16,
                opacity: activeChain.id === chain.id ? 1 : 0.5,
                color: activeChain.id === chain.id ? chain.color : "#999",
              }}
              whileTap={{ scale: 0.93 }}
            >
              {activeChain.id === chain.id && (
                <motion.div
                  layoutId="chain-bg"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 8,
                    background: \`\${chain.color}20\`,
                    border: \`1px solid \${chain.color}40\`,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span style={{ position: "relative", zIndex: 1 }}>{chain.icon}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}`,
  npmCommand: "npm install framer-motion",
  props: [
    { name: "onConnect", type: "() => void", required: false, description: "Callback when wallet connects" },
    { name: "onDisconnect", type: "() => void", required: false, description: "Callback when wallet disconnects" },
    { name: "onChainSwitch", type: "(chainId: string) => void", required: false, description: "Callback when chain is switched" },
  ],
};
