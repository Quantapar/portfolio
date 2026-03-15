import React, { useState } from "react";
import { motion } from "framer-motion";

const favMovies = [
  { title: "Fight Club", img: "/fight_club.jpg" },
  { title: "Interstellar", img: "/interstellar.jpg" },
  { title: "The Martian", img: "/martian.jpg" },
  { title: "Inception", img: "/inception.jpg" },
  { title: "Oppenheimer", img: "/oppenheimer.jpg" },
  { title: "Tenet", img: "/tenet.jpg" },
];

const spring = { type: "spring" as const, stiffness: 400, damping: 28 };

export const MovieShelf = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const isAnyHovered = hovered !== null;

  return (
    <div className="flex justify-center w-full mt-4">
      <div
        className="flex isolate"
        onMouseLeave={() => setHovered(null)}
      >
        {favMovies.map((movie, index) => {
          const isHovered = hovered === index;
          const offset = isAnyHovered ? -8 : -32;

          return (
            <motion.div
              key={index}
              className="relative w-28 h-40 sm:w-32 sm:h-48 shrink-0 rounded-lg overflow-hidden border-2 border-(--bg-primary) cursor-pointer focus-visible:outline-none"
              style={{
                zIndex: isHovered ? 50 : 10 + index,
                transformOrigin: "bottom center",
              }}
              animate={{
                marginLeft: index === 0 ? 0 : offset,
                y: isHovered ? -16 : 0,
                scale: isHovered ? 1.05 : 1,
                rotate: isHovered ? 0 : (index - 2.5) * 0.8,
              }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              onMouseEnter={() => setHovered(index)}
              tabIndex={0}
              onFocus={() => setHovered(index)}
            >
              <motion.img
                src={movie.img}
                alt={movie.title}
                className="w-full h-full object-cover"
                animate={{
                  scale: isHovered ? 1.08 : 1,
                }}
                transition={spring}
              />
              <motion.div
                className="absolute inset-0 bg-black/30"
                animate={{ opacity: isHovered ? 0 : 0.15 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
              <motion.div
                className="absolute bottom-0 left-0 right-0 px-2 py-2 bg-linear-to-t from-black/70 to-transparent"
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 8 }}
                transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              >
                <span className="text-[10px] font-medium text-white/90 tracking-wide">
                  {movie.title}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
