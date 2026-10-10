import { useEffect, useId, useRef, useState } from "react";

type CopyEmailButtonProps = {
  email: string;
  className?: string;
};

const COPIED_MS = 1500;

export function CopyEmailButton({
  email,
  className = "",
}: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);
  const maskId = useId();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // No clipboard access: opening the mail app still gets them the address.
      window.location.href = `mailto:${email}`;
      return;
    }

    setCopied(true);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), COPIED_MS);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      data-copied={copied ? "" : undefined}
      aria-label={`Copy email address ${email}`}
      className={className}
    >
      <svg
        className="copy-check mr-[0.4375rem] text-foreground/50"
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* The front sheet cuts its outline out of the back one, so the gap follows it as they merge. */}
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#fff" stroke="none" />
          <rect
            className="copy-check-sheet"
            x="8.75"
            y="8.75"
            width="13"
            height="13"
            rx="3.75"
            fill="#000"
            stroke="#000"
            strokeWidth="4.2"
          />
        </mask>
        <g mask={`url(#${maskId})`}>
          <rect
            className="copy-check-sheet copy-check-back"
            x="2.25"
            y="2.25"
            width="13"
            height="13"
            rx="3.75"
          />
        </g>
        <rect
          className="copy-check-sheet"
          x="8.75"
          y="8.75"
          width="13"
          height="13"
          rx="3.75"
        />
        <path
          className="copy-check-tick"
          d="M8 12.3L11.1 15.4L16.3 9.2"
          pathLength="1"
        />
      </svg>
      {email}
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied" : ""}
      </span>
    </button>
  );
}
