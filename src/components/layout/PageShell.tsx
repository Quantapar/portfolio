import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

/** One narrow column with open space around it; blocks are separated by space, not lines. */
export function PageShell({ children }: PageShellProps) {
  return (
    <div className="flex min-h-dvh w-full justify-center">
      <div className="flex w-[640px] max-w-[85%] flex-col gap-16 py-16 text-sm leading-6 sm:py-24">
        {children}
      </div>
    </div>
  );
}
