import { Link } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle";

export function SiteHeader() {
  return (
    <header>
      <div className="flex items-center justify-between px-6 py-4">
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
