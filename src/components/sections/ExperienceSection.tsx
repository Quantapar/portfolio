import { useEffect, useState } from "react";
import { ExperienceItem } from "../experience/ExperienceItem";
import {
  ExperiencePreview,
  type ExperienceHover,
} from "../experience/ExperiencePreview";
import { experience, type Experience } from "../../data/experience";

const current = experience.filter((item) => item.period.end === "Present");
const previous = experience.filter((item) => item.period.end !== "Present");

type ExperienceGroupProps = {
  title: string;
  items: Experience[];
  onHover: (hover: ExperienceHover | null) => void;
  className?: string;
};

function ExperienceGroup({
  title,
  items,
  onHover,
  className = "",
}: ExperienceGroupProps) {
  if (items.length === 0) return null;

  return (
    <div className={className}>
      <h2 className="mb-2 font-medium">{title}</h2>
      {/* Rows bleed 8px past the text edge so their hover fill has room around the content. */}
      <ul className="-mx-2 space-y-1">
        {items.map((item) => (
          <li key={item.company}>
            <ExperienceItem item={item} onHover={onHover} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ExperienceSection() {
  const [hover, setHover] = useState<ExperienceHover | null>(null);

  // Fetch ahead of the first hover so a preview never opens empty.
  useEffect(() => {
    for (const item of experience) {
      const image = new Image();
      image.src = item.preview;
    }
  }, []);

  return (
    <section id="experience" className="scroll-mt-20">
      <ExperienceGroup title="Currently" items={current} onHover={setHover} />
      <ExperienceGroup
        title="Previously"
        items={previous}
        onHover={setHover}
        className={current.length > 0 ? "mt-8" : ""}
      />
      <ExperiencePreview hover={hover} />
    </section>
  );
}
