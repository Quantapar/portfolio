import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
};

const STORAGE_KEY = "theme";
/** Flip to false later if we decide to drop the theme woosh. */
const ENABLE_THEME_SOUND = true;

const ThemeContext = createContext<ThemeContextValue | null>(null);

function playThemeSound() {
  if (!ENABLE_THEME_SOUND) return;
  const audio = new Audio("/audio/woosh.mp3");
  audio.volume = 0.35;
  void audio.play().catch(() => {});
}

function getPreferredTheme(): Theme {
  // Light mode only for now. Restore the lines below to honour a saved or system preference.
  return "light";

  // const stored = localStorage.getItem(STORAGE_KEY);
  // if (stored === "light" || stored === "dark") {
  //   return stored;
  // }
  //
  // return window.matchMedia("(prefers-color-scheme: dark)").matches
  //   ? "dark"
  //   : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => getPreferredTheme());
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    if (isAnimatingRef.current) {
      return;
    }

    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    playThemeSound();

    if (prefersReducedMotion || !document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    isAnimatingRef.current = true;

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
        applyTheme(nextTheme);
      });
    });

    transition.finished.finally(() => {
      isAnimatingRef.current = false;
    });
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === "dark",
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
