import { AddressCardPreview } from "../../components/showcase/AddressCardPreview";
import type { ComponentEntry } from "./types";

export const addressCard: ComponentEntry = {
  id: "address-card",
  name: "Address Card",
  description:
    "A customizable profile card with animated color picker and editable fields.",
  preview: <AddressCardPreview />,
  code: `import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_COLORS = [
  "#F43F5E", "#EC4899", "#D946EF", "#A855F7", "#8B5CF6",
  "#3B82F6", "#0EA5E9", "#06B6D4", "#14B8A6", "#10B981",
  "#22C55E", "#84CC16", "#EAB308", "#F59E0B", "#F97316",
  "#EF4444", "#D97706", "#A16207", "#0F172A", "#000000",
];

interface SocialLink {
  icon: React.ReactNode;
  url: string;
}

interface AddressCardProps {
  defaultNickname?: string;
  defaultRole?: string;
  defaultColor?: string;
  defaultLocation?: string;
  colors?: string[];
  socialLinks?: SocialLink[];
  onSave?: (data: { nickname: string; role: string; color: string; location: string }) => void;
}

export default function AddressCard({
  defaultNickname = "Quantapar",
  defaultRole = "Design Engineer",
  defaultColor = "#3B82F6",
  defaultLocation = "New Delhi, IN",
  socialLinks = [],
  colors = DEFAULT_COLORS,
  onSave,
}: AddressCardProps) {
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [nickname, setNickname] = useState(defaultNickname);
  const [role, setRole] = useState(defaultRole);
  const [location, setLocation] = useState(defaultLocation);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(role);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto">
      <motion.div
        className="w-full aspect-[1.6] rounded-3xl p-6 flex flex-col justify-between text-white shadow-xl overflow-hidden"
        animate={{ backgroundColor: selectedColor }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="flex justify-between items-start">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-sm font-medium hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={copied ? "copied" : "copy"}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                {copied ? "Copied!" : "Copy"}
              </motion.span>
            </AnimatePresence>
          </button>
          {socialLinks.length > 0 && (
            <div className="flex gap-2">
              {socialLinks.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">
                  {link.icon}
                </a>
              ))}
            </div>
          )}
        </div>
        <div>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="bg-transparent text-2xl font-semibold outline-none placeholder:text-white/50 w-full"
            placeholder="Nickname"
          />
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-transparent text-white/80 font-medium outline-none placeholder:text-white/50 w-full mt-1"
            placeholder="Role"
          />
          <div className="flex items-center gap-1 mt-1.5 opacity-70">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent text-sm outline-none w-full placeholder:text-white/50"
              placeholder="Location"
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-5 gap-4">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className="relative w-8 h-8 rounded-full group flex items-center justify-center"
          >
            <AnimatePresence>
              {selectedColor === color && (
                <motion.div
                  layoutId="color-ring"
                  className="absolute -inset-1 rounded-full border-2"
                  style={{ borderColor: color }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </AnimatePresence>
            <div
              className="w-full h-full rounded-full transition-transform group-hover:scale-110"
              style={{ backgroundColor: color }}
            />
          </button>
        ))}
      </div>

      <motion.button
        className="w-full py-3.5 rounded-2xl text-white font-medium text-lg"
        animate={{ backgroundColor: selectedColor }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSave?.({ nickname, role, color: selectedColor, location })}
      >
        Save
      </motion.button>
    </div>
  );
}`,
  npmCommand: "npm install framer-motion",
  props: [
    {
      name: "defaultNickname",
      type: "string",
      required: false,
      description: "Initial nickname. Default: 'Quantapar'",
    },
    {
      name: "defaultRole",
      type: "string",
      required: false,
      description:
        "Initial role text. Default: 'Frontend Developer & Designer'",
    },
    {
      name: "defaultColor",
      type: "string",
      required: false,
      description: "Initial card color. Default: '#F97316'",
    },
    {
      name: "defaultLocation",
      type: "string",
      required: false,
      description: "Initial location text. Default: 'San Francisco, CA'",
    },
    {
      name: "colors",
      type: "string[]",
      required: false,
      description: "Array of hex colors for the picker",
    },
    {
      name: "socialLinks",
      type: "{ icon: ReactNode; url: string }[]",
      required: false,
      description: "Array of social link objects with icon and URL",
    },
    {
      name: "onSave",
      type: "(data) => void",
      required: false,
      description: "Callback when Save is clicked with current state",
    },
  ],
};
