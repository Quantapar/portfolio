import { SwapPreview } from "../../components/showcase/SwapPreview";
import type { ComponentEntry } from "./types";

export const swap: ComponentEntry = {
  id: "swap",
  name: "Swap",
  description:
    "A token swap component with Pay/Receive panels, live pricing, balance display, animated arrow, and token dropdowns.",
  preview: <SwapPreview />,
  code: `import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance: number;
}

const DEFAULT_TOKENS: Token[] = [
  { symbol: "ETH", name: "Ethereum", icon: "⟠", balance: 0 },
  { symbol: "USDC", name: "USD Coin", icon: "◈", balance: 4537.5 },
  { symbol: "SOL", name: "Solana", icon: "◎", balance: 12.8 },
  { symbol: "BTC", name: "Bitcoin", icon: "₿", balance: 0.025 },
];

const MOCK_PRICES: Record<string, number> = {
  ETH: 2430,
  USDC: 1,
  SOL: 135,
  BTC: 68500,
};

interface SwapProps {
  tokens?: Token[];
  defaultFrom?: string;
  defaultTo?: string;
}

export default function Swap({
  tokens = DEFAULT_TOKENS,
  defaultFrom = "USDC",
  defaultTo = "ETH",
}: SwapProps) {
  const [fromToken, setFromToken] = useState(tokens.find(t => t.symbol === defaultFrom) || tokens[0]);
  const [toToken, setToToken] = useState(tokens.find(t => t.symbol === defaultTo) || tokens[1]);
  const [fromAmount, setFromAmount] = useState("164.23");
  const [toAmount, setToAmount] = useState("");
  const [rotation, setRotation] = useState(0);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const getRate = useCallback((from: Token, to: Token) => {
    const fromPrice = MOCK_PRICES[from.symbol];
    const toPrice = MOCK_PRICES[to.symbol];
    if (!fromPrice || !toPrice) return null;
    return fromPrice / toPrice;
  }, []);

  const getUsdValue = useCallback((token: Token, amount: string) => {
    const price = MOCK_PRICES[token.symbol];
    const parsed = parseFloat(amount.replace(/,/g, ""));
    if (!price || isNaN(parsed)) return null;
    return parsed * price;
  }, []);

  useEffect(() => {
    const rate = getRate(fromToken, toToken);
    const parsed = parseFloat(fromAmount.replace(/,/g, ""));
    if (rate && !isNaN(parsed)) {
      const result = parsed * rate;
      setToAmount(result < 0.01 ? result.toFixed(6) : result.toLocaleString("en-US", { maximumFractionDigits: 4 }));
    } else {
      setToAmount("");
    }
  }, [fromAmount, fromToken, toToken, getRate]);

  const handleSwap = () => {
    setRotation((r) => r + 180);
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
  };

  const selectToken = (token: Token, side: "from" | "to") => {
    if (side === "from" && token.symbol === toToken.symbol) handleSwap();
    else if (side === "to" && token.symbol === fromToken.symbol) handleSwap();
    else if (side === "from") setFromToken(token);
    else setToToken(token);
    setShowFromDropdown(false);
    setShowToDropdown(false);
  };

  const rate = getRate(fromToken, toToken);
  const rateDisplay = rate ? (rate < 0.01 ? rate.toFixed(8) : rate.toLocaleString("en-US", { maximumFractionDigits: 6 })) : "—";
  const fromUsd = getUsdValue(fromToken, fromAmount);
  const fromUsdDisplay = fromUsd ? \`$\${fromUsd.toLocaleString("en-US", { maximumFractionDigits: 2 })}\` : "";

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4 relative">
        <div className="flex flex-col gap-1">
          <div className="rounded-xl bg-neutral-800/60 p-4">
            <span className="text-xs text-neutral-500 mb-2 block">Pay</span>
            <div className="flex items-center justify-between gap-3">
              <input type="text" value={fromAmount} onChange={(e) => setFromAmount(e.target.value)}
                className="bg-transparent text-2xl font-semibold text-white outline-none w-full min-w-0" placeholder="0.00" />
              <div className="relative">
                <button onClick={() => { setShowFromDropdown(!showFromDropdown); setShowToDropdown(false); }}
                  className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-700 rounded-full px-3 py-1.5 text-sm font-medium text-white hover:border-neutral-500 transition-colors shrink-0">
                  <span>{fromToken.icon}</span> {fromToken.symbol}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
                {showFromDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg z-30 overflow-hidden min-w-[140px]">
                    {tokens.map((t) => (
                      <button key={t.symbol} onClick={() => selectToken(t, "from")}
                        className={\`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-800 transition-colors \${t.symbol === fromToken.symbol ? "text-white font-medium" : "text-neutral-500"}\`}>
                        <span>{t.icon}</span>{t.symbol}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-neutral-500">{fromUsdDisplay}</span>
              <span className="text-xs text-neutral-500 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50">
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                </svg>
                {fromToken.balance > 0 ? fromToken.balance.toLocaleString("en-US", { maximumFractionDigits: 4 }) : <span className="opacity-50">0</span>}
              </span>
            </div>
          </div>

          <div className="flex justify-center -my-4 relative z-10">
            <motion.button onClick={handleSwap}
              className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-500 hover:text-white hover:border-neutral-500 transition-colors"
              whileTap={{ scale: 0.9 }}>
              <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                animate={{ rotate: rotation }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                <path d="M4 7l4-4 4 4" /><path d="M8 3v14" />
                <path d="M20 17l-4 4-4-4" /><path d="M16 21V7" />
              </motion.svg>
            </motion.button>
          </div>

          <div className="rounded-xl bg-neutral-800/60 p-4">
            <span className="text-xs text-neutral-500 mb-2 block">Receive</span>
            <div className="flex items-center justify-between gap-3">
              <AnimatePresence mode="popLayout">
                <motion.div key={toAmount} className="text-2xl font-semibold text-white min-w-0 truncate"
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}>
                  {toAmount ? \`~\${toAmount}\` : "0.00"}
                </motion.div>
              </AnimatePresence>
              <div className="relative">
                <button onClick={() => { setShowToDropdown(!showToDropdown); setShowFromDropdown(false); }}
                  className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-700 rounded-full px-3 py-1.5 text-sm font-medium text-white hover:border-neutral-500 transition-colors shrink-0">
                  <span>{toToken.icon}</span> {toToken.symbol}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
                {showToDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg z-30 overflow-hidden min-w-[140px]">
                    {tokens.map((t) => (
                      <button key={t.symbol} onClick={() => selectToken(t, "to")}
                        className={\`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-800 transition-colors \${t.symbol === toToken.symbol ? "text-white font-medium" : "text-neutral-500"}\`}>
                        <span>{t.icon}</span>{t.symbol}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-neutral-500">{fromUsdDisplay}</span>
              <span className="text-xs text-neutral-500 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50">
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                </svg>
                {toToken.balance > 0 ? toToken.balance.toLocaleString("en-US", { maximumFractionDigits: 4 }) : <span className="opacity-50">0</span>}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 px-1">
          <span className="text-xs text-neutral-500" style={{ fontFamily: "monospace" }}>
            1 {fromToken.symbol} = {rateDisplay} {toToken.symbol}
          </span>
        </div>

        <div className="flex gap-2 mt-3">
          <button className="flex-1 py-3 rounded-xl text-white font-semibold text-sm"
            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
            onClick={handleSwap}>
            Swap
          </button>
          <button className="flex-1 py-3 rounded-xl text-black font-semibold text-sm"
            style={{ background: "#9AFE82" }}>
            Pay
          </button>
        </div>
      </div>
    </div>
  );
}`,
  npmCommand: "npm install framer-motion",
  props: [
    { name: "tokens", type: "Token[]", required: false, description: "Array of tokens with symbol, name, icon, and balance" },
    { name: "defaultFrom", type: "string", required: false, description: "Default 'from' token symbol. Default: 'USDC'" },
    { name: "defaultTo", type: "string", required: false, description: "Default 'to' token symbol. Default: 'ETH'" },
    { name: "onSwap", type: "(data) => void", required: false, description: "Callback when swap button is clicked with current state" },
  ],
};
