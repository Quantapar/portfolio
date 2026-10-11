import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useId,
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
/** In a group, how long the card outlives the cursor leaving a link: time to reach the next link, or the card. */
const LINGER_MS = 100;
/** Room to assume a card needs above its link before it has been measured: the tallest card plus the gap. */
const ROOM_ABOVE = 208;
/** Closest a card may sit to the edge of the window. */
const EDGE = 8;
/** The space between a link and a group's card. A link's own card leaves the same 10px as padding. */
const GAP = 10;

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

// In a group, the one card travels and changes size between links. It eases out like the rest,
// so it sets off the moment the cursor reaches the next link.
const travel = { duration: 0.2, ease: [0.23, 1, 0.32, 1] } as const;

// What the card holds cross-fades as it travels: the old leaves faster than the new arrives.
// Asked for from the keyboard, the new is simply there and the old is simply gone.
const contentMotion = {
  hidden: (atOnce: boolean) => ({ opacity: atOnce ? 1 : 0 }),
  shown: (atOnce: boolean) => ({
    opacity: 1,
    transition: atOnce
      ? { duration: 0 }
      : { duration: 0.16, ease: [0.23, 1, 0.32, 1] as const },
  }),
  gone: (atOnce: boolean) => ({
    opacity: 0,
    transition: atOnce
      ? { duration: 0 }
      : { duration: 0.09, ease: [0.4, 0, 0.6, 1] as const },
  }),
};

/** How far a card of this width must slide sideways, from centred on its link, to stay inside the window. */
function shiftIntoWindow(link: DOMRect, width: number) {
  const centered = link.left + link.width / 2 - width / 2;
  const rightmost = document.documentElement.clientWidth - EDGE - width;
  const left = Math.min(Math.max(centered, EDGE), Math.max(EDGE, rightmost));

  return left - centered;
}

/**
 * Slides the card sideways just enough to keep it inside the window, and records how far,
 * so the card can still grow from the point nearest its link instead of from its own middle.
 */
function keepInWindow(positioner: HTMLSpanElement | null) {
  const anchor = positioner?.parentElement;
  if (!positioner || !anchor) return;

  const shift = shiftIntoWindow(
    anchor.getBoundingClientRect(),
    positioner.offsetWidth,
  );

  positioner.style.translate = `calc(-50% + ${shift}px) 0`;
  positioner.style.setProperty("--card-shift", `${shift}px`);
}

/** The dotted frame and the four corner marks every card is drawn with. */
function CardFrame() {
  return (
    <>
      <span className="btn-bevel-frame" />
      <span className="btn-bevel-corner btn-bevel-corner-tl" />
      <span className="btn-bevel-corner btn-bevel-corner-tr" />
      <span className="btn-bevel-corner btn-bevel-corner-bl" />
      <span className="btn-bevel-corner btn-bevel-corner-br" />
    </>
  );
}

type Shown = {
  id: string;
  link: Element;
  card: ReactNode;
  /** Asked for from the keyboard, where the card is simply there with nothing in between. */
  atOnce: boolean;
};

type Box = { x: number; y: number; width: number; height: number };

type Group = {
  enter: (id: string, link: Element, card: ReactNode) => void;
  leave: () => void;
  focus: (id: string, link: Element, card: ReactNode) => void;
  blur: () => void;
};

const GroupContext = createContext<Group | null>(null);

type LinkPreviewGroupProps = {
  className?: string;
  children: ReactNode;
};

/**
 * A row of links that share one card. Moving from one link to the next keeps that card on
 * screen: it slides across to the new link and changes size to fit what it now holds.
 */
