import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

const TOKENS = [
  {
    symbol: "ETH",
    name: "Ethereum",
    coingeckoId: "ethereum",
    icon: (
      <svg width="18" height="18" viewBox="0 0 784.37 1277.39">
        <polygon fill="#343434" fillRule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54" />
        <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,0 0,650.54 392.07,882.29 392.07,472.33" />
        <polygon fill="#3C3C3B" fillRule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89" />
        <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,1277.38 392.07,956.52 0,724.89" />
        <polygon fill="#141414" fillRule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33" />
        <polygon fill="#393939" fillRule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33" />
      </svg>
    ),
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    coingeckoId: "usd-coin",
    icon: (
      <svg width="18" height="18" viewBox="0 0 2000 2000">
        <path d="M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000z" fill="#2775ca" />
        <path d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84z" fill="#fff" />
        <path d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5zM1229.17 295.83c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67z" fill="#fff" />
      </svg>
    ),
  },
  {
    symbol: "SOL",
    name: "Solana",
    coingeckoId: "solana",
    icon: (
      <svg width="18" height="18" viewBox="0 0 397.7 311.7" fill="none">
        <defs>
          <linearGradient id="sol-1" gradientUnits="userSpaceOnUse" x1="360.879" y1="-37.455" x2="141.213" y2="383.294" gradientTransform="matrix(1 0 0 -1 0 314)">
            <stop offset="0" stopColor="#00FFA3" /><stop offset="1" stopColor="#DC1FFF" />
          </linearGradient>
          <linearGradient id="sol-2" gradientUnits="userSpaceOnUse" x1="264.829" y1="-87.601" x2="45.163" y2="333.148" gradientTransform="matrix(1 0 0 -1 0 314)">
            <stop offset="0" stopColor="#00FFA3" /><stop offset="1" stopColor="#DC1FFF" />
          </linearGradient>
          <linearGradient id="sol-3" gradientUnits="userSpaceOnUse" x1="312.548" y1="-62.688" x2="92.882" y2="358.061" gradientTransform="matrix(1 0 0 -1 0 314)">
            <stop offset="0" stopColor="#00FFA3" /><stop offset="1" stopColor="#DC1FFF" />
          </linearGradient>
        </defs>
        <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 237.9z" fill="url(#sol-1)" />
        <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#sol-2)" />
        <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1L333.1 120.1z" fill="url(#sol-3)" />
      </svg>
    ),
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    coingeckoId: "bitcoin",
    icon: (
      <svg width="18" height="18" viewBox="0 0 4091.27 4091.73">
        <path fill="#F7931A" fillRule="nonzero" d="M4030.06 2540.77c-273.24 1096.01-1383.32 1763.02-2479.46 1489.71-1095.68-273.24-1762.69-1383.39-1489.33-2479.31 273.12-1096.13 1383.2-1763.19 2479-1489.95 1096.06 273.24 1763.03 1383.51 1489.76 2479.57l.02-.02z" />
        <path fill="white" fillRule="nonzero" d="M2947.77 1754.38c40.72-272.26-166.56-418.61-450-516.24l91.95-368.8-224.5-55.94-89.51 359.09c-59.02-14.72-119.63-28.59-179.87-42.34l90.16-361.46-224.36-55.94-92 368.68c-48.84-11.12-96.81-22.11-143.35-33.69l.26-1.16-309.59-77.31-59.72 239.78c0 0 166.56 38.18 163.05 40.53 90.91 22.69 107.35 82.87 104.62 130.57l-104.74 420.15c6.26 1.59 14.38 3.89 23.34 7.49-7.49-1.86-15.46-3.89-23.73-5.87l-146.81 588.57c-11.11 27.62-39.31 69.07-102.87 53.33 2.25 3.26-163.17-40.72-163.17-40.72l-111.46 256.98 292.15 72.83c54.35 13.63 107.61 27.89 160.06 41.3l-92.9 373.03 224.24 55.94 92-369.07c61.26 16.63 120.71 31.97 178.91 46.43l-91.69 367.33 224.51 55.94 92.89-372.33c382.82 72.45 670.67 43.24 791.83-303.02 97.63-278.78-4.86-439.58-206.26-544.44 146.69-33.83 257.18-130.31 286.64-329.61l-.07-.05zm-512.93 719.26c-69.38 278.78-538.76 128.08-690.94 90.29l123.28-494.2c152.17 37.99 640.17 113.17 567.67 403.91zm69.43-723.3c-63.29 253.58-453.96 124.75-580.69 93.16l111.77-448.21c126.73 31.59 534.85 90.55 468.94 355.05l-.02 0z" />
      </svg>
    ),
  },
];

type Token = typeof TOKENS[number];
type Prices = Record<string, { usd: number }>;

// Dropdown animation — origin-aware, scale from top
const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -4 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -4, transition: { duration: 0.12 } },
};

