import { CopyButton } from "../modern-ui/copy-button";

import { EMAIL } from "../../data/site";

export function ReachOutSuffix() {
  return (
    <>
      , reach out directly at{" "}
      <span className="inline-flex max-w-full flex-wrap items-center gap-x-1.5 gap-y-1">
        <a
          href={`mailto:${EMAIL}`}
          className="break-all font-medium text-foreground underline decoration-foreground/35 underline-offset-[3px] sm:break-normal"
        >
          {EMAIL}
        </a>
        <CopyButton value={EMAIL} className="translate-y-1" />
      </span>
    </>
  );
}
