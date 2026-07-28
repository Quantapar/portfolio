import { projects } from "../../data/projects";
import { BevelBox } from "../ui/BevelBox";
import { Project } from "../work/Project";

export function WorkGallery() {
  return (
    <section id="work" className="scroll-mt-20 px-6 py-8">
      <h2 className="mb-6 text-lg font-medium">Work</h2>
      <BevelBox>
        {projects.map((project) => (
          <Project
            key={`${project.title1}-${project.title2}`}
            project={project}
          />
        ))}
      </BevelBox>
    </section>
  );
}
