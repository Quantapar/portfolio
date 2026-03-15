import { ChainSwitcherPreview } from "../../components/showcase/ChainSwitcherPreview";
import type { ComponentEntry } from "./types";

export const chainSwitcher: ComponentEntry = {
  id: "chain-switcher",
  name: "Chain Switcher",
  description:
    "A horizontal chain selector with brand-colored network icons, fluid rotate + scale animations, and a sliding highlight pill.",
  preview: <ChainSwitcherPreview />,
  code: `import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CHAINS = [
  { id: "bitcoin", name: "Bitcoin", color: "#F7931A", icon: "₿" },
  { id: "ethereum", name: "Ethereum", color: "#343434", icon: "⟠" },
  { id: "solana", name: "Solana", color: "#9945FF", icon: "◎" },
  { id: "base", name: "Base", color: "#0052FF", icon: "⬢" },
  { id: "polygon", name: "Polygon", color: "#6C00F6", icon: "⬡" },
];

interface ChainSwitcherProps {
  defaultChain?: string;
  onSwitch?: (chainId: string) => void;
}

export default function ChainSwitcher({ defaultChain = "bitcoin", onSwitch }: ChainSwitcherProps) {
  const [activeChain, setActiveChain] = useState(
    CHAINS.find((c) => c.id === defaultChain) || CHAINS[0]
  );
  const [switching, setSwitching] = useState(false);

  const handleSwitch = (chain: typeof CHAINS[number]) => {
    if (chain.id === activeChain.id) return;
    setSwitching(true);
    setActiveChain(chain);
    onSwitch?.(chain.id);
    setTimeout(() => setSwitching(false), 500);
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto" }}>
      <div style={{ borderRadius: 16, background: "#1a1a1a", border: "1px solid #2a2a2a", padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#e5e5e5" }}>Network</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <motion.div
              style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span style={{ fontSize: 12, color: "#888" }}>Connected</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, padding: 6, borderRadius: 16, background: "#222" }}>
          {CHAINS.map((chain) => {
            const isActive = activeChain.id === chain.id;
            return (
              <motion.button
                key={chain.id}
                onClick={() => handleSwitch(chain)}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 12px",
                  borderRadius: 12,
                  cursor: "pointer",
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  color: isActive ? chain.color : "#888",
                  fontSize: 18,
                }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 12,
                      background: \`\${chain.color}15\`,
                      border: \`1px solid \${chain.color}30\`,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.span
                  style={{ position: "relative", zIndex: 1 }}
                  animate={{
                    scale: isActive && switching ? [1, 1.3, 1] : 1,
                    rotate: isActive && switching ? [0, 360] : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {chain.icon}
                </motion.span>
                <span style={{ position: "relative", zIndex: 1, fontSize: 10, fontWeight: 500 }}>
                  {chain.name.slice(0, 3)}
                </span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeChain.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 16,
              padding: 12,
              borderRadius: 12,
              background: \`\${activeChain.color}08\`,
              border: \`1px solid \${activeChain.color}20\`,
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: \`\${activeChain.color}20\`,
                fontSize: 16,
                color: activeChain.color,
              }}
            >
              {activeChain.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#e5e5e5" }}>{activeChain.name}</div>
              <div style={{ fontSize: 12, color: "#888" }}>Chain ID: {activeChain.id}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}`,
  npmCommand: "npm install framer-motion",
  props: [
    { name: "defaultChain", type: "string", required: false, description: "Default active chain ID. Default: 'bitcoin'" },
    { name: "onSwitch", type: "(chainId: string) => void", required: false, description: "Callback when a chain is selected" },
  ],
};
