import type { GitHubContributions } from "../../hooks/useGitHubContributions";
import { useTheme } from "../../hooks/useTheme";
import { GitHubIcon } from "./BrandIcons";

const RECENT_DAYS = 60;

// Indexed by GitHub's activity level, 0 (none) to 4 (most).
const cellColors = {
  light: [
    "bg-neutral-200",
    "bg-emerald-300",
    "bg-emerald-500",
    "bg-emerald-600",
    "bg-emerald-600",
  ],
  dark: [
    "bg-neutral-800",
    "bg-emerald-700",
    "bg-emerald-500",
    "bg-emerald-400",
    "bg-emerald-400",
  ],
};

type GitHubContributionsCardProps = {
  contributions: GitHubContributions;
};

// Spans throughout so the card stays valid inside a link preview in running text.
export function GitHubContributionsCard({
  contributions,
}: GitHubContributionsCardProps) {
  const { theme } = useTheme();
  const recent = contributions.days.slice(-RECENT_DAYS);

  return (
    <span className="block w-[258px] p-1">
      <span className="mb-3 flex items-center justify-between text-[0.8rem]">
        <span className="text-foreground/70">
          <GitHubIcon className="size-5" />
        </span>
        <span className="text-foreground/60">
          <span className="font-semibold text-foreground tabular-nums">
            {contributions.total.toLocaleString("en-US")}
          </span>{" "}
          contributions in the last year
        </span>
      </span>
      <span className="grid grid-cols-12 gap-[3px]">
        {recent.map((day) => (
          <span
            key={day.date}
            className={`size-[14px] rounded-[3px] ${cellColors[theme][day.level]}`}
          />
        ))}
      </span>
    </span>
  );
}
