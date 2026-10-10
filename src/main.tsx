import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/geist/wght.css";
import "@fontsource-variable/schibsted-grotesk/wght.css";
import "@fontsource-variable/schibsted-grotesk/wght-italic.css";
import { ThemeProvider } from "./context/ThemeProvider";
import "./index.css";
import App from "./App.tsx";

// Light mode only for now. Restore this to honour a saved or system dark preference.
// const storedTheme = localStorage.getItem("theme");
// const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//
// if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
//   document.documentElement.classList.add("dark");
// }

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
