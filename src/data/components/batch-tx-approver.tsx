import { BatchTxApproverPreview } from "../../components/showcase/BatchTxApproverPreview";
import type { ComponentEntry } from "./types";

export const batchTxApprover: ComponentEntry = {
  id: "batch-tx-approver",
  name: "Batch Tx Approver",
  description:
    "An accordion list of pending transactions with expandable details, hover lift, and staggered checkmark approval animation.",
  preview: <BatchTxApproverPreview />,
  code: `import { useState } from "react";
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

const DEFAULT_TRANSACTIONS: TxItem[] = [
  { id: "1", name: "Swap SOL \\u2192 USDC", icon: "\\u21C4", gas: "~0.00025 SOL", from: "5KtP...9dEH", to: "9xMn...3kFv", amount: "12.5 SOL", fee: "0.3%" },
  { id: "2", name: "Stake 50 SOL", icon: "\\u26A1", gas: "~0.00015 SOL", from: "5KtP...9dEH", to: "Stake Pool", amount: "50 SOL", fee: "0.00015 SOL" },
  { id: "3", name: "Mint NFT", icon: "\\u2B22", gas: "~0.00204 SOL", from: "5KtP...9dEH", to: "Candy Machine", amount: "2.5 SOL", fee: "0.00204 SOL" },
  { id: "4", name: "Transfer USDC", icon: "\\u2197", gas: "~0.00010 SOL", from: "5KtP...9dEH", to: "7bRq...mN2x", amount: "250 USDC", fee: "0.00010 SOL" },
];

interface BatchTxApproverProps {
  transactions?: TxItem[];
  onApproveAll?: () => void;
  staggerDelay?: number;
}

export default function BatchTxApprover({
  transactions = DEFAULT_TRANSACTIONS,
  onApproveAll,
  staggerDelay = 150,
}: BatchTxApproverProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const [approving, setApproving] = useState(false);

  const handleApproveAll = () => {
    if (approving || approved.size === transactions.length) return;
    setApproving(true);
    setExpandedId(null);

    transactions.forEach((tx, i) => {
      setTimeout(() => {
        setApproved((prev) => new Set([...prev, tx.id]));
        if (i === transactions.length - 1) {
          onApproveAll?.();
          setTimeout(() => {
            setApproving(false);
            setApproved(new Set());
          }, 2000);
        }
      }, (i + 1) * staggerDelay);
    });
  };

  return (
    <div style={{ maxWidth: 384, margin: "0 auto" }}>
      <div style={{ borderRadius: 16, background: "#1a1a1a", border: "1px solid #2a2a2a", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px" }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#e5e5e5" }}>Batch Transactions</span>
          <span style={{ fontSize: 12, color: "#888" }}>{transactions.length} pending</span>
        </div>

        {/* Transaction list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {transactions.map((tx) => {
            const isExpanded = expandedId === tx.id && !approving;
            const isApproved = approved.has(tx.id);

            return (
              <motion.div
                key={tx.id}
                style={{ borderRadius: 12, background: "#222", border: "1px solid #2a2a2a", overflow: "hidden", cursor: "pointer" }}
                whileHover={!approving ? { y: -2 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={() => !approving && setExpandedId(isExpanded ? null : tx.id)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12 }}>
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: 8,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, flexShrink: 0,
                      background: isApproved ? "#14F19520" : "#9945FF15",
                      color: isApproved ? "#14F195" : "#9945FF",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {isApproved ? (
                        <motion.span key="check" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                          \\u2713
                        </motion.span>
                      ) : (
                        <motion.span key="icon">{tx.icon}</motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#e5e5e5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.name}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>Gas: {tx.gas}</div>
                  </div>
                  <motion.div style={{ color: "#888" }} animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
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
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ padding: "4px 12px 12px", borderTop: "1px solid #2a2a2a" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11 }}>
                          <div>
                            <span style={{ color: "#888" }}>From</span>
                            <div style={{ color: "#ccc", fontFamily: "monospace", marginTop: 2 }}>{tx.from}</div>
                          </div>
                          <div>
                            <span style={{ color: "#888" }}>To</span>
                            <div style={{ color: "#ccc", fontFamily: "monospace", marginTop: 2 }}>{tx.to}</div>
                          </div>
                          <div>
                            <span style={{ color: "#888" }}>Amount</span>
                            <div style={{ color: "#ccc", fontWeight: 500, marginTop: 2 }}>{tx.amount}</div>
                          </div>
                          <div>
                            <span style={{ color: "#888" }}>Est. Fee</span>
                            <div style={{ color: "#ccc", fontWeight: 500, marginTop: 2 }}>{tx.fee}</div>
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

        {/* Approve All */}
        <motion.button
          style={{
            width: "100%", padding: "12px 0", borderRadius: 12, fontSize: 14, fontWeight: 500, border: "none", cursor: approving ? "default" : "pointer",
            background: approved.size === transactions.length ? "#14F195" : "linear-gradient(135deg, #9945FF, #14F195)",
            color: approved.size === transactions.length ? "#0a0a0a" : "white",
          }}
          whileHover={!approving ? { scale: 1.02 } : {}}
          whileTap={!approving ? { scale: 0.98 } : {}}
          onClick={handleApproveAll}
          disabled={approving}
        >
          {approved.size === transactions.length ? "All Approved" : approving ? "Approving..." : "Approve All"}
        </motion.button>
      </div>
    </div>
  );
}`,
  npmCommand: "npm install framer-motion",
  props: [
    { name: "transactions", type: "TxItem[]", required: false, description: "Array of transaction objects to display" },
    { name: "onApproveAll", type: "() => void", required: false, description: "Callback fired after all transactions are approved" },
    { name: "staggerDelay", type: "number", required: false, description: "Delay in ms between each approval animation. Default: 150" },
  ],
};
