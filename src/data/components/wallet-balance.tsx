import { WalletBalancePreview } from "../../components/showcase/WalletBalancePreview";
import type { ComponentEntry } from "./types";

export const walletBalance: ComponentEntry = {
  id: "wallet-balance",
  name: "Wallet Balance",
  description:
    "A crypto wallet balance card with stacked coin avatars, animated swap/send actions, and a green profit display.",
  preview: <WalletBalancePreview />,
  code: `import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Coin {
  id: string;
  name: string;
  bg: string;
  icon: React.ReactNode;
}

interface WalletBalanceProps {
  balance?: number;
  change?: number;
  coins?: Coin[];
  onSwap?: () => void;
  onSend?: () => void;
}

const DEFAULT_COINS: Coin[] = [
  { id: "btc", name: "Bitcoin", bg: "#F7931A", icon: <span style={{ color: "#fff", fontWeight: 800, fontFamily: "serif", fontSize: 14 }}>₿</span> },
  { id: "bnb", name: "BNB", bg: "#F0B90B", icon: <span style={{ color: "#fff", fontWeight: 800, fontSize: 12 }}>◆</span> },
  { id: "usdc", name: "USDC", bg: "#2775CA", icon: <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>$</span> },
  { id: "eth", name: "Ethereum", bg: "#627EEA", icon: <span style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>⟠</span> },
];

export default function WalletBalance({
  balance = 12000.00,
  change = 45.32,
  coins = DEFAULT_COINS,
  onSwap,
  onSend,
}: WalletBalanceProps) {
  const [sent, setSent] = useState(false);
  const [swapping, setSwapping] = useState(false);

  const handleSwap = () => {
    setSwapping(true);
    onSwap?.();
    setTimeout(() => setSwapping(false), 800);
  };

  const handleSend = () => {
    setSent(true);
    onSend?.();
    setTimeout(() => setSent(false), 1200);
  };

  return (
    <div style={{ maxWidth: 320, margin: "0 auto" }}>
      <div style={{ borderRadius: 24, background: "#0a0a0a", border: "1px solid #1a1a1a", padding: "12px 12px 0" }}>
        <div style={{ position: "relative", borderRadius: 16, background: "#86EFAC", padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          {[[3, 3], [3, "auto"], ["auto", 3], ["auto", "auto"]].map(([t, l], i) => (
            <div key={i} style={{ position: "absolute", width: 6, height: 6, borderRadius: "50%", background: "rgba(0,0,0,0.25)", top: typeof t === "number" ? t * 4 : "auto", bottom: typeof t === "string" ? 12 : "auto", left: typeof l === "number" ? l * 4 : "auto", right: typeof l === "string" ? 12 : "auto" }} />
          ))}

          <div style={{ display: "flex", alignItems: "center" }}>
            {coins.map((coin, i) => (
              <div
                key={coin.id}
                style={{
                  width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: coin.bg, border: "2px solid #86EFAC", marginLeft: i > 0 ? -8 : 0, zIndex: coins.length - i,
                }}
              >
                {coin.icon}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 36, fontWeight: 700, color: "#166534", margin: 0, letterSpacing: "-0.02em" }}>
              \${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p style={{ fontSize: 14, color: "#15803d", margin: "2px 0 0" }}>
              + \${change.toFixed(2)}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", height: 56 }}>
          <motion.button
            onClick={handleSwap}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "transparent", border: "none", color: "#fff", fontSize: 15, fontWeight: 500, cursor: "pointer", height: "100%" }}
            whileTap={{ scale: 0.96 }}
          >
            <motion.svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              animate={swapping ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </motion.svg>
            Swap
          </motion.button>
          <div style={{ width: 1, height: 20, background: "#333" }} />
          <motion.button
            onClick={handleSend}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "transparent", border: "none", color: "#fff", fontSize: 15, fontWeight: 500, cursor: "pointer", height: "100%" }}
            whileTap={{ scale: 0.96 }}
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.svg key="check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }}>
                  <path d="M20 6L9 17l-5-5" />
                </motion.svg>
              ) : (
                <motion.svg key="send" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  <path d="M12 19V5" /><path d="M5 12l7-7 7 7" />
                </motion.svg>
              )}
            </AnimatePresence>
            {sent ? "Sent!" : "Send"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}`,
  npmCommand: "npm install framer-motion",
  props: [
    { name: "balance", type: "number", required: false, description: "Total wallet balance in USD (default: 12000)" },
    { name: "change", type: "number", required: false, description: "Profit/loss amount in USD (default: 45.32)" },
    { name: "coins", type: "Coin[]", required: false, description: "Array of coin objects with id, name, bg color, and icon" },
    { name: "onSwap", type: "() => void", required: false, description: "Callback when Swap is clicked" },
    { name: "onSend", type: "() => void", required: false, description: "Callback when Send is clicked" },
  ],
};
