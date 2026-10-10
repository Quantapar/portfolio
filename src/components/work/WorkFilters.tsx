import type { ProjectType } from "../../data/projects";

export type WorkFilter = "all" | ProjectType;

type WorkFiltersProps = {
  value: WorkFilter;
  onChange: (value: WorkFilter) => void;
};

const FILTER_OPTIONS: { value: WorkFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "product", label: "Projects" },
  { value: "component", label: "Components" },
  { value: "mobile", label: "Mobile" },
];

export function WorkFilters({ value, onChange }: WorkFiltersProps) {
  return (
    <div className="mb-6">
      <div
        role="tablist"
        aria-label="Filter work"
        className="grid grid-cols-2 gap-2 min-[400px]:grid-cols-4"
      >
        {FILTER_OPTIONS.map((option) => {
          const isActive = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(option.value)}
              className={`pressable min-w-0 border border-dotted px-2 py-2 text-center text-xs transition-[color,border-color,background-color] duration-[160ms] ease-[var(--ease-out)] sm:px-3 ${
                isActive
                  ? "border-foreground/35 text-foreground"
                  : "border-border text-foreground/50"
              }`}
            >
              <span className="block truncate">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
