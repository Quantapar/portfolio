import type { ReactNode } from "react";

type BevelBoxProps = {
  children: ReactNode;
  className?: string;
  /** Transparent corners + inset dotted frame — for images/media (avoids dark-mode black dots). */
  media?: boolean;
};

export function BevelBox({
  children,
  className = "",
  media = false,
}: BevelBoxProps) {
  return (
    <div
      className={`btn-bevel relative ${media ? "btn-bevel-media" : ""} ${className}`.trim()}
    >
      <span className="btn-bevel-frame" aria-hidden="true" />
      <span className="btn-bevel-corner btn-bevel-corner-tl" aria-hidden="true" />
      <span className="btn-bevel-corner btn-bevel-corner-tr" aria-hidden="true" />
      <span className="btn-bevel-corner btn-bevel-corner-bl" aria-hidden="true" />
      <span className="btn-bevel-corner btn-bevel-corner-br" aria-hidden="true" />
      {children}
    </div>
  );
}
