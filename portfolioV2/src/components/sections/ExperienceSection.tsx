import { ExperienceItem } from "../experience/ExperienceItem";
import { experience } from "../../data/experience";

export function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-20 px-4 py-8 sm:px-6">
      <h2 className="mb-6 text-lg font-medium">Experience</h2>
      <div className="space-y-4">
        {experience.map((item) => (
          <ExperienceItem key={item.company} item={item} />
        ))}
      </div>
    </section>
  );
}
