import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="flex min-h-dvh w-full justify-center px-4 sm:px-6">
      <div className="flex min-h-dvh w-full max-w-3xl">
        <div
          className="grid-frame-gutter-left w-[5px] shrink-0 self-stretch"
          aria-hidden="true"
        />
        <div className="relative min-w-0 flex-1">{children}</div>
        <div
          className="grid-frame-gutter-right w-[5px] shrink-0 self-stretch"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
