import { useState } from "react";
import { flushSync } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import "./skeuo-theme-toggle.css";

let toggleAudioContext: AudioContext | null = null;

function playToggleClick() {
  if (!("AudioContext" in window)) return;

  const context = toggleAudioContext ?? new AudioContext();
  toggleAudioContext = context;

  if (context.state === "suspended") {
    void context.resume();
  }

  const start = context.currentTime;
  const duration = 0.028;
  const noiseBuffer = context.createBuffer(
    1,
    Math.ceil(context.sampleRate * duration),
    context.sampleRate,
  );
  const noise = noiseBuffer.getChannelData(0);

  for (let index = 0; index < noise.length; index += 1) {
    const envelope = 1 - index / noise.length;
    noise[index] = (Math.random() * 2 - 1) * envelope * envelope;
  }

  const snap = context.createBufferSource();
  const snapFilter = context.createBiquadFilter();
  const snapGain = context.createGain();
  snap.buffer = noiseBuffer;
  snapFilter.type = "bandpass";
  snapFilter.frequency.value = 1600;
  snapFilter.Q.value = 0.8;
  snapGain.gain.setValueAtTime(0.08, start);
  snapGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  snap.connect(snapFilter).connect(snapGain).connect(context.destination);
  snap.start(start);

  const body = context.createOscillator();
  const bodyGain = context.createGain();
  body.type = "sine";
  body.frequency.setValueAtTime(125, start);
  body.frequency.exponentialRampToValueAtTime(72, start + 0.045);
  bodyGain.gain.setValueAtTime(0.045, start);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.045);
  body.connect(bodyGain).connect(context.destination);
  body.start(start);
  body.stop(start + 0.05);
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4a8.5 8.5 0 1 0 11.2 11.2Z" />
    </svg>
  );
}

export function SkeuoThemeTogglePreview() {
  const reduceMotion = useReducedMotion();
  // The stage and the switch flip a beat apart: the thumb lands first, then the scene follows.
  const [isDark, setIsDark] = useState(true);
  const [toggleIsDark, setToggleIsDark] = useState(true);
  const [isThemeChanging, setIsThemeChanging] = useState(false);

  const toggleTheme = async () => {
    if (isThemeChanging) return;

    playToggleClick();

    const nextThemeIsDark = !toggleIsDark;
    setIsThemeChanging(true);
    setToggleIsDark(nextThemeIsDark);

    if (!reduceMotion) {
      await new Promise((resolve) => window.setTimeout(resolve, 150));
    }

    const commitTheme = () => {
      flushSync(() => setIsDark(nextThemeIsDark));
    };

    if (reduceMotion || !("startViewTransition" in document)) {
      commitTheme();
      setIsThemeChanging(false);
      return;
    }

    const transition = document.startViewTransition(commitTheme);

    transition.finished.finally(() => {
      setIsThemeChanging(false);
    });
  };

  return (
    <section
      className={`theme-stage ${isDark ? "theme-dark" : "theme-light"}`}
      aria-label="Theme appearance control"
    >
      <div className="theme-control">
        <div className="theme-control__well">
          <button
            className="theme-toggle"
            type="button"
            role="switch"
            aria-checked={toggleIsDark}
            aria-label={`Switch to ${toggleIsDark ? "light" : "dark"} mode`}
            disabled={isThemeChanging}
            onClick={toggleTheme}
          >
            <span
              className="theme-toggle__side theme-toggle__side--light"
              aria-hidden="true"
            >
              <SunIcon />
            </span>
            <span
              className="theme-toggle__side theme-toggle__side--dark"
              aria-hidden="true"
            >
              <MoonIcon />
            </span>

            <motion.span
              className="theme-toggle__thumb"
              initial={false}
              animate={{
                transform: toggleIsDark
                  ? "translate3d(82px, 0, 0)"
                  : "translate3d(0px, 0, 0)",
              }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", duration: 0.35, bounce: 0.2 }
              }
              aria-hidden="true"
            >
              <span className="theme-toggle__grip">
                {Array.from({ length: 12 }, (_, index) => (
                  <span className="theme-toggle__grip-dot" key={index} />
                ))}
              </span>
            </motion.span>
          </button>
        </div>
      </div>
    </section>
  );
}