export function LinkPreviewGroup({
  className = "",
  children,
}: LinkPreviewGroupProps) {
  const [shown, setShown] = useState<Shown | null>(null);
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<Side>("above");
  const [instant, setInstant] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const positioner = useRef<HTMLSpanElement | null>(null);
  // Where the card was last sent, so it sets off again only when its link or its size changes.
  const sentTo = useRef<Box | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);

  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const cancelTimers = () => {
    for (const timer of [openTimer, closeTimer]) {
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
    }
  };

  useEffect(() => cancelTimers, []);

  /**
   * Runs each time the card is drawn, before anything is painted: measures what it holds and
   * sends it to its link. It is the ref of a plain element inside the card, because a ref on
   * the moving element itself is only called once, when it first appears.
   */
  const place = (inside: HTMLSpanElement | null) => {
    const node = inside?.parentElement ?? null;
    positioner.current = node;

    const frame = node?.parentElement;
    const content =
      shown && node?.querySelector<HTMLElement>(`[data-card="${shown.id}"]`);
    if (!node || !frame || !shown || !content) return;

    const link = shown.link.getBoundingClientRect();
    const within = frame.getBoundingClientRect();
    const cardWidth = content.offsetWidth;
    const cardHeight = content.offsetHeight;

    // Above whenever the card fits there, so it does not cover what follows the links.
    const fits: Side =
      link.top >= cardHeight + GAP + EDGE ? "above" : "below";
    if (fits !== side) setSide(fits);

    const left =
      link.left +
      link.width / 2 -
      cardWidth / 2 +
      shiftIntoWindow(link, cardWidth);
    const to: Box = {
      x: left - within.left,
      y:
        (fits === "above" ? link.top - GAP - cardHeight : link.bottom + GAP) -
        within.top,
      width: cardWidth,
      height: cardHeight,
    };

    // The card grows from the edge facing its link, at the point in line with the link's middle.
    node.style.setProperty(
      "--card-origin",
      `${link.left + link.width / 2 - left}px`,
    );

    const from = sentTo.current;
    const values = { x, y, width, height };
    const keys = ["x", "y", "width", "height"] as const;
    if (from && keys.every((key) => Math.abs(from[key] - to[key]) < 0.5)) {
      return;
    }
    sentTo.current = to;

    // Opening, asked for from the keyboard, or with reduced motion, the card is simply there.
    // Otherwise it travels. Its position and its size move in step, so the edge facing the links holds still.
    const travels = from && !shown.atOnce && !shouldReduceMotion;
    for (const key of keys) {
      if (travels) animate(values[key], to[key], travel);
      else values[key].jump(to[key]);
    }
  };

  const reveal = (next: Shown, immediately: boolean) => {
    // A card still on screen, open or on its way out, keeps the way it was opened:
    // one that is leaving simply turns around and goes to the new link.
    if (!positioner.current) setInstant(immediately);
    positioner.current?.style.removeProperty("display");
    setShown(next);
    setOpen(true);

    // Another link's card would otherwise fade out underneath this one.
    if (immediately && leavingCard !== positioner.current) {
      leavingCard?.style.setProperty("display", "none");
    }
  };

  const close = () => {
    cancelTimers();
    if (open) {
      lastClosedAt = performance.now();
      leavingCard = positioner.current;
    }
    setOpen(false);
  };

  const enter = (id: string, link: Element, card: ReactNode) => {
    cancelTimers();
    const next = { id, link, card, atOnce: false };

    // Already open: the same card goes to the new link.
    if (open) {
      setShown(next);
      return;
    }

    if (performance.now() - lastClosedAt < WARM_MS) {
      reveal(next, true);
      return;
    }

    // A cursor only passing over leaves before this fires, so nothing flashes.
    openTimer.current = window.setTimeout(() => {
      openTimer.current = null;
      reveal(next, false);
    }, OPEN_DELAY_MS);
  };

  // The card waits a moment before closing, so crossing the gap to the next link, or up to
  // the card itself, does not close it on the way.
  const leave = () => {
    cancelTimers();
    if (open) closeTimer.current = window.setTimeout(close, LINGER_MS);
  };

  const focus = (id: string, link: Element, card: ReactNode) => {
    cancelTimers();
    reveal({ id, link, card, atOnce: true }, true);
  };

  // Focus leaves one link just before it lands on the next. Closing a moment later lets that
  // next link keep the card, so tabbing along the row never takes it away and brings it back.
  const blur = () => {
    cancelTimers();
    closeTimer.current = window.setTimeout(close, 0);
  };

  return (
    <GroupContext.Provider value={{ enter, leave, focus, blur }}>
      <div className={`relative ${className}`}>
        {children}

        <AnimatePresence
          onExitComplete={() => {
            sentTo.current = null;
          }}
        >
          {open && shown ? (
            <motion.span
              aria-hidden="true"
              // The shadow sits here because the card animates its own filter.
              className="absolute top-0 left-0 z-50 block drop-shadow-xl"
              style={{ x, y, width, height }}
              onPointerEnter={cancelTimers}
              onPointerLeave={leave}
            >
              {/* Covers the gap, so the cursor can cross from a link to the card without leaving both. */}
              <span
                ref={place}
                className={`absolute inset-x-0 h-2.5 ${side === "above" ? "top-full" : "bottom-full"}`}
              />
              <motion.span
                // A card moved to the other side starts its entrance again, from the right direction.
                key={side}
                className="btn-bevel relative block size-full"
                style={{
                  backgroundColor: "var(--background)",
                  transformOrigin: `var(--card-origin, 50%) ${side === "above" ? "100%" : "0%"}`,
                }}
                {...(shouldReduceMotion || instant
                  ? instantMotion
                  : cardMotion(side))}
              >
                <CardFrame />
                {/* Cut to the card's edge, for the moment the card is between two sizes. */}
                <span className="absolute inset-0 block overflow-hidden">
                  {/* `custom` reaches the one that is leaving too, so both ends of the change agree. */}
                  <AnimatePresence initial={false} custom={shown.atOnce}>
                    <motion.span
                      key={shown.id}
                      data-card={shown.id}
                      // Centred, and held to the edge facing the links, so it stays put while the card resizes around it.
                      className={`absolute left-1/2 block w-max -translate-x-1/2 p-3 ${side === "above" ? "bottom-0" : "top-0"}`}
                      custom={shown.atOnce}
                      variants={contentMotion}
                      initial="hidden"
                      animate="shown"
                      exit="gone"
                    >
                      {shown.card}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.span>
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
    </GroupContext.Provider>
  );
}

type LinkPreviewProps = {
  href: string;
  /**
   * What the card shows. It stays open while hovered, so it can hold links. Omit for a plain link.
   * Inside a `LinkPreviewGroup` it is shown in the group's one card instead of a card of its own.
   */
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
  const id = useId();
  const group = useContext(GroupContext);
  // In a group, a link that has a card hands it to the group's one card.
  const shared = card ? group : null;

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
    // A plain link has nothing to open, and must not count as a card that just closed.
    if (!card) return;

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
    if (shared) {
      shared.enter(id, link, card);
      return;
    }

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
    if (!event.target.matches(":focus-visible")) return;

    if (shared) shared.focus(id, event.target, card);
    else show(event.target, true);
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
      onPointerLeave={shared ? shared.leave : close}
    >
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={className}
        aria-label={label}
        onFocus={handleFocus}
        onBlur={shared ? shared.blur : close}
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
              <CardFrame />
              {card}
            </motion.span>
          </span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
