import { Link } from "react-router-dom";
import { DitheredLogo } from "../components/work/previews/DitheredLogo";
import { useTheme } from "../hooks/useTheme";

export function NotFoundPage() {
  const { theme } = useTheme();
  const particleColor = theme === "dark" ? "#f9f8f8" : "#000000";

  return (
    <main className="flex min-h-[calc(100dvh-12rem)] flex-col items-center justify-center">
      <div className="relative h-48 w-full max-w-2xl sm:h-64">
        <DitheredLogo
          imageSrc="/work/404-dither.svg"
          particleColor={particleColor}
          scale={0.92}
        />
      </div>

      <p className="mt-6 text-center text-base font-medium tracking-tight text-foreground sm:text-lg">
        Wrong door.
      </p>
      <p className="mt-2 max-w-xs text-center text-sm text-foreground/60">
        This page isn’t here. Maybe it wandered off.
      </p>

      <div className="mt-8">
        <Link
          to="/"
          className="pressable btn-bevel relative inline-flex min-h-11 items-center px-3 py-2 text-sm"
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
          Back home
        </Link>
      </div>
    </main>
  );
}
