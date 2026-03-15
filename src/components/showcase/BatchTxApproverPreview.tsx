import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TxItem {
  id: string;
  name: string;
  icon: string;
  gas: string;
  from: string;
  to: string;
  amount: string;
  fee: string;
}

const TRANSACTIONS: TxItem[] = [
  { id: "1", name: "Swap SOL \u2192 USDC", icon: "\u21C4", gas: "~0.00025 SOL", from: "5KtP...9dEH", to: "9xMn...3kFv", amount: "12.5 SOL", fee: "0.3%" },
  { id: "2", name: "Stake 50 SOL", icon: "\u26A1", gas: "~0.00015 SOL", from: "5KtP...9dEH", to: "Stake Pool", amount: "50 SOL", fee: "0.00015 SOL" },
  { id: "3", name: "Mint NFT", icon: "\u2B22", gas: "~0.00204 SOL", from: "5KtP...9dEH", to: "Candy Machine", amount: "2.5 SOL", fee: "0.00204 SOL" },
  { id: "4", name: "Transfer USDC", icon: "\u2197", gas: "~0.00010 SOL", from: "5KtP...9dEH", to: "7bRq...mN2x", amount: "250 USDC", fee: "0.00010 SOL" },
];

export const BatchTxApproverPreview = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const [approving, setApproving] = useState(false);

  const handleApproveAll = () => {
    if (approving || approved.size === TRANSACTIONS.length) return;
    setApproving(true);
    setExpandedId(null);

    TRANSACTIONS.forEach((tx, i) => {
      setTimeout(() => {
        setApproved((prev) => new Set([...prev, tx.id]));
        if (i === TRANSACTIONS.length - 1) {
          setTimeout(() => {
            setApproving(false);
            setApproved(new Set());
          }, 2000);
        }
      }, (i + 1) * 150);
    });
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-2xl bg-(--bg-secondary) border border-(--border-color) p-4 space-y-3">

        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-medium text-(--text-primary)">Batch Transactions</span>
          <span className="text-xs text-(--text-muted)">{TRANSACTIONS.length} pending</span>
        </div>


        <div className="space-y-2">
          {TRANSACTIONS.map((tx) => {
            const isExpanded = expandedId === tx.id && !approving;
            const isApproved = approved.has(tx.id);

            return (
              <motion.div
                key={tx.id}
                className="rounded-xl bg-(--bg-tertiary) border border-(--border-color) overflow-hidden cursor-pointer"
                whileHover={!approving ? { y: -2 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={() => !approving && setExpandedId(isExpanded ? null : tx.id)}
              >

                <div className="flex items-center gap-3 p-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                    style={{
                      background: isApproved ? "#14F19520" : "#9945FF15",
                      color: isApproved ? "#14F195" : "#9945FF",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {isApproved ? (
                        <motion.span
                          key="check"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                          &#10003;
                        </motion.span>
                      ) : (
                        <motion.span key="icon">{tx.icon}</motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-(--text-primary) truncate">{tx.name}</div>
                    <div className="text-[11px] text-(--text-muted)">Gas: {tx.gas}</div>
                  </div>
                  <motion.div
                    className="text-(--text-muted)"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </motion.div>
                </div>


                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 pt-1 space-y-2 border-t border-(--border-color)">
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-(--text-muted)">From</span>
                            <div className="text-(--text-secondary) font-mono mt-0.5">{tx.from}</div>
                          </div>
                          <div>
                            <span className="text-(--text-muted)">To</span>
                            <div className="text-(--text-secondary) font-mono mt-0.5">{tx.to}</div>
                          </div>
                          <div>
                            <span className="text-(--text-muted)">Amount</span>
                            <div className="text-(--text-secondary) font-medium mt-0.5">{tx.amount}</div>
                          </div>
                          <div>
                            <span className="text-(--text-muted)">Est. Fee</span>
                            <div className="text-(--text-secondary) font-medium mt-0.5">{tx.fee}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>


        <motion.button
          className="w-full py-3 rounded-xl text-sm font-medium text-white cursor-pointer"
          style={{
            background:
              approved.size === TRANSACTIONS.length
                ? "#14F195"
                : "linear-gradient(135deg, #9945FF, #14F195)",
            color: approved.size === TRANSACTIONS.length ? "#0a0a0a" : "white",
          }}
          whileHover={!approving ? { scale: 1.02 } : {}}
          whileTap={!approving ? { scale: 0.98 } : {}}
          onClick={handleApproveAll}
          disabled={approving}
        >
          {approved.size === TRANSACTIONS.length
            ? "All Approved"
            : approving
              ? "Approving..."
              : "Approve All"}
        </motion.button>
      </div>
    </div>
  );
};
