import { GitHubCalendar } from "react-github-calendar";
import { BevelBox } from "../ui/BevelBox";
import { GitHubIcon } from "../ui/ContactLink";
import { useTheme } from "../../hooks/useTheme";

const GITHUB_USERNAME = "quantapar";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

const calendarTheme = {
  light: ["#ebe9e9", "#cfcfcf", "#a8a8a8", "#707070", "#000000"],
  dark: ["#141414", "#333333", "#555555", "#888888", "#f9f8f8"],
};

export function GitHubActivitySection() {
  const { theme } = useTheme();

  return (
    <section className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-lg font-medium">GitHub Activity</h2>
        <a
          href={GITHUB_PROFILE_URL}
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
        <div className="px-4 py-5">
          <GitHubCalendar
            username={GITHUB_USERNAME}
            className="w-full"
            colorScheme={theme}
            theme={calendarTheme}
            blockSize={11}
            blockMargin={3}
            blockRadius={2}
            fontSize={12}
            labels={{
              totalCount: "{{count}} contributions in the last year",
              legend: {
                less: "Less",
                more: "More",
              },
            }}
            errorMessage="Could not load GitHub activity."
          />
        </div>
      </BevelBox>
    </section>
  );
}
