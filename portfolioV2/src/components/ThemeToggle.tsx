import { useTheme } from "../context/ThemeProvider";

const ICON_CLIP_HIDDEN = "circle(8% at 50% 50%)";
const ICON_CLIP_VISIBLE = "circle(100% at 50% 50%)";

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a6.5 6.5 0 0 0 11.5 11.5z" />
    </svg>
  );
}

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="pressable fixed top-5 right-5 z-[300] flex size-10 items-center justify-center rounded-full text-foreground"
    >
      <span className="relative size-5">
        <span
          className="absolute inset-0 flex items-center justify-center icon-morph"
          style={{
            clipPath: isDark ? ICON_CLIP_HIDDEN : ICON_CLIP_VISIBLE,
          }}
        >
          <SunIcon />
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center icon-morph"
          style={{
            clipPath: isDark ? ICON_CLIP_VISIBLE : ICON_CLIP_HIDDEN,
          }}
        >
          <MoonIcon />
        </span>
      </span>
    </button>
  );
}
