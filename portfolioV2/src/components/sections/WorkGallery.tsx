import { Link } from "react-router-dom";
import { getFeaturedProjects } from "../../data/projects";
import { WorkProjectGrid } from "../work/WorkProjectCard";

export function WorkGallery() {
  const featured = getFeaturedProjects();

  return (
    <section id="work" className="scroll-mt-20 px-6 py-8">
      <h2 className="mb-6 text-lg font-medium">Work</h2>
      <WorkProjectGrid projects={featured} />
      <div className="mt-8">
        <Link
          to="/work"
          className="pressable btn-bevel relative inline-flex min-h-11 items-center gap-2 px-3 py-2 text-sm sm:w-auto"
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
          <span aria-hidden="true" className="text-foreground/50">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
