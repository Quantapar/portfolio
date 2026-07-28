import { useState } from "react";

const EMAIL = "quantpar@gmail.com";

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className="size-3"
    >
      <rect x="3.5" y="1.5" width="7" height="7" rx="1" />
      <rect x="1.5" y="3.5" width="7" height="7" rx="1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3"
    >
      <path d="M2.5 6 4.5 8 9.5 3" />
    </svg>
  );
}

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Email copied" : "Copy email address"}
      className="pressable ml-1 inline-flex translate-y-px items-center text-foreground/45"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}

export function ReachOutSuffix() {
  return (
    <>
      , reach out at{" "}
      <a
        href={`mailto:${EMAIL}`}
        className="text-foreground underline-offset-2 hover:underline"
      >
        {EMAIL}
      </a>
      <CopyEmailButton />.
    </>
  );
}
