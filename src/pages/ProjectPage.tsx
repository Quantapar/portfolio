import { useParams } from "react-router-dom";
import { getProjectBySlug } from "../data/projects";
import { ProjectShowcase } from "../components/work/ProjectShowcase";
import { NotFoundPage } from "./NotFoundPage";

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;

  if (!project) {
    return <NotFoundPage />;
  }

  return (
    <main>
      <ProjectShowcase project={project} />
    </main>
  );
}
