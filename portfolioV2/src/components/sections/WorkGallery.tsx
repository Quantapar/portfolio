import { Link } from "react-router-dom";
import { getFeaturedProjects } from "../../data/projects";
import { BevelBox } from "../ui/BevelBox";
import { Project } from "../work/Project";

export function WorkGallery() {
  const featured = getFeaturedProjects();

  return (
    <section id="work" className="scroll-mt-20 px-6 py-8">
      <h2 className="mb-6 text-lg font-medium">Work</h2>
      <BevelBox>
        {featured.map((project) => (
          <Project key={project.slug} project={project} showMeta />
        ))}
      </BevelBox>
      <div className="mt-4">
        <Link
          to="/work"
          className="pressable inline-flex min-h-11 items-center text-sm text-foreground/50"
        >
          View all work →
        </Link>
      </div>
    </section>
  );
}
