import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import btcLogo from "../../assets/btc-logo.svg";
import solLogo from "../../assets/sol-logo.svg";
import usdcLogo from "../../assets/usdc-logo.svg";
import ethLogo from "../../assets/eth-logo.svg";

const COINS = [
  {
    id: "btc",
    name: "Bitcoin",
    geckoId: "bitcoin",
    bg: "#F7931A",
    icon: (
      <img src={btcLogo} width="22" height="22" alt="" style={{ pointerEvents: "none" }} />
    ),
  },
  {
    id: "sol",
    name: "Solana",
    geckoId: "solana",
    bg: "#1a1a2e",
    icon: (
      <img src={solLogo} width="18" height="18" alt="" style={{ pointerEvents: "none" }} />
    ),
  },
  {
    id: "usdc",
    name: "USDC",
    geckoId: "usd-coin",
    bg: "#2775CA",
    icon: (
      <img src={usdcLogo} width="22" height="22" alt="" style={{ pointerEvents: "none" }} />
    ),
  },
  {
    id: "eth",
    name: "Ethereum",
    geckoId: "ethereum",
    bg: "#627EEA",
    icon: (
      <img src={ethLogo} width="16" height="16" alt="" style={{ pointerEvents: "none" }} />
    ),
  },
];

const FALLBACK_PRICES: Record<string, number> = {
  bitcoin: 87432,
  solana: 140,
  "usd-coin": 1,
  ethereum: 2038,
};

function CornerDot({ className }: { className: string }) {
  return (
    <div
      className={`absolute w-1.5 h-1.5 rounded-full ${className}`}
      style={{ background: "#000" }}
    />
  );
}

export const WalletBalancePreview = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prices, setPrices] = useState<Record<string, number>>(FALLBACK_PRICES);
  const [sent, setSent] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [swapCount, setSwapCount] = useState(0);

  useEffect(() => {
    const ids = COINS.map((c) => c.geckoId).join(",");
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`)
      .then((r) => r.json())
      .then((data) => {
        const p: Record<string, number> = {};
        for (const coin of COINS) {
          if (data[coin.geckoId]?.usd) {
            p[coin.geckoId] = data[coin.geckoId].usd;
          }
        }
        if (Object.keys(p).length > 0) setPrices((prev) => ({ ...prev, ...p }));
      })
      .catch(() => {});
  }, []);

  const activeCoin = COINS[activeIndex]!;
  const price = prices[activeCoin.geckoId] ?? 0;

  const handleSwap = () => {
    setSwapCount((c) => c + 1);
    setSwapping(true);
    setTimeout(() => {
      setActiveIndex((i) => (i + 1) % COINS.length);
      setSwapping(false);
    }, 400);
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(() => setSent(false), 1200);
  };

  const formatPrice = (p: number) => {
    if (p >= 1000) return p.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (p >= 1) return p.toFixed(2);
    return p.toFixed(4);
  };

  return (
    <div className="w-full mx-auto" style={{ maxWidth: 300 }}>
      <div
        className="flex flex-col"
        style={{
          padding: "8px 8px 0",
          borderRadius: 32,
          background: "linear-gradient(145deg, #111 0%, #000 100%)",
          border: "1px solid #333",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset",
        }}
      >
        <div
          className="relative p-5 flex flex-col items-center gap-3 overflow-hidden"
          style={{
            borderRadius: 24,
            background: "#9AFE82",
            boxShadow: "0 4px 12px rgba(154,254,130,0.2)",
          }}
        >
          <CornerDot className="top-3 left-3" />
          <CornerDot className="top-3 right-3" />
          <CornerDot className="bottom-3 left-3" />
          <CornerDot className="bottom-3 right-3" />

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center" style={{ marginLeft: 8 }}>
              {COINS.map((coin, i) => (
                <motion.div
                  key={coin.id}
                  className="rounded-full flex items-center justify-center cursor-pointer"
                  style={{
                    width: 42,
                    height: 42,
                    background: coin.bg,
                    border: "3px solid #000",
                    marginLeft: i > 0 ? -10 : 0,
                    zIndex: COINS.length - i,
                  }}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ y: -8, scale: 1.12, zIndex: 10 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setActiveIndex(i)}
                  transition={{ type: "spring", stiffness: 300, damping: 15, bounce: 0.25, delay: i * 0.06 }}
                >
                  {coin.icon}
                </motion.div>
              ))}
            </div>
            <div className="flex items-center gap-2.5" style={{ marginLeft: 8 }}>
              {COINS.map((coin, i) => (
                <div
                  key={coin.id}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: i === activeIndex ? "#166534" : "rgba(0,0,0,0.15)",
                    transition: "background 0.2s ease",
                    marginLeft: i > 0 ? 22 : 0,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeCoin.id}
                className="text-4xl font-bold tracking-tight"
                style={{ color: "#07610D" }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                ${formatPrice(price)}
              </motion.p>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={activeCoin.id + "-name"}
                className="text-sm mt-0.5"
                style={{ color: "#07610D" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                1 {activeCoin.id.toUpperCase()}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center" style={{ height: 56 }}>
          <motion.button
            className="flex-1 flex items-center justify-center gap-2 cursor-pointer h-full"
            style={{ background: "transparent", border: "none", color: "#fff", fontSize: 15, fontWeight: 500 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSwap}
          >
            <motion.svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ rotate: swapCount * 180 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <path d="M16 3l4 4-4 4" />
              <path d="M20 7H4" />
              <path d="M8 21l-4-4 4-4" />
              <path d="M4 17h16" />
            </motion.svg>
            Swap
          </motion.button>

          <div style={{ width: 1.5, height: 28, background: "#3A3A3A", borderRadius: 1 }} />

          <motion.button
            className="flex-1 flex items-center justify-center gap-2 cursor-pointer h-full"
            style={{ background: "transparent", border: "none", color: "#fff", fontSize: 15, fontWeight: 500 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSend}
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.svg
                  key="check"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  <path d="M20 6L9 17l-5-5" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="send"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <path d="M12 19V5" />
                  <path d="M5 12l7-7 7 7" />
                </motion.svg>
              )}
            </AnimatePresence>
            {sent ? "Sent!" : "Send"}
          </motion.button>
        </div>
      </div>
    </div>
  );
};
