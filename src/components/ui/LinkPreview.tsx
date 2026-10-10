import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  useEffect,
  useState,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

type LinkPreviewProps = {
  href: string;
  /** Screenshot of the destination, shown at 200×125. */
  imageSrc?: string;
  /** Custom card content, shown instead of a screenshot. */
  card?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function LinkPreview({
  href,
  imageSrc,
  card,
  className = "link-inline",
  children,
}: LinkPreviewProps) {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const followX = useSpring(x, { stiffness: 100, damping: 15 });

  // Fetch ahead of the first hover so the card never opens empty.
  useEffect(() => {
    if (!imageSrc) return;
    const image = new Image();
    image.src = imageSrc;
  }, [imageSrc]);

  const content =
    card ??
    (imageSrc ? (
      <img
        src={imageSrc}
        alt=""
        width={200}
        height={125}
        draggable={false}
        className="block max-w-none"
      />
    ) : null);

  const handlePointerEnter = (event: PointerEvent<HTMLSpanElement>) => {
    // Touch has no hover: a tap should go straight to the link.
    if (event.pointerType === "mouse") setOpen(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (shouldReduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) / 2);
  };

  const handleFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    if (event.target.matches(":focus-visible")) setOpen(true);
  };

  const close = () => {
    setOpen(false);
    x.set(0);
  };

  return (
    <span
      className="relative inline-flex"
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={close}
    >
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={className}
        onFocus={handleFocus}
        onBlur={close}
      >
        {children}
      </a>

      <AnimatePresence>
        {open && content ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-full left-1/2 z-50 block -translate-x-1/2 pb-2.5"
          >
            <motion.span
              // Screenshots get a thin frame with see-through corners; custom cards keep the padded one.
              className={`btn-bevel relative block origin-bottom drop-shadow-xl ${card ? "p-3" : "btn-bevel-media p-1"}`}
              style={{ x: followX, backgroundColor: "var(--background)" }}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 20, scale: 0.6 }
              }
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: shouldReduceMotion
                  ? { duration: 0.12 }
                  : { type: "spring", stiffness: 260, damping: 20 },
              }}
              exit={{
                opacity: 0,
                ...(shouldReduceMotion ? {} : { y: 8, scale: 0.9 }),
                transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] },
              }}
            >
              <span className="btn-bevel-frame" />
              <span className="btn-bevel-corner btn-bevel-corner-tl" />
              <span className="btn-bevel-corner btn-bevel-corner-tr" />
              <span className="btn-bevel-corner btn-bevel-corner-bl" />
              <span className="btn-bevel-corner btn-bevel-corner-br" />
              {content}
            </motion.span>
          </span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
