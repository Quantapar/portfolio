import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const LayersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);
const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

interface ToolbarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const ITEMS: ToolbarItem[] = [
  { id: "home", label: "Home", icon: <HomeIcon /> },
  { id: "projects", label: "Projects", icon: <LayersIcon /> },
  { id: "components", label: "Components", icon: <GridIcon /> },
  { id: "about", label: "About", icon: <UserIcon /> },
  { id: "theme", label: "Dark Mode", icon: <MoonIcon /> },
];

const SEPARATOR_AFTER = 3;
const ITEM_SIZE = 44;
const GAP = 8;
const PADDING = 16;
const SEPARATOR_WIDTH = 13;

const getItemX = (index: number) => {
  let x = PADDING + index * (ITEM_SIZE + GAP);
  if (index > SEPARATOR_AFTER) x += SEPARATOR_WIDTH;
  return x;
};

export const FloatingToolbarPreview = () => {
  const [activeId, setActiveId] = useState("home");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [direction, setDirection] = useState(0);

  const handleHover = (id: string | null) => {
    if (hoveredId !== null && id !== null) {
      const prevIndex = ITEMS.findIndex((item) => item.id === hoveredId);
      const nextIndex = ITEMS.findIndex((item) => item.id === id);
      setDirection(nextIndex > prevIndex ? 1 : -1);
    }
    setHoveredId(id);
  };

  const hoveredItem = ITEMS.find((item) => item.id === hoveredId);
  const hoveredIndex = ITEMS.findIndex((item) => item.id === hoveredId);

  const bgX = hoveredItem ? getItemX(hoveredIndex) : 0;
  const tooltipX = hoveredItem ? getItemX(hoveredIndex) + ITEM_SIZE / 2 : 0;

  return (
    <div className="flex items-center justify-center py-8">
      <div
        className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-(--bg-secondary)/80 backdrop-blur-xl border border-(--border-color) shadow-lg"
        onMouseLeave={() => setHoveredId(null)}
      >
        <AnimatePresence>
          {hoveredId && (
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 left-0 rounded-xl bg-(--bg-tertiary)"
              style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
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
              <div className="w-px h-5 bg-(--border-color) mx-0.5" />
            )}
            <button
              onClick={() => setActiveId(item.id)}
              onMouseEnter={() => handleHover(item.id)}
              className={`relative flex items-center justify-center w-11 h-11 rounded-xl transition-colors duration-200 outline-none cursor-pointer active:scale-[0.95] ${
                activeId === item.id
                  ? "text-(--text-primary)"
                  : "text-(--text-muted) hover:text-(--text-primary)"
              }`}
            >
              <span className="relative z-10">{item.icon}</span>
              {activeId === item.id && (
                <motion.div
                  layoutId="preview-active-dot"
                  className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-(--text-primary)"
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
              className="absolute -bottom-10 left-0 px-2.5 py-1 bg-(--bg-secondary) border-2 border-(--border-color) rounded-xl shadow-sm whitespace-nowrap z-50 pointer-events-none"
              initial={{
                opacity: 0,
                y: -6,
                scale: 0.95,
                x: tooltipX,
                translateX: "-50%",
              }}
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
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.span
                  key={hoveredItem.id}
                  className="text-[11px] font-medium text-(--text-primary) block"
                  custom={direction}
                  initial={{ opacity: 0, y: direction * 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: direction * -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
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
