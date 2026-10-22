"use client";

import { experimentItems, projectItems, type WorkItem } from "../data/work";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { WorkGrid } from "../components/work/WorkGrid";

const categories = [
  { title: "Experiments", items: experimentItems },
  { title: "Projects", items: projectItems },
];

function WorkCategory({ title, items }: { title: string; items: WorkItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-medium text-foreground/60">{title}</h2>
      <WorkGrid items={items} />
    </section>
  );
}

export function WorkIndexPage() {
  return (
    <main>
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Work", transitionName: "work-heading" },
        ]}
      />
      <h1 className="sr-only">Work</h1>

      <div className="mt-8 flex flex-col gap-12">
        {categories.map((category) => (
          <WorkCategory key={category.title} {...category} />
        ))}
      </div>
    </main>
  );
}
