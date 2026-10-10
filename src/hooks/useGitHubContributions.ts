import { useEffect, useState } from "react";

export type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

export type GitHubContributions = {
  /** Contributions over the last year. */
  total: number;
  /** One entry per day, oldest first. */
  days: ContributionDay[];
};

type ApiResponse = {
  total: { lastYear: number };
  contributions: ContributionDay[];
};

// Same public API the activity calendar reads, so the browser can share the response.
const API = "https://github-contributions-api.jogruber.de/v4";

export function useGitHubContributions(username: string) {
  const [data, setData] = useState<GitHubContributions | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API}/${username}?y=last`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`GitHub API ${response.status}`);
        return response.json() as Promise<ApiResponse>;
      })
      .then((json) =>
        setData({ total: json.total.lastYear, days: json.contributions }),
      )
      // The card is a nice-to-have: without data the chip is just a link.
      .catch(() => {});

    return () => controller.abort();
  }, [username]);

  return data;
}
