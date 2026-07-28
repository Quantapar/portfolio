import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Copy } from "lucide-react";

type CopyButtonProps = {
  value: string;
  className?: string;
};

export function CopyButton({ value, className = "" }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setHasCopied(true);
      window.setTimeout(() => setHasCopied(false), 2000);
    } catch {
      setHasCopied(false);
    }
  }

  const transition = shouldReduceMotion ? { duration: 0 } : { duration: 0.15 };

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      aria-label={hasCopied ? "Copied" : "Copy to clipboard"}
      className={`group relative inline-flex items-center justify-center rounded-sm p-0.5 text-foreground/40 transition-colors duration-150 hover:text-foreground/70 ${className}`}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {hasCopied ? (
          <motion.span
            key="check"
            initial={shouldReduceMotion ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { scale: 0.8, opacity: 0 }}
            transition={transition}
            className="text-[#26a641] dark:text-foreground"
          >
            <Check className="size-3.5" strokeWidth={2} />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={shouldReduceMotion ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { scale: 0.8, opacity: 0 }}
            transition={transition}
          >
            <Copy className="size-3.5" strokeWidth={1.75} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
