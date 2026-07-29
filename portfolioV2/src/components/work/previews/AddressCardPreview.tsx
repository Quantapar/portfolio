import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
  "#F43F5E",
  "#EC4899",
  "#D946EF",
  "#A855F7",
  "#3B82F6",
  "#06B6D4",
  "#10B981",
  "#EAB308",
  "#F97316",
];

export const AddressCardPreview = () => {
  const [color, setColor] = useState(COLORS[4]);
  const [name, setName] = useState("Quantapar");
  const [role, setRole] = useState("Design Engineer");
  const [location, setLocation] = useState("New Delhi, IN");
  const [bellRing, setBellRing] = useState(false);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm">
      <motion.div
        className="w-full aspect-[1.7] rounded-2xl p-5 flex flex-col justify-between text-white shadow-lg relative overflow-hidden"
        animate={{ backgroundColor: color }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between items-start">
          <button
            onClick={() => {
              setBellRing(true);
              setTimeout(() => setBellRing(false), 800);
            }}
            className="relative opacity-80 hover:opacity-100 cursor-pointer"
          >
            <AnimatePresence>
              {bellRing && (
                <>
                  <motion.div
                    className="absolute -inset-2 rounded-full border-2 border-white/40"
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                  <motion.div
                    className="absolute -inset-1 rounded-full border border-white/30"
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                  />
                </>
              )}
            </AnimatePresence>
            <motion.div
              animate={
                bellRing
                  ? {
                      rotate: [0, 18, -18, 14, -14, 8, -8, 0],
                      scale: [1, 1.2, 1.2, 1.15, 1.15, 1.05, 1.05, 1],
                    }
                  : { rotate: 0, scale: 1 }
              }
              transition={{ duration: 0.7, ease: "easeInOut" }}
              style={{ transformOrigin: "top center" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
            </motion.div>
          </button>
          <div className="flex gap-2.5 opacity-80">
            <a
              href="https://github.com/Quantapar"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://x.com/quantapar"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/iknewtyler/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent text-xl font-semibold outline-none w-full placeholder:text-white/50"
            placeholder="Name"
          />
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-transparent text-sm opacity-70 outline-none w-full placeholder:text-white/50"
            placeholder="Role"
          />
          <div className="flex items-center gap-1 mt-1 opacity-60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent text-[11px] outline-none w-full placeholder:text-white/50"
              placeholder="Location"
            />
          </div>
        </div>
      </motion.div>
      <div className="flex gap-2.5">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className="relative w-6 h-6 rounded-full"
          >
            <AnimatePresence>
              {color === c && (
                <motion.div
                  layoutId="ring"
                  className="absolute -inset-1 rounded-full border-2"
                  style={{ borderColor: c }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
            </AnimatePresence>
            <div
              className="w-full h-full rounded-full"
              style={{ backgroundColor: c }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
