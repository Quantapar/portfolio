import type { ReactNode } from "react";

type HighlightProps = {
  children: ReactNode;
  href?: string;
};


export function Highlight({ children, href }: HighlightProps) {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="link-inline"
      >
        {children}
      </a>
    );
  }

  return <span className="font-medium text-foreground">{children}</span>;
}
