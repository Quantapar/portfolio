import { CopyButton } from "../modern-ui/copy-button";

const EMAIL = "quantapar@gmail.com";

export function ReachOutSuffix() {
  return (
    <>
      , reach out directly at{" "}
      <a
        href={`mailto:${EMAIL}`}
        className="font-medium text-foreground underline decoration-foreground/35 underline-offset-[3px]"
      >
        {EMAIL}
      </a>
      <CopyButton
        value={EMAIL}
        className="ml-1.5 translate-y-1"
      />
    </>
  );
}
