import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./skeuo-keypad.css";

type KeyId = "power" | "play" | "pause" | "stop";
type Mode = Exclude<KeyId, "power">;

type Palette = {
  skirt: string; // keycap body, visible as the lip below the dish
  cap: string; // concave top dish
  icon: string;
  iconOn: string;
  tint: string; // rgb triplet for the cast shadow
  light: string; // rgb triplet for rim highlights, the key's own top color
};

const palettes: Record<"power" | "white", Palette> = {
  power: {
    // Same OKLCH lightness steps as white, so only the hue differs
    skirt: "linear-gradient(180deg, #eeb1ba 0%, #de98a3 55%, #c37683 100%)",
    cap: "linear-gradient(180deg, #e2a0aa 0%, #ebacb6 55%, #eeb1ba 100%)",
    icon: "#d78e9a",
    iconOn: "#b9556a",
    tint: "120, 35, 50",
    light: "238, 177, 186",
  },
  white: {
    skirt: "linear-gradient(180deg, #ffffff 0%, #ece7e4 55%, #cfc6c2 100%)",
    cap: "linear-gradient(180deg, #f1eeec 0%, #fbfafa 55%, #ffffff 100%)",
    icon: "#e3dedb",
    iconOn: "#d39aa3",
    tint: "90, 65, 60",
    light: "255, 255, 255",
  },
};

// Same layer count in every state so motion can interpolate.
// Light from the top: bright top rim, shade on the lower skirt, soft cast shadow below.
const castShadow = ({ tint, light }: Palette, depth: number) =>
  [
    `inset 0 1px 0 rgba(${light},0.75)`,
    "inset 0 -3px 4px rgba(0,0,0,0.10)",
    `0 ${depth * 0.25}px ${depth * 0.3}px rgba(${tint},0.22)`,
    `0 ${depth}px ${depth * 1.4}px -${depth * 0.4}px rgba(${tint},0.20)`,
    `0 ${depth * 2.2}px ${depth * 3}px -${depth}px rgba(${tint},0.22)`,
  ].join(", ");

const icons: Record<KeyId, React.ReactNode> = {
  power: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
    >
      <path d="M12 3.5v7.5" />
      <path d="M6.7 6.9a7.3 7.3 0 1 0 10.6 0" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.8v12.4a1 1 0 0 0 1.52.85l9.9-6.2a1 1 0 0 0 0-1.7l-9.9-6.2A1 1 0 0 0 8 5.8Z" />
    </svg>
  ),
  pause: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <rect x="6.5" y="5" width="3.8" height="14" rx="1.4" />
      <rect x="13.7" y="5" width="3.8" height="14" rx="1.4" />
    </svg>
  ),
  stop: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <rect x="5.5" y="5.5" width="13" height="13" rx="2.6" />
    </svg>
  ),
};

const keys: { id: KeyId; label: string }[] = [
  { id: "power", label: "Power" },
  { id: "play", label: "Play" },
  { id: "pause", label: "Pause" },
  { id: "stop", label: "Stop" },
];

const spring = {
  type: "spring",
  stiffness: 900,
  damping: 30,
  mass: 0.6,
} as const;

function useKeyClick() {
  const ctx = useRef<AudioContext | null>(null);
  return (pitch: number) => {
    ctx.current ??= new AudioContext();
    const ac = ctx.current;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(pitch, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      pitch * 0.4,
      ac.currentTime + 0.04,
    );
    gain.gain.setValueAtTime(0.05, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.05);
    osc.connect(gain).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.06);
  };
}

type KeyProps = {
  id: KeyId;
  label: string;
  latched: boolean;
  disabled: boolean;
  onPress: () => void;
};

function Key({ id, label, latched, disabled, onPress }: KeyProps) {
  const reduceMotion = useReducedMotion();
  const palette = id === "power" ? palettes.power : palettes.white;

  return (
    <motion.button
      type="button"
      aria-label={label}
      aria-pressed={latched}
      disabled={disabled}
      onClick={onPress}
      initial={false}
      animate={latched ? "latched" : "idle"}
      whileTap={disabled ? undefined : "pressed"}
      variants={{
        idle: { y: 0, scale: 1, boxShadow: castShadow(palette, 12) },
        latched: { y: 3, scale: 0.99, boxShadow: castShadow(palette, 6) },
        pressed: { y: 5, scale: 0.975, boxShadow: castShadow(palette, 3) },
      }}
      transition={reduceMotion ? { duration: 0 } : spring}
      className="relative size-[96px] cursor-pointer rounded-[14px] outline-none transition-[filter] duration-150 hover:brightness-[1.02] focus-visible:ring-2 focus-visible:ring-[#c26f7d]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#efecea] disabled:cursor-default disabled:hover:brightness-100"
      style={{
        background: palette.skirt,
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Concave dish: shaded under the top rim, bright lip at the bottom */}
      <span
        className="absolute inset-x-[7px] top-[5px] bottom-[15px] grid place-items-center rounded-[20px_20px_24px_24px/22px_22px_28px_28px]"
        style={{
          background: palette.cap,
          boxShadow: [
            "inset 0 8px 10px -6px rgba(0,0,0,0.10)",
            `inset 0 -2px 2px rgba(${palette.light},0.65)`,
            `0 1px 1px rgba(${palette.light},0.5)`,
            `0 2px 3px rgba(${palette.tint},0.12)`,
          ].join(", "),
        }}
      >
        {/* Engraved icon: dark top edge, light bottom edge */}
        <span
          className="size-[30px] transition-colors duration-200 [&>svg]:size-full"
          style={{
            color: latched ? palette.iconOn : palette.icon,
            filter: `drop-shadow(0 1px 0 rgba(${palette.light},0.7)) drop-shadow(0 -1px 0 rgba(0,0,0,0.10))`,
          }}
        >
          {icons[id]}
        </span>
      </span>
    </motion.button>
  );
}

export function SkeuoKeypadPreview() {
  const [powered, setPowered] = useState(true);
  const [mode, setMode] = useState<Mode>("stop");
  const click = useKeyClick();

  const press = (id: KeyId) => {
    if (id === "power") {
      click(powered ? 520 : 760);
      setPowered((p) => !p);
      setMode("stop");
      return;
    }
    click(id === "stop" ? 600 : 900);
    setMode(id);
  };

  return (
    <section
      // The column may be narrower than the tray, so the tray stays centred instead of widening the page.
      className="grid min-h-dvh grid-cols-[minmax(0,1fr)] place-items-center overflow-hidden bg-[#f4f2f1] p-6"
      aria-label="Skeuomorphic media keys"
    >
      {/* Recessed tray */}
      <div
        className="skeuo-keypad-tray"
        role="group"
        aria-label="Media controls"
      >
        {keys.map(({ id, label }) => (
          <Key
            key={id}
            id={id}
            label={label}
            latched={id === "power" ? powered : powered && mode === id}
            disabled={id !== "power" && !powered}
            onPress={() => press(id)}
          />
        ))}
      </div>
    </section>
  );
}
