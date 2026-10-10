import type { ReactNode } from "react";

type ContactLinkProps = {
  href: string;
  label: string;
  icon: ReactNode;
};

export function ContactLink({ href, label, icon }: ContactLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="pressable btn-bevel relative inline-flex w-full items-center gap-2.5 px-3 py-2 text-sm sm:w-auto"
    >
      <span className="btn-bevel-frame" aria-hidden="true" />
      <span className="btn-bevel-corner btn-bevel-corner-tl" aria-hidden="true" />
      <span className="btn-bevel-corner btn-bevel-corner-tr" aria-hidden="true" />
      <span className="btn-bevel-corner btn-bevel-corner-bl" aria-hidden="true" />
      <span className="btn-bevel-corner btn-bevel-corner-br" aria-hidden="true" />
      <span className="flex size-7 shrink-0 items-center justify-center bg-foreground/10">
        {icon}
      </span>
      {label}
      <span aria-hidden="true" className="text-foreground/50">
        ↗
      </span>
    </a>
  );
}

function BrandIcon({
  viewBox = "0 0 24 24",
  children,
}: {
  viewBox?: string;
  children: ReactNode;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox={viewBox}
      className="size-3.5 fill-current"
    >
      {children}
    </svg>
  );
}

export function GitHubIcon() {
  return (
    <BrandIcon>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.82-.261.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.404 1.02.005 2.04.137 3 .404 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.576C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12" />
    </BrandIcon>
  );
}

export function LinkedInIcon() {
  return (
    <BrandIcon>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 4.126 0 2.062 2.062 0 0 1-2.063 2.065m1.782 13.019H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
    </BrandIcon>
  );
}

export function XIcon() {
  return (
    <BrandIcon>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </BrandIcon>
  );
}

export function MailIcon() {
  return (
    <BrandIcon>
      <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
      <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
    </BrandIcon>
  );
}

export function ResumeIcon() {
  return (
    <BrandIcon>
      <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.414a2 2 0 0 0-.586-1.414l-4.414-4.414A2 2 0 0 0 13.586 2H6Zm7 1.414L18.586 9H15a1 1 0 0 1-1-1V3.414ZM8 13.25a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75Zm0 3a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75Z" />
    </BrandIcon>
  );
}
