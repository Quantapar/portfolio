import React from "react";
export const NameFlip = () => (
  <div className="h-14 overflow-hidden inline-flex flex-col">
    <div className="animate-flip text-(--text-primary) font-semibold text-[2.75rem] tracking-[-0.05em] leading-14">
      <span className="block h-14">Manu Sharma</span>
      <span className="block h-14 text-(--text-muted)">Quantapar</span>
      <span className="block h-14">Manu Sharma</span>
    </div>
  </div>
);
