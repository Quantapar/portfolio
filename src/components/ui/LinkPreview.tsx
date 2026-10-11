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
/** Room to assume a card needs above its link before it has been measured: the tallest card plus the gap. */
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
// The move and the shrink are written as one transform, so the browser runs them off the
// main thread, in step with the opacity and blur, even while the page is busy.
function cardMotion(side: Side) {
  const away = side === "above" ? -1 : 1;

  return {
    initial: {
      opacity: 0,
      transform: `translateY(${-8 * away}px) scale(0.96)`,
      filter: "blur(6px)",
    },
    animate: {
      opacity: 1,
      transform: "translateY(0px) scale(1)",
      filter: "blur(0px)",
    },
    exit: {
      opacity: 0,
      transform: `translateY(${-6 * away}px) scale(0.97)`,
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

/**
 * Slides the card sideways just enough to keep it inside the window, and records how far,
 * so the card can still grow from the point nearest its link instead of from its own middle.
 */
function keepInWindow(positioner: HTMLSpanElement | null) {
  const anchor = positioner?.parentElement;
  if (!positioner || !anchor) return;

  const width = positioner.offsetWidth;
  const link = anchor.getBoundingClientRect();
  const centered = link.left + link.width / 2 - width / 2;
  const rightmost = document.documentElement.clientWidth - EDGE - width;
  const left = Math.min(Math.max(centered, EDGE), Math.max(EDGE, rightmost));
  const shift = left - centered;

  positioner.style.translate = `calc(-50% + ${shift}px) 0`;
  positioner.style.setProperty("--card-shift", `${shift}px`);
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
  // What this link's own card needs above it, known once the card has been on screen.
  const room = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const openTimer = useRef<number | null>(null);

  const cancelOpen = () => {
    if (openTimer.current !== null) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  };

  useEffect(() => cancelOpen, []);

  // Above whenever the card fits there, so it does not cover the text that follows the link.
  const sideFor = (link: Element): Side =>
    link.getBoundingClientRect().top >= (room.current ?? ROOM_ABOVE)
      ? "above"
      : "below";

  /** Runs as the card lands in the page, before anything is painted. */
  const place = (node: HTMLSpanElement | null) => {
    positioner.current = node;
    keepInWindow(node);

    const anchor = node?.parentElement;
    if (!node || !anchor) return;

    // The card's real height replaces the guess made before it existed. If that changes
    // the answer, the card is moved now, while it is still unseen.
    room.current = node.offsetHeight + EDGE;
    const fits = sideFor(anchor);
    if (fits !== side) setSide(fits);
  };

  const show = (link: Element, immediately: boolean) => {
    // Decided as the card opens, from where the link is on screen right now.
    setSide(sideFor(link));
    // A card of ours still on screen, open or on its way out, keeps the way it was opened:
    // one that is leaving simply turns around when the cursor comes straight back.
    if (!positioner.current) setInstant(immediately);
    setOpen(true);

    // Another link's card would otherwise fade out underneath the one that just appeared.
    // Never our own: it is the card being shown.
    if (immediately && leavingCard !== positioner.current) {
      leavingCard?.style.setProperty("display", "none");
    }
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
            ref={place}
            aria-hidden="true"
            // The shadow sits here because the card animates its own filter.
            className={`absolute left-1/2 z-50 block drop-shadow-xl ${side === "above" ? "bottom-full pb-2.5" : "top-full pt-2.5"}`}
            style={{ translate: "-50% 0" }}
          >
            <motion.span
              // A card moved to the other side starts its entrance again, from the right direction.
              key={side}
              className="btn-bevel relative block p-3"
              style={{
                backgroundColor: "var(--background)",
                // The edge facing the link, at the point in line with the link's middle.
                transformOrigin: `calc(50% - var(--card-shift, 0px)) ${side === "above" ? "100%" : "0%"}`,
              }}
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
