import { SwapPreview } from "../../components/showcase/SwapPreview";
import type { ComponentEntry } from "./types";

export const swap: ComponentEntry = {
  id: "swap",
  name: "Swap",
  description:
    "A minimal token swap component with animated arrow, token dropdowns, and editable amounts.",
  preview: <SwapPreview />,
  code: `import { useState } from "react";
import { motion } from "framer-motion";

interface Token {
  symbol: string;
  name: string;
  icon: string;
}

const DEFAULT_TOKENS: Token[] = [
  { symbol: "ETH", name: "Ethereum", icon: "⟠" },
  { symbol: "USDC", name: "USD Coin", icon: "◈" },
  { symbol: "SOL", name: "Solana", icon: "◎" },
  { symbol: "BTC", name: "Bitcoin", icon: "₿" },
];

interface SwapProps {
  tokens?: Token[];
  defaultFrom?: string;
  defaultTo?: string;
  onSwap?: (data: { from: Token; to: Token; fromAmount: string; toAmount: string }) => void;
}

export default function Swap({
  tokens = DEFAULT_TOKENS,
  defaultFrom = "ETH",
  defaultTo = "USDC",
  onSwap,
}: SwapProps) {
  const [fromToken, setFromToken] = useState(tokens.find(t => t.symbol === defaultFrom) || tokens[0]);
  const [toToken, setToToken] = useState(tokens.find(t => t.symbol === defaultTo) || tokens[1]);
  const [fromAmount, setFromAmount] = useState("1.00");
  const [toAmount, setToAmount] = useState("2,431.85");
  const [rotation, setRotation] = useState(0);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const handleSwap = () => {
    setRotation((r) => r + 180);
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const selectToken = (token: Token, side: "from" | "to") => {
    if (side === "from" && token.symbol === toToken.symbol) {
      handleSwap();
    } else if (side === "to" && token.symbol === fromToken.symbol) {
      handleSwap();
    } else if (side === "from") {
      setFromToken(token);
    } else {
      setToToken(token);
    }
    setShowFromDropdown(false);
    setShowToDropdown(false);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4 space-y-1 relative">
        {/* From */}
        <div className="rounded-xl bg-neutral-800/60 p-4">
          <span className="text-xs text-neutral-500 mb-2 block">From</span>
          <div className="flex items-center justify-between gap-3">
            <input
              type="text"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="bg-transparent text-2xl font-semibold text-white outline-none w-full min-w-0"
              placeholder="0.00"
            />
            <div className="relative">
              <button
                onClick={() => { setShowFromDropdown(!showFromDropdown); setShowToDropdown(false); }}
                className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-700 rounded-full px-3 py-1.5 text-sm font-medium text-white hover:border-neutral-500 transition-colors shrink-0"
              >
                <span className="text-base">{fromToken.icon}</span>
                {fromToken.symbol}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              {showFromDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg z-30 overflow-hidden min-w-[140px]">
                  {tokens.map((t) => (
                    <button key={t.symbol} onClick={() => selectToken(t, "from")}
                      className={\`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-800 transition-colors \${t.symbol === fromToken.symbol ? "text-white font-medium" : "text-neutral-500"}\`}>
                      <span className="text-base">{t.icon}</span>{t.symbol}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Swap button */}
        <div className="flex justify-center -my-4 relative z-10">
          <motion.button
            onClick={() => { handleSwap(); onSwap?.({ from: toToken, to: fromToken, fromAmount: toAmount, toAmount: fromAmount }); }}
            className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-500 hover:text-white hover:border-neutral-500 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              animate={{ rotate: rotation }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}>
              <path d="M7 4l-4 4 4 4" /><path d="M3 8h14" />
              <path d="M17 20l4-4-4-4" /><path d="M21 16H7" />
            </motion.svg>
          </motion.button>
        </div>

        {/* To */}
        <div className="rounded-xl bg-neutral-800/60 p-4">
          <span className="text-xs text-neutral-500 mb-2 block">To</span>
          <div className="flex items-center justify-between gap-3">
            <input
              type="text"
              value={toAmount}
              onChange={(e) => setToAmount(e.target.value)}
              className="bg-transparent text-2xl font-semibold text-white outline-none w-full min-w-0"
              placeholder="0.00"
            />
            <div className="relative">
              <button
                onClick={() => { setShowToDropdown(!showToDropdown); setShowFromDropdown(false); }}
                className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-700 rounded-full px-3 py-1.5 text-sm font-medium text-white hover:border-neutral-500 transition-colors shrink-0"
              >
                <span className="text-base">{toToken.icon}</span>
                {toToken.symbol}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              {showToDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg z-30 overflow-hidden min-w-[140px]">
                  {tokens.map((t) => (
                    <button key={t.symbol} onClick={() => selectToken(t, "to")}
                      className={\`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-800 transition-colors \${t.symbol === toToken.symbol ? "text-white font-medium" : "text-neutral-500"}\`}>
                      <span className="text-base">{t.icon}</span>{t.symbol}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-2 px-1">
          <span className="text-xs text-neutral-500">1 {fromToken.symbol} ≈ 2,431.85 {toToken.symbol}</span>
        </div>
      </div>
    </div>
  );
}`,
  npmCommand: "npm install framer-motion",
  props: [
    { name: "tokens", type: "Token[]", required: false, description: "Array of available tokens with symbol, name, and icon" },
    { name: "defaultFrom", type: "string", required: false, description: "Default 'from' token symbol. Default: 'ETH'" },
    { name: "defaultTo", type: "string", required: false, description: "Default 'to' token symbol. Default: 'USDC'" },
    { name: "onSwap", type: "(data) => void", required: false, description: "Callback when swap button is clicked with current state" },
  ],
};
