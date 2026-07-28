import { ThemeToggle } from "../ThemeToggle";

export function SiteHeader() {
  return (
    <header>
      <div className="flex items-center justify-between px-6 py-4">
        <a
          href="#"
          className="font-heading text-lg font-medium tracking-tight text-foreground"
        >
          Manu Sharma
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
