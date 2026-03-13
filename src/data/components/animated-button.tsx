import type { ComponentEntry } from "./types";

export const animatedButton: ComponentEntry = {
  id: "example-button",
  name: "Animated Button",
  description:
    "A button with smooth press and hover animations using Framer Motion.",
  preview: (
    <button className="px-8 py-4 rounded-xl bg-(--text-primary) text-(--bg-primary) text-lg font-semibold active:scale-95 transition-transform duration-150 shadow-md">
      Click me
    </button>
  ),
  code: `import { motion } from "framer-motion";

export const AnimatedButton = ({ children, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium"
    {...props}
  >
    {children}
  </motion.button>
);`,
  npmCommand: "npm install framer-motion",
  props: [
    { name: "children", type: "React.ReactNode", required: true, description: "Button content" },
    { name: "onClick", type: "() => void", required: false, description: "Click handler" },
    { name: "disabled", type: "boolean", required: false, description: "Disable the button" },
    { name: "className", type: "string", required: false, description: "Additional CSS classes" },
  ],
};
