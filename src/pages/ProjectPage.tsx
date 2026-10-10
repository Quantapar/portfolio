import { useParams } from "react-router-dom";
import { getProjectBySlug } from "../data/projects";
import { LiveWork } from "../components/work/LiveWork";
import { ProjectShowcase } from "../components/work/ProjectShowcase";
import { getProjectPreview } from "../components/work/previews";
import { NotFoundPage } from "./NotFoundPage";

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;

  if (!project) {
    return <NotFoundPage />;
  }

  // Work that is rebuilt here is shown as itself; everything else gets a short write-up.
  if (getProjectPreview(project.slug)) {
    return <LiveWork project={project} />;
  }

  return (
    <main>
      <ProjectShowcase project={project} />
    </main>
  );
}
