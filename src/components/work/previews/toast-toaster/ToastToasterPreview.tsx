import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./toast-toaster.css";

function supportsHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function ToastToaster() {
  const reduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isKeyboardFocused, setIsKeyboardFocused] = useState(false);
  const isOpen = isHovered || isFocused;
  const toastTransition =
    reduceMotion || isKeyboardFocused
      ? { duration: 0 }
      : { type: "spring" as const, duration: 0.55, bounce: 0.18 };
  const controlTransition =
    reduceMotion || isKeyboardFocused
      ? { duration: 0 }
      : { type: "spring" as const, duration: 0.35, bounce: 0.12 };

  return (
    <button
      className="toast-toaster"
      type="button"
      aria-expanded={isOpen}
      aria-controls="toast-toaster-message"
      aria-label={isOpen ? "Hide toast" : "Show toast"}
      onPointerEnter={() => {
        if (supportsHover()) setIsHovered(true);
      }}
      onPointerLeave={() => setIsHovered(false)}
      onFocus={(event) => {
        const isKeyboardFocus = event.currentTarget.matches(":focus-visible");
        setIsFocused(isKeyboardFocus);
        setIsKeyboardFocused(isKeyboardFocus);
      }}
      onBlur={() => {
        setIsFocused(false);
        setIsKeyboardFocused(false);
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        setIsHovered(false);
        setIsFocused(false);
        event.currentTarget.blur();
      }}
    >
      <span className="toast-toaster__assembly">
        <motion.span
          id="toast-toaster-message"
          className="toast-toaster__toast"
          initial={false}
          animate={{
            opacity: isOpen ? 1 : 0,
            transform: reduceMotion
              ? "translate3d(0, -116px, 0)"
              : isOpen
                ? "translate3d(0, -116px, 0) rotate(0deg)"
                : "translate3d(0, 92px, 0) rotate(-1.5deg)",
          }}
          transition={toastTransition}
          aria-hidden={!isOpen}
        >
          <span className="toast-toaster__toast-message">
            Warm, crisp, and ready.
          </span>
        </motion.span>

        <motion.span
          className="toast-toaster__lever"
          animate={{
            transform: isOpen
              ? "translate3d(0, -34px, 0)"
              : "translate3d(0, 20px, 0)",
          }}
          transition={controlTransition}
          aria-hidden="true"
        />

        <span className="toast-toaster__body" aria-hidden="true">
          <span className="toast-toaster__slot" />
          <span className="toast-toaster__shine" />

          <span className="toast-toaster__controls">
            <span className="toast-toaster__timer">
              <motion.span
                className="toast-toaster__timer-knob"
                animate={{
                  transform: isOpen ? "rotate(215deg)" : "rotate(32deg)",
                }}
                transition={controlTransition}
              >
                <span className="toast-toaster__timer-indicator" />
              </motion.span>
            </span>
            <span className="toast-toaster__button" />
          </span>

          <span className="toast-toaster__base" />
        </span>
      </span>

      <motion.span
        className="toast-toaster__floor-shadow"
        animate={{
          opacity: isOpen ? 0.38 : 0.62,
          transform: isOpen
            ? "translate3d(-50%, 0, 0) scaleX(0.88)"
            : "translate3d(-50%, 0, 0) scaleX(1)",
        }}
        transition={controlTransition}
        aria-hidden="true"
      />
    </button>
  );
}


export function ToastToasterPreview() {
  return (
    <section
      className="toast-toaster-stage"
      aria-label="Animated toast notification toaster"
    >
      <ToastToaster />
    </section>
  );
}
