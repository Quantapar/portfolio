import React, { useState } from "react";
import { motion } from "framer-motion";

const favSongs = [
  {
    title: "Runaway",
    artist: "Kanye West",
    img: "https://i.pinimg.com/736x/ad/9b/5b/ad9b5baf2f9eaed6c7a53cce787bbd20.jpg",
  },
  {
    title: "Sunsetz",
    artist: "Cigarettes After Sex",
    img: "https://i.pinimg.com/736x/f0/c1/8f/f0c18f383ce20af21ae89f253349726a.jpg",
  },
  {
    title: "No One Noticed",
    artist: "The Marías",
    img: "https://i.pinimg.com/736x/7a/7c/6a/7a7c6ad81c5c7315b7255998bf22f383.jpg",
  },
  {
    title: "I Wanna Be Yours",
    artist: "Arctic Monkeys",
    img: "https://i.pinimg.com/736x/1b/62/a1/1b62a17c242bc7422ec198f095cbf40b.jpg",
  },
  {
    title: "505",
    artist: "Arctic Monkeys",
    img: "https://i.pinimg.com/736x/bf/83/24/bf83249d345133178b9e249cf8274a77.jpg",
  },
  {
    title: "Without Me",
    artist: "Eminem",
    img: "https://i.pinimg.com/736x/67/7c/47/677c4748b46a2d97d4903fbbc8337f4a.jpg",
  },
];

const spring = { type: "spring" as const, stiffness: 400, damping: 28 };

export const MusicShelf = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const isAnyHovered = hovered !== null;

  return (
    <div className="flex justify-center sm:justify-start w-full mt-4 pl-1">
      <div
        className="flex isolate"
        onMouseLeave={() => setHovered(null)}
      >
        {favSongs.map((song, index) => {
          const isHovered = hovered === index;
          const offset = isAnyHovered ? -8 : -32;

          return (
            <motion.div
              key={index}
              className="relative w-28 h-48 sm:w-32 sm:h-56 shrink-0 rounded-lg overflow-hidden border-2 border-(--bg-primary) cursor-pointer focus-visible:outline-none"
              style={{
                zIndex: isHovered ? 50 : 10 + index,
                transformOrigin: "bottom center",
              }}
              animate={{
                marginLeft: index === 0 ? 0 : offset,
                y: isHovered ? -16 : 0,
                scale: isHovered ? 1.05 : 1,
                rotate: isHovered ? 0 : (index - 1) * 0.8,
              }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              onMouseEnter={() => setHovered(index)}
              tabIndex={0}
              onFocus={() => setHovered(index)}
            >
              <motion.img
                src={song.img}
                alt={`${song.title} by ${song.artist}`}
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
                <span className="text-[10px] font-medium text-white/90 tracking-wide block">
                  {song.title}
                </span>
                <span className="text-[8px] text-white/60 block mt-0.5">
                  {song.artist}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
