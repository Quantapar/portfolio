import { useTheme } from "../context/ThemeProvider";

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-4"
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
      className="size-4"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
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
      className="pressable btn-bevel relative flex size-10 shrink-0 items-center justify-center text-foreground"
    >
      <span className="btn-bevel-frame" aria-hidden="true" />
      <span
        className="btn-bevel-corner btn-bevel-corner-tl"
        aria-hidden="true"
      />
      <span
        className="btn-bevel-corner btn-bevel-corner-tr"
        aria-hidden="true"
      />
      <span
        className="btn-bevel-corner btn-bevel-corner-bl"
        aria-hidden="true"
      />
      <span
        className="btn-bevel-corner btn-bevel-corner-br"
        aria-hidden="true"
      />
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
