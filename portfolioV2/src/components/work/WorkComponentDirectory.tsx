import { Link } from "react-router-dom";
import type { Project } from "../../data/projects";

type WorkComponentDirectoryProps = {
  projects: Project[];
  limit?: number;
  showHeader?: boolean;
  onShowAll?: () => void;
};

function projectTitle(project: Project) {
  return `${project.title1} ${project.title2}`;
}

function monogram(project: Project) {
  return (project.title1[0] ?? "?").toUpperCase();
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5 text-foreground/50"
      aria-hidden="true"
    >
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
}

export function WorkComponentDirectory({
  projects,
  limit,
  showHeader = true,
  onShowAll,
}: WorkComponentDirectoryProps) {
  const total = projects.length;
  const visible = limit ? projects.slice(0, limit) : projects;
  const hasMore = Boolean(limit && total > limit);

  if (total === 0) {
    return (
      <p className="py-8 text-sm text-foreground/50">No components yet.</p>
    );
  }

  return (
    <section>
      {showHeader ? (
        <div className="mb-4 flex items-baseline gap-2">
          <h2 className="text-lg font-medium">Components</h2>
          <span className="text-sm text-foreground/40">({total})</span>
        </div>
      ) : null}

      <div className="btn-bevel relative">
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
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, index) => (
            <li
              key={project.slug}
              className={[
                index < visible.length - 1
                  ? "border-b border-dotted border-border"
                  : "",
                "sm:border-b sm:border-dotted sm:border-border",
                "sm:odd:border-r sm:odd:border-dotted sm:odd:border-border",
                "lg:border-r lg:border-dotted lg:border-border",
                "lg:nth-[3n]:border-r-0",
                "lg:nth-last-[-n+3]:border-b-0",
                "sm:nth-last-[-n+2]:max-lg:border-b-0",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <Link
                to={`/work/${project.slug}`}
                className="group flex items-center gap-3 px-4 py-3.5 transition-[background-color,transform] duration-[160ms] ease-[var(--ease-out)] active:scale-[0.98] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/5"
              >
                <span className="flex size-9 shrink-0 items-center justify-center border border-dotted border-border bg-foreground/4 text-xs font-medium text-foreground/70 transition-colors duration-[160ms] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:border-foreground/35 [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-foreground">
                  {monogram(project)}
                </span>
                <span className="min-w-0 truncate text-sm text-foreground/80 transition-colors duration-[160ms] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-foreground">
                  {projectTitle(project)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {hasMore && onShowAll ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onShowAll}
            className="pressable btn-bevel relative inline-flex min-h-11 items-center gap-2 px-3 py-2 text-sm"
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
            All components
            <ChevronRightIcon />
          </button>
        </div>
      ) : null}
    </section>
  );
}
