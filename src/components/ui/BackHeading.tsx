import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type BackHeadingProps = {
  to: string;
  children: ReactNode;
  className?: string;
};

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5"
      aria-hidden="true"
    >
      <path d="M10 3 5 8l5 5" />
    </svg>
  );
}

export function BackHeading({ to, children, className = "" }: BackHeadingProps) {
  return (
    <h1 className={`text-lg font-medium ${className}`.trim()}>
      <Link
        to={to}
        className="pressable group inline-flex max-w-full items-center gap-2.5 text-foreground"
      >
        <span
          aria-hidden="true"
          className="inline-flex size-7 shrink-0 items-center justify-center border border-dotted border-transparent text-foreground/70 transition-[border-color,background-color,color] duration-[160ms] ease-[var(--ease-out)] group-hover:border-border group-hover:bg-foreground/[0.06] group-hover:text-foreground"
        >
          <ChevronLeftIcon />
        </span>
        <span className="min-w-0 truncate">{children}</span>
      </Link>
    </h1>
  );
}
