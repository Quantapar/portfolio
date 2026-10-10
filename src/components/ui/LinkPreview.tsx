import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useState,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

// The card rises 8px out of a slight blur and shrink; it leaves faster than it arrives.
const cardMotion = {
  initial: { opacity: 0, scale: 0.96, y: 8, filter: "blur(6px)" },
  animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 6,
    filter: "blur(6px)",
    transition: { duration: 0.14, ease: [0.4, 0, 1, 1] },
  },
  transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
} as const;

const reducedCardMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0 } },
  transition: { duration: 0 },
} as const;

type LinkPreviewProps = {
  href: string;
  /** What the card shows. It stays open while hovered, so it can hold links. Omit for a plain link. */
  card?: ReactNode;
  className?: string;
  /** Accessible name, for links whose content is only an icon. */
  label?: string;
  children: ReactNode;
};

export function LinkPreview({
  href,
  card,
  className = "link-inline",
  label,
  children,
}: LinkPreviewProps) {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handlePointerEnter = (event: PointerEvent<HTMLSpanElement>) => {
    // Touch has no hover: a tap should go straight to the link.
    if (event.pointerType === "mouse") setOpen(true);
  };

  const handleFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    if (event.target.matches(":focus-visible")) setOpen(true);
  };

  const close = () => setOpen(false);

  return (
    <span
      className="relative inline-flex"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={close}
    >
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={className}
        aria-label={label}
        onFocus={handleFocus}
        onBlur={close}
      >
        {children}
      </a>

      <AnimatePresence>
        {open && card ? (
          <span
            aria-hidden="true"
            // The shadow sits here because the card animates its own filter.
            className="absolute bottom-full left-1/2 z-50 block -translate-x-1/2 pb-2.5 drop-shadow-xl"
          >
            <motion.span
              className="btn-bevel relative block origin-bottom p-3"
              style={{ backgroundColor: "var(--background)" }}
              {...(shouldReduceMotion ? reducedCardMotion : cardMotion)}
            >
              <span className="btn-bevel-frame" />
              <span className="btn-bevel-corner btn-bevel-corner-tl" />
              <span className="btn-bevel-corner btn-bevel-corner-tr" />
              <span className="btn-bevel-corner btn-bevel-corner-bl" />
              <span className="btn-bevel-corner btn-bevel-corner-br" />
              {card}
            </motion.span>
          </span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
