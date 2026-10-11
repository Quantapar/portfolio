import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

/** How long the cursor must rest on a link before its card opens. */
const OPEN_DELAY_MS = 120;
/** After a card closes, the next one opens without waiting, so browsing a row stays fluid. */
const WARM_MS = 300;
/** Room a card needs above its link, tallest card plus the gap. With less, it opens below. */
const ROOM_ABOVE = 208;
/** Closest a card may sit to the edge of the window. */
const EDGE = 8;

// Shared by every preview on the page: when the last card closed, and the card itself
// while it is still fading out.
let lastClosedAt = -Infinity;
let leavingCard: HTMLElement | null = null;

type Side = "above" | "below";

// The card moves 8px toward its resting place out of a slight blur and shrink,
// and leaves faster than it arrives. Both ease out, so each starts moving the moment it is asked to. `away` points from the link to the card.
function cardMotion(side: Side) {
  const away = side === "above" ? -1 : 1;

  return {
    initial: { opacity: 0, scale: 0.96, y: -8 * away, filter: "blur(6px)" },
    animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
    exit: {
      opacity: 0,
      scale: 0.97,
      y: -6 * away,
      filter: "blur(6px)",
      transition: { duration: 0.14, ease: [0.23, 1, 0.32, 1] },
    },
    transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
  } as const;
}

// For reduced motion, for the keyboard (a key press should get its answer at once), and for
// moving from one open card to the next, where a second entrance would only be in the way.
const instantMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0 } },
  transition: { duration: 0 },
} as const;

/** Slides the card sideways just enough to keep it inside the window. */
function keepInWindow(positioner: HTMLSpanElement | null) {
  const anchor = positioner?.parentElement;
  if (!positioner || !anchor) return;

  const width = positioner.offsetWidth;
  const link = anchor.getBoundingClientRect();
  const centered = link.left + link.width / 2 - width / 2;
  const rightmost = document.documentElement.clientWidth - EDGE - width;
  const left = Math.min(Math.max(centered, EDGE), Math.max(EDGE, rightmost));

  positioner.style.translate = `calc(-50% + ${left - centered}px) 0`;
}

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
  const [side, setSide] = useState<Side>("above");
  const [instant, setInstant] = useState(false);
  const positioner = useRef<HTMLSpanElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const openTimer = useRef<number | null>(null);

  const cancelOpen = () => {
    if (openTimer.current !== null) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  };

  useEffect(() => cancelOpen, []);

  const show = (link: Element, immediately: boolean) => {
    // Decided as the card opens, from where the link is on screen right now.
    setSide(link.getBoundingClientRect().top >= ROOM_ABOVE ? "above" : "below");
    setInstant(immediately);
    setOpen(true);

    // The card being left would otherwise fade out underneath the one that just appeared.
    if (immediately) leavingCard?.style.setProperty("display", "none");
  };

  const handlePointerEnter = (event: PointerEvent<HTMLSpanElement>) => {
    // Touch has no hover: a tap should go straight to the link.
    if (event.pointerType !== "mouse") return;

    const link = event.currentTarget;
    cancelOpen();

    if (performance.now() - lastClosedAt < WARM_MS) {
      show(link, true);
      return;
    }

    // A cursor only passing over leaves before this fires, so nothing flashes.
    openTimer.current = window.setTimeout(() => {
      openTimer.current = null;
      show(link, false);
    }, OPEN_DELAY_MS);
  };

  const handleFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    if (event.target.matches(":focus-visible")) show(event.target, true);
  };

  const close = () => {
    cancelOpen();
    if (open) {
      lastClosedAt = performance.now();
      leavingCard = positioner.current;
    }
    setOpen(false);
  };

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
            ref={(node) => {
              positioner.current = node;
              keepInWindow(node);
            }}
            aria-hidden="true"
            // The shadow sits here because the card animates its own filter.
            className={`absolute left-1/2 z-50 block drop-shadow-xl ${side === "above" ? "bottom-full pb-2.5" : "top-full pt-2.5"}`}
            style={{ translate: "-50% 0" }}
          >
            <motion.span
              className={`btn-bevel relative block p-3 ${side === "above" ? "origin-bottom" : "origin-top"}`}
              style={{ backgroundColor: "var(--background)" }}
              {...(shouldReduceMotion || instant
                ? instantMotion
                : cardMotion(side))}
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
