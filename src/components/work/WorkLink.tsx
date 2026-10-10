import type { ReactNode } from "react";

type WorkLinkProps = {
  href: string;
  label: string;
  icon?: ReactNode;
};

export function WorkLink({ href, label, icon }: WorkLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group pressable btn-bevel relative inline-flex w-full items-center gap-2.5 px-3 py-2 text-sm sm:w-auto"
    >
      <span className="btn-bevel-frame" aria-hidden="true" />
      <span
        className="btn-bevel-corner btn-bevel-corner-tl"
        aria-hidden="true"
      />
      <span
        className="btn-bevel-corner btn-bevel-corner-tr"
        aria-hidden="true"
      />
      <span
        className="btn-bevel-corner btn-bevel-corner-bl"
        aria-hidden="true"
      />
      <span
        className="btn-bevel-corner btn-bevel-corner-br"
        aria-hidden="true"
      />
      {icon ? (
        <span className="flex size-7 shrink-0 items-center justify-center bg-foreground/10">
          {icon}
        </span>
      ) : null}
      {label}
      <span aria-hidden="true" className="arrow-nudge text-foreground/50">
        ↗
      </span>
    </a>
  );
}
