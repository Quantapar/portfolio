import type { ReactNode } from "react";

type OutlineIconProps = {
  className?: string;
};

/** Stroke icons sized to sit beside 14px text, matching the copy icon in the email chip. */
function OutlineIcon({
  className = "",
  children,
}: OutlineIconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`.trim()}
    >
      {children}
    </svg>
  );
}

export function XOutlineIcon({ className }: OutlineIconProps) {
  return (
    <OutlineIcon className={className}>
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </OutlineIcon>
  );
}

export function GitHubOutlineIcon({ className }: OutlineIconProps) {
  return (
    <OutlineIcon className={className}>
      <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
    </OutlineIcon>
  );
}

export function LinkedInOutlineIcon({ className }: OutlineIconProps) {
  return (
    <OutlineIcon className={className}>
      <path d="M8 11v5" />
      <path d="M8 8v.01" />
      <path d="M12 16v-5" />
      <path d="M16 16v-3a2 2 0 1 0 -4 0" />
      <path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z" />
    </OutlineIcon>
  );
}

/** LinkedIn's letters without the square around them, for a tile that already is one. */
export function LinkedInLettersIcon({ className }: OutlineIconProps) {
  return (
    <svg
      viewBox="4 4 16 16"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className ?? ""}`.trim()}
    >
      {/* Drawn larger than in the square icon, so its own width keeps the lines from growing heavy. */}
      <g strokeWidth="1.55">
        <path d="M8 11v5" />
        <path d="M8 8v.01" />
        <path d="M12 16v-5" />
        <path d="M16 16v-3a2 2 0 1 0 -4 0" />
      </g>
    </svg>
  );
}

export function CalendarOutlineIcon({ className }: OutlineIconProps) {
  return (
    <OutlineIcon className={className}>
      <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M4 11h16" />
    </OutlineIcon>
  );
}
