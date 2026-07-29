import { useState } from "react";
import { GitHubCalendar, type Activity } from "react-github-calendar";
import { BevelBox } from "../ui/BevelBox";
import { GitHubIcon } from "../ui/ContactLink";
import { useTheme } from "../../hooks/useTheme";
import { useMediaQuery } from "../../hooks/useMediaQuery";

import { links, USERNAME } from "../../data/site";

const neutralTheme = {
  light: ["#ebe9e9", "#cfcfcf", "#a8a8a8", "#707070", "#000000"],
  dark: ["#141414", "#333333", "#555555", "#888888", "#f9f8f8"],
};

const githubTheme = {
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
};

function formatActivityDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-");
  return `${day}.${month}.${year}`;
}

function activityTooltipText(activity: Activity) {
  const noun = activity.count === 1 ? "contribution" : "contributions";
  return `${activity.count} ${noun} on ${formatActivityDate(activity.date)}`;
}

export function GitHubActivitySection() {
  const { theme } = useTheme();
  const [hovered, setHovered] = useState(false);
  const isCompact = useMediaQuery("(max-width: 639px)");

  return (
    <section id="github" className="scroll-mt-20 px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 className="text-lg font-medium">GitHub Activity</h2>
        <a
          href={links.github}
          target="_blank"
          rel="noreferrer"
          className="pressable inline-flex items-center gap-2 text-sm text-foreground/60"
        >
          <GitHubIcon />
          Profile
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <BevelBox className="github-activity">
        <div
          className="px-3 py-4 sm:px-4 sm:py-5"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <GitHubCalendar
            username={USERNAME}
            className="w-full"
            colorScheme={theme}
            theme={hovered ? githubTheme : neutralTheme}
            blockSize={isCompact ? 8 : 11}
            blockMargin={isCompact ? 2 : 3}
            blockRadius={2}
            fontSize={isCompact ? 10 : 12}
            labels={{
              totalCount: "{{count}} contributions in the last year",
              legend: {
                less: "Less",
                more: "More",
              },
            }}
            tooltips={{
              activity: {
                text: activityTooltipText,
                withArrow: true,
                placement: "top",
                offset: 8,
              },
            }}
            errorMessage="Could not load GitHub activity."
          />
        </div>
      </BevelBox>
    </section>
  );
}
