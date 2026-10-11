import { useEffect, useRef, useState } from "react";

const PRIMARY_SRC = "/avatar.jpg";
const ALT_SRC = "/avatar-alt.jpg";
/** Flip to false later if we decide to drop the sound. */
const ENABLE_AVATAR_SOUND = true;
const GLITCH_MS = 450;

function playGlitchSound() {
  if (!ENABLE_AVATAR_SOUND) return;
  const audio = new Audio("/audio/glitch.wav");
  audio.volume = 0.12;
  void audio.play().catch(() => {});
}

export function FightClubAvatar() {
  const [showAlt, setShowAlt] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    for (const src of [PRIMARY_SRC, ALT_SRC]) {
      const img = new Image();
      img.src = src;
    }
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const swap = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    setShowAlt((prev) => !prev);

    if (prefersReducedMotion) return;

    // Drop the class for a frame so CSS restarts the animation on every swap.
    setGlitching(false);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    requestAnimationFrame(() => {
      setGlitching(true);
      timerRef.current = window.setTimeout(() => {
        setGlitching(false);
        timerRef.current = null;
      }, GLITCH_MS);
    });
  };

  return (
    <button
      type="button"
      aria-label="Swap Fight Club avatar"
      // The swap, its glitch and its sound are one effect and answer a press only.
      // A passing cursor or keyboard focus is not a request for any of it.
      onClick={() => {
        playGlitchSound();
        swap();
      }}
      className="size-11 shrink-0 overflow-hidden border border-dotted border-border p-0"
    >
      <img
        src={showAlt ? ALT_SRC : PRIMARY_SRC}
        alt=""
        draggable={false}
        className={`size-full select-none object-cover ${glitching ? "glitch-image" : ""}`}
      />
    </button>
  );
}
