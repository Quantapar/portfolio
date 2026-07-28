import { ExperienceItem } from "../experience/ExperienceItem";
import { experience } from "../../data/experience";

export function ExperienceSection() {
  return (
    <section className="px-6 py-8">
      <h2 className="mb-6 text-lg font-medium">Experience</h2>
      <div className="space-y-4">
        {experience.map((item, index) => (
          <ExperienceItem
            key={item.company}
            item={item}
            defaultOpen={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
