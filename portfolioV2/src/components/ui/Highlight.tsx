import type { ReactNode } from "react";

type HighlightProps = {
  children: ReactNode;
};

export function Highlight({ children }: HighlightProps) {
  return (
    <span className="font-medium text-foreground underline decoration-foreground/35 underline-offset-[3px]">
      {children}
    </span>
  );
}
