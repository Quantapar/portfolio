import React from "react";

interface ComponentPreviewCardProps {
  id: string;
  name: string;
  description: string;
  preview: React.ReactNode;
  onClick: (id: string, e: React.MouseEvent) => void;
}

export const ComponentPreviewCard = ({
  id,
  name,
  description,
  preview,
  onClick,
}: ComponentPreviewCardProps) => (
  <a
    href={`/components/${id}`}
    onClick={(e) => onClick(id, e)}
    className="group block rounded-2xl border border-(--border-color) bg-(--bg-secondary) hover:border-(--text-muted) transition-all duration-300 ease-out overflow-hidden hover:shadow-lg hover:-translate-y-0.5"
  >
    <div className="h-48 flex items-center justify-center bg-(--bg-tertiary)/30 border-b border-(--border-color) overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-(--bg-secondary)/20 pointer-events-none" />
      <div className="relative z-10 scale-50 origin-center pointer-events-none">
        {preview}
      </div>
    </div>
    <div className="p-5">
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="text-[15px] font-semibold text-(--text-primary) group-hover:text-(--text-highlight) transition-colors duration-200">
          {name}
        </h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-(--text-muted) opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>
      <p className="text-[13px] text-(--text-muted) leading-relaxed line-clamp-2">
        {description}
      </p>
    </div>
  </a>
);
