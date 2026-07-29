import { Link } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle";

export function SiteHeader() {
  return (
    <header>
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="pressable font-heading text-lg font-medium tracking-tight text-foreground"
        >
          Manu Sharma
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
