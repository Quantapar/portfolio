import { Link } from "react-router-dom";
import { getFeaturedProjects } from "../../data/projects";
import { WorkProjectGrid } from "../work/WorkProjectCard";

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="arrow-nudge-x size-3.5 text-foreground/50"
      aria-hidden="true"
    >
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
}

export function WorkGallery() {
  const featured = getFeaturedProjects();

  return (
    <section id="work" className="scroll-mt-20 px-4 py-10 sm:px-6">
      <h2 className="mb-6 text-lg font-medium">Work</h2>
      <WorkProjectGrid projects={featured} />
      <div className="mt-8">
        <Link
          to="/work"
          className="group pressable btn-bevel relative inline-flex min-h-11 items-center gap-2 px-3 py-2 text-sm sm:w-auto"
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
          View all work
          <ChevronRightIcon />
        </Link>
      </div>
    </section>
  );
}
