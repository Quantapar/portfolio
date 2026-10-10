import type { ReactNode } from "react";

type HighlightProps = {
  children: ReactNode;
  href?: string;
};

const highlightClassName =
  "font-medium text-foreground underline decoration-foreground/35 underline-offset-[3px]";

export function Highlight({ children, href }: HighlightProps) {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={highlightClassName}
      >
        {children}
      </a>
    );
  }

  return <span className={highlightClassName}>{children}</span>;
}
