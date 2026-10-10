import { Fragment } from "react";
import { Link } from "react-router-dom";

type Crumb = {
  label: string;
  /** Omit on the last crumb: it names the page you are on. */
  to?: string;
};

type BreadcrumbProps = {
  items: Crumb[];
};

function Separator() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3 shrink-0 text-foreground/40"
      aria-hidden="true"
    >
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-foreground/60">
        {items.map((item, index) => (
          <Fragment key={item.label}>
            {index > 0 ? <Separator /> : null}
            <li className="min-w-0">
              {item.to ? (
                <Link
                  to={item.to}
                  className="py-1 transition-colors duration-[160ms] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-foreground">
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