const springTransition = { type: "spring" as const, stiffness: 400, damping: 30 };

export const SwapPreview = () => {
  const [fromToken, setFromToken] = useState(TOKENS[1]); // USDC
  const [toToken, setToToken] = useState(TOKENS[2]); // SOL
  const [fromAmount, setFromAmount] = useState("1");
  const [toAmount, setToAmount] = useState("");
  const [rotation, setRotation] = useState(0);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  // Fallback prices in case API is rate-limited
  const FALLBACK_PRICES: Prices = {
    ethereum: { usd: 2430 },
    "usd-coin": { usd: 1 },
    solana: { usd: 135 },
    bitcoin: { usd: 68500 },
  };

  const [prices, setPrices] = useState<Prices>(FALLBACK_PRICES);
  const [loading, setLoading] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);

  useEffect(() => {
    const ids = TOKENS.map((t) => t.coingeckoId).join(",");
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`)
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data: Prices) => {
        if (data && Object.keys(data).length > 0) setPrices(data);
      })
      .catch(() => {});
  }, []);

  const getRate = useCallback(
    (from: Token, to: Token) => {
      const fromPrice = prices[from.coingeckoId]?.usd;
      const toPrice = prices[to.coingeckoId]?.usd;
      if (!fromPrice || !toPrice) return null;
      return fromPrice / toPrice;
    },
    [prices]
  );

  useEffect(() => {
    const rate = getRate(fromToken, toToken);
    const parsed = parseFloat(fromAmount.replace(/,/g, ""));
    if (rate && !isNaN(parsed)) {
      const result = parsed * rate;
      setToAmount(result < 0.01 ? result.toFixed(6) : result.toLocaleString("en-US", { maximumFractionDigits: 2 }));
    } else {
      setToAmount("");
    }
  }, [fromAmount, fromToken, toToken, prices, getRate]);

  const handleSwap = () => {
    setRotation((r) => r + 180);
    setIsSwapped((s) => !s);
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
  };

  const selectFrom = (token: Token) => {
    if (token.symbol === toToken.symbol) {
      handleSwap();
    } else {
      setFromToken(token);
    }
    setShowFromDropdown(false);
  };

  const selectTo = (token: Token) => {
    if (token.symbol === fromToken.symbol) {
      handleSwap();
    } else {
      setToToken(token);
    }
    setShowToDropdown(false);
  };

  const rate = getRate(fromToken, toToken);
  const rateDisplay = rate
    ? rate < 0.01
      ? rate.toFixed(6)
      : rate.toLocaleString("en-US", { maximumFractionDigits: 2 })
    : "—";

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-2xl bg-(--bg-secondary) border border-(--border-color) p-4 relative">
        <LayoutGroup>
        <div className="flex flex-col gap-1">
          {/* From */}
          <motion.div
            layout
            className="rounded-xl bg-(--bg-tertiary) p-4"
            style={{ order: isSwapped ? 2 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-(--text-muted)">From</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <input
                type="text"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="bg-transparent text-2xl font-semibold text-(--text-primary) outline-none w-full min-w-0"
                placeholder="0.00"
              />
              <div className="relative">
                <motion.button
                  onClick={() => {
                    setShowFromDropdown(!showFromDropdown);
                    setShowToDropdown(false);
                  }}
                  className="flex items-center gap-1.5 bg-(--bg-secondary) border border-(--border-color) rounded-full px-3 py-1.5 text-sm font-medium text-(--text-primary) hover:border-(--text-muted) transition-colors cursor-pointer shrink-0"
                  whileTap={{ scale: 0.97 }}
                >
                  {fromToken.icon}
                  <span className="w-10 text-center">{fromToken.symbol}</span>
                  <motion.svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ rotate: showFromDropdown ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </motion.svg>
                </motion.button>
                <AnimatePresence>
                  {showFromDropdown && (
                    <motion.div
                      className="absolute right-0 top-full mt-1 bg-(--bg-secondary) border border-(--border-color) rounded-xl shadow-lg z-30 overflow-hidden min-w-[140px]"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={springTransition}
                      style={{ transformOrigin: "top right" }}
                    >
                      {TOKENS.map((t, i) => (
                        <motion.button
                          key={t.symbol}
                          onClick={() => selectFrom(t)}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-(--bg-tertiary) transition-colors cursor-pointer ${
                            t.symbol === fromToken.symbol ? "text-(--text-primary) font-medium" : "text-(--text-muted)"
                          }`}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03, duration: 0.15, ease: [0.32, 0.72, 0, 1] }}
                        >
                          {t.icon}
                          {t.symbol}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Swap button */}
          <div className="flex justify-center -my-4 relative z-10" style={{ order: 1 }}>
            <motion.button
              onClick={handleSwap}
              className="w-9 h-9 rounded-xl bg-(--bg-secondary) border border-(--border-color) flex items-center justify-center text-(--text-muted) hover:text-(--text-primary) hover:border-(--text-muted) transition-colors cursor-pointer"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ rotate: rotation }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <path d="M7 4l-4 4 4 4" />
                <path d="M3 8h14" />
                <path d="M17 20l4-4-4-4" />
                <path d="M21 16H7" />
              </motion.svg>
            </motion.button>
          </div>

          {/* To */}
          <motion.div
            layout
            className="rounded-xl bg-(--bg-tertiary) p-4"
            style={{ order: isSwapped ? 0 : 2 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-(--text-muted)">To</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={toAmount}
                  className="text-2xl font-semibold text-(--text-primary) min-w-0 truncate"
                  initial={{ opacity: 0, filter: "blur(4px)", y: 4 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0, filter: "blur(4px)", y: -4 }}
                  transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                >
                  {loading ? (
                    <span className="text-(--text-muted) text-lg">Loading...</span>
                  ) : (
                    toAmount || "0.00"
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="relative">
                <motion.button
                  onClick={() => {
                    setShowToDropdown(!showToDropdown);
                    setShowFromDropdown(false);
                  }}
                  className="flex items-center gap-1.5 bg-(--bg-secondary) border border-(--border-color) rounded-full px-3 py-1.5 text-sm font-medium text-(--text-primary) hover:border-(--text-muted) transition-colors cursor-pointer shrink-0"
                  whileTap={{ scale: 0.97 }}
                >
                  {toToken.icon}
                  <span className="w-10 text-center">{toToken.symbol}</span>
                  <motion.svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ rotate: showToDropdown ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </motion.svg>
                </motion.button>
                <AnimatePresence>
                  {showToDropdown && (
                    <motion.div
                      className="absolute right-0 top-full mt-1 bg-(--bg-secondary) border border-(--border-color) rounded-xl shadow-lg z-30 overflow-hidden min-w-[140px]"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={springTransition}
                      style={{ transformOrigin: "top right" }}
                    >
                      {TOKENS.map((t, i) => (
                        <motion.button
                          key={t.symbol}
                          onClick={() => selectTo(t)}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-(--bg-tertiary) transition-colors cursor-pointer ${
                            t.symbol === toToken.symbol ? "text-(--text-primary) font-medium" : "text-(--text-muted)"
                          }`}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03, duration: 0.15, ease: [0.32, 0.72, 0, 1] }}
                        >
                          {t.icon}
                          {t.symbol}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
        </LayoutGroup>

        {/* Rate */}
        <div className="pt-3 px-1">
          <span className="text-xs text-(--text-muted)">
            {loading ? "Fetching prices..." : `1 ${fromToken.symbol} ≈ ${rateDisplay} ${toToken.symbol}`}
          </span>
        </div>
      </div>
    </div>
  );
};
