import { motion, useReducedMotion } from "framer-motion";
import "./reject-button.css";

export function RejectButtonPreview() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="reject-button-demo"
      className="reject-button-demo"
      aria-label="Interactive button"
    >
      <motion.button
        type="button"
        className="reject-button"
        whileHover={reduceMotion ? undefined : { y: -1 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 38,
          mass: 0.55,
        }}
      >
        <span className="reject-button__label">Button</span>
      </motion.button>
    </section>
  );
}

