import React from "react";

export const SectionMinimal = ({
  children,
  title,
  id,
}: {
  children: React.ReactNode;
  title: string;
  id?: string;
}) => (
  <section id={id} className="py-2">
    <h2 className="text-[10px] font-bold tracking-[0.12em] text-(--text-secondary) uppercase mb-7 pl-1 transition-colors duration-200 ease-out" style={{ fontFamily: "'Press Start 2P', cursive" }}>
      {title}
    </h2>
    {children}
  </section>
);
