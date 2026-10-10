import { motion, useReducedMotion } from "framer-motion";
import type {
  ContributionDay,
  GitHubContributions,
} from "../../hooks/useGitHubContributions";
import { useTheme } from "../../hooks/useTheme";
import { GitHubIcon } from "./BrandIcons";

const WEEKS = 18;

// GitHub's own greens, indexed by activity level 0 (none) to 4 (most).
const levelColors = {
  light: ["rgba(17,17,17,0.06)", "#9BE9A8", "#40C463", "#30A14E", "#216E39"],
  dark: ["rgba(255,255,255,0.06)", "#0E4429", "#006D32", "#26A641", "#39D353"],
};

const gridMotion = {
  hidden: {},
  show: { transition: { staggerChildren: 0.003, delayChildren: 0.04 } },
};

const cellMotion = {
  hidden: { opacity: 0, scale: 0.55 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.42, ease: [0.32, 0.72, 0, 1] },
  },
} as const;

/** Groups days into Sunday-to-Saturday columns, like GitHub's calendar. */
function toWeeks(days: ContributionDay[]) {
  const lead = days[0] ? new Date(`${days[0].date}T00:00:00Z`).getUTCDay() : 0;
  const weeks: ContributionDay[][] = [];

  for (let start = -lead; start < days.length; start += 7) {
    weeks.push(days.slice(Math.max(start, 0), start + 7));
  }

  return weeks;
}

type GitHubContributionsCardProps = {
  contributions: GitHubContributions;
};

// Spans throughout so the card stays valid inside a link preview in running text.
export function GitHubContributionsCard({
  contributions,
}: GitHubContributionsCardProps) {
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const colors = levelColors[theme];
  const weeks = toWeeks(contributions.days).slice(-WEEKS);

  // The data covers the last 365 days, so it always holds the current year so far.
  const year = String(new Date().getFullYear());
  const yearTotal = contributions.days.reduce(
    (sum, day) => (day.date.startsWith(year) ? sum + day.count : sum),
    0,
  );

  return (
    <span className="block">
      <span className="mb-2.5 flex items-center gap-2 text-[13px] whitespace-nowrap">
        <span className="text-foreground/70">
          <GitHubIcon className="size-4" />
        </span>
        <span className="text-foreground/60">
          <span className="font-semibold text-foreground tabular-nums">
            {yearTotal.toLocaleString("en-US")}
          </span>{" "}
          contributions in {year}
        </span>
      </span>
      <motion.span
        className="flex gap-[3px]"
        variants={gridMotion}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="show"
      >
        {weeks.map((week) => (
          <span key={week[0].date} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <motion.span
                key={day.date}
                variants={cellMotion}
                className="size-[11px] rounded-[3px]"
                style={{ backgroundColor: colors[day.level] }}
              />
            ))}
          </span>
        ))}
      </motion.span>
    </span>
  );
}
