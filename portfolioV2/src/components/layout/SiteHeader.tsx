import { Link } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle";

type SiteHeaderProps = {
  showBrand?: boolean;
};

export function SiteHeader({ showBrand = true }: SiteHeaderProps) {
  return (
    <header>
      <div
        className={`flex items-center px-4 py-4 sm:px-6 ${
          showBrand ? "justify-between" : "justify-end"
        }`}
      >
        {showBrand ? (
          <Link
            to="/"
            className="pressable font-heading text-lg font-medium tracking-tight text-foreground"
          >
            Manu Sharma
          </Link>
        ) : null}
        <ThemeToggle />
      </div>
    </header>
  );
}
