import { ThemeToggle } from "../ThemeToggle";

export function SiteHeader() {
  return (
    <header>
      <div className="flex items-center justify-end px-6 py-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
