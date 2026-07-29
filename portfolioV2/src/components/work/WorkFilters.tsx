import type { ProjectType } from "../../data/projects";

export type WorkFilter = "all" | ProjectType;

type WorkFiltersProps = {
  value: WorkFilter;
  onChange: (value: WorkFilter) => void;
};

const FILTER_OPTIONS: { value: WorkFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "product", label: "Product" },
  { value: "component", label: "Components" },
  { value: "mobile", label: "Mobile" },
];

export function WorkFilters({ value, onChange }: WorkFiltersProps) {
  return (
    <div className="-mx-6 mb-6 overflow-x-auto px-6 pb-1">
      <div className="flex min-w-max gap-2 sm:min-w-0 sm:flex-wrap">
        {FILTER_OPTIONS.map((option) => {
          const isActive = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`pressable shrink-0 border border-dotted px-3 py-2 text-xs transition-colors ${
                isActive
                  ? "border-foreground/35 text-foreground"
                  : "border-border text-foreground/50"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
