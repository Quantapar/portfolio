import { projects } from "../../data/projects";
import { Project } from "../work/Project";

export function WorkGallery() {
  return (
    <section className="px-6 py-8">
      <h2 className="mb-6 text-lg font-medium">Work</h2>
      <div className="border border-dotted border-border">
        {projects.map((project) => (
          <Project
            key={`${project.title1}-${project.title2}`}
            project={project}
          />
        ))}
      </div>
    </section>
  );
}
