import { Navigate, useParams } from "react-router-dom";
import { getProjectBySlug } from "../data/projects";
import { ProjectShowcase } from "../components/work/ProjectShowcase";

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;

  if (!project) {
    return <Navigate to="/work" replace />;
  }

  return (
    <main>
      <ProjectShowcase project={project} />
    </main>
  );
}
