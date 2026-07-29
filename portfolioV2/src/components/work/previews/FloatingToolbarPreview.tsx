import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

const HomeIcon = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const LayersIcon = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);
const GridIcon = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const UserIcon = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const MoonIcon = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

interface ToolbarItem {
  id: string;
  label: string;
  icon: (size: number) => React.ReactNode;
}

const ITEMS: ToolbarItem[] = [
  { id: "home", label: "Home", icon: (size) => <HomeIcon size={size} /> },
  { id: "projects", label: "Projects", icon: (size) => <LayersIcon size={size} /> },
  { id: "components", label: "Components", icon: (size) => <GridIcon size={size} /> },
  { id: "about", label: "About", icon: (size) => <UserIcon size={size} /> },
  { id: "theme", label: "Dark Mode", icon: (size) => <MoonIcon size={size} /> },
];

const SEPARATOR_AFTER = 3;

export const FloatingToolbarPreview = () => {
  const isNarrow = useMediaQuery("(max-width: 639px)");
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const itemSize = isNarrow ? 36 : 44;
  const gap = isNarrow ? 4 : 8;
  const padding = isNarrow ? 10 : 16;
  const separatorWidth = isNarrow ? 9 : 13;
  const iconSize = isNarrow ? 15 : 18;

  const getItemX = (index: number) => {
    let x = padding + index * (itemSize + gap);
    if (index > SEPARATOR_AFTER) x += separatorWidth;
    return x;
  };

  const [activeId, setActiveId] = useState("home");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [direction, setDirection] = useState(0);
  const hadTooltipRef = useRef(false);

  const handleHover = (id: string | null) => {
    if (hoveredId !== null && id !== null) {
      const prevIndex = ITEMS.findIndex((item) => item.id === hoveredId);
      const nextIndex = ITEMS.findIndex((item) => item.id === id);
      setDirection(nextIndex > prevIndex ? 1 : -1);
      hadTooltipRef.current = true;
    }
    if (id === null) {
      hadTooltipRef.current = false;
    }
    setHoveredId(id);
  };

  const handleSelect = (id: string) => {
    setActiveId(id);
    if (!canHover) {
      handleHover(id);
    }
  };

  const hoveredItem = ITEMS.find((item) => item.id === hoveredId);
  const hoveredIndex = ITEMS.findIndex((item) => item.id === hoveredId);
  const instantTooltip = hadTooltipRef.current;

  const bgX = hoveredItem ? getItemX(hoveredIndex) : 0;
  const tooltipX = hoveredItem ? getItemX(hoveredIndex) + itemSize / 2 : 0;

  return (
    <div className="flex w-full max-w-full items-center justify-center overflow-x-auto py-6 sm:py-8">
      <div
        className="relative flex max-w-full shrink-0 items-center rounded-full border border-border bg-background/80 shadow-lg backdrop-blur-xl"
        style={{ gap, paddingLeft: padding, paddingRight: padding, paddingTop: 8, paddingBottom: 8 }}
        onMouseLeave={() => canHover && handleHover(null)}
      >
        <AnimatePresence>
          {hoveredId && (
            <motion.div
              className="absolute top-1/2 left-0 -translate-y-1/2 rounded-xl bg-foreground/5"
              style={{ width: itemSize, height: itemSize }}
              initial={{ opacity: 0, x: bgX, scale: 0.95 }}
              animate={{ opacity: 1, x: bgX, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </AnimatePresence>

        {ITEMS.map((item, index) => (
          <React.Fragment key={item.id}>
            {index === SEPARATOR_AFTER + 1 && (
              <div
                className="bg-border"
                style={{ width: 1, height: isNarrow ? 16 : 20, marginLeft: 2, marginRight: 2 }}
              />
            )}
            <button
              type="button"
              onClick={() => handleSelect(item.id)}
              onMouseEnter={() => canHover && handleHover(item.id)}
              aria-label={item.label}
              className={`relative flex shrink-0 cursor-pointer items-center justify-center rounded-xl outline-none transition-colors duration-200 active:scale-[0.97] ${
                activeId === item.id
                  ? "text-foreground"
                  : "text-foreground/50 [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
              }`}
              style={{ width: itemSize, height: itemSize }}
            >
              <span className="relative z-10">{item.icon(iconSize)}</span>
              {activeId === item.id && (
                <motion.div
                  layoutId="preview-active-dot"
                  className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-foreground"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          </React.Fragment>
        ))}

        <AnimatePresence>
          {hoveredItem && (
            <motion.div
              key="tooltip"
              className="pointer-events-none absolute -bottom-10 left-0 z-50 whitespace-nowrap rounded-xl border-2 border-border bg-background px-2.5 py-1 shadow-sm"
              initial={
                instantTooltip
                  ? false
                  : {
                      opacity: 0,
                      y: -6,
                      scale: 0.95,
                      x: tooltipX,
                      translateX: "-50%",
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                x: tooltipX,
                translateX: "-50%",
              }}
              exit={{
                opacity: 0,
                y: -6,
                scale: 0.95,
                transition: { duration: 0.12 },
              }}
              transition={
                instantTooltip
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 300, damping: 25 }
              }
            >
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.span
                  key={hoveredItem.id}
                  className="block text-[11px] font-medium text-foreground"
                  custom={direction}
                  initial={{ opacity: 0, y: direction * 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: direction * -8 }}
                  transition={
                    instantTooltip
                      ? { duration: 0.12 }
                      : { type: "spring", stiffness: 300, damping: 25 }
                  }
                >
                  {hoveredItem.label}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
