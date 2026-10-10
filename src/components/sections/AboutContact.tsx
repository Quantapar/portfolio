import { FightClubAvatar } from "../ui/FightClubAvatar";
import { Highlight } from "../ui/Highlight";
import { CopyEmailButton } from "../ui/CopyEmailButton";
import { GitHubContributionsCard } from "../ui/GitHubContributionsCard";
import {
  CalendarHoverIcon,
  GitHubHoverIcon,
  LinkedInHoverIcon,
  XHoverIcon,
} from "../ui/HoverIcons";
import { LinkPreview } from "../ui/LinkPreview";
import { CalCard, LinkedInProfileCard, XProfileCard } from "../ui/ProfileCards";

import { EMAIL, links, USERNAME } from "../../data/site";
import { useGitHubContributions } from "../../hooks/useGitHubContributions";

const chipClassName =
  "group inline-flex items-center border border-dotted border-border py-1 text-sm whitespace-nowrap text-foreground transition-[background-color,border-color,scale] duration-150 ease-[var(--ease-out)] active:scale-[0.98] [@media(hover:hover)_and_(pointer:fine)]:hover:border-foreground/35 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/5";

// Square chips that hold only a logo, sized to the height of the text chips.
const iconChipClassName = `${chipClassName} size-[30px] justify-center`;

export function AboutContact() {
  const contributions = useGitHubContributions(USERNAME);

  return (
    <section id="about" className="scroll-mt-20">
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <FightClubAvatar />
          <div className="min-w-0">
            <h1 className="font-heading font-medium tracking-tight text-foreground">
              Manu Sharma
            </h1>
            <p className="text-foreground/50">
              aka <span className="italic">quantapar</span>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-pretty text-foreground/65">
        <p>
          I&apos;m a{" "}
          <Highlight href="https://vercel.com/blog/design-engineering-at-vercel">
            Design Engineer
          </Highlight>{" "}
          based in India, building clean, interactive web and mobile UI
          components that scale across platforms and users
        </p>
        <p>
          I work with <Highlight>React, Tailwind, and Motion</Highlight>, and
          I&apos;m usually on{" "}
          <LinkPreview href={links.x} card={<XProfileCard />}>
            X / Twitter
          </LinkPreview>{" "}
          sharing what I&apos;m making
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <CopyEmailButton
          email={EMAIL}
          className={`${chipClassName} pr-3 pl-2.5`}
        />
        <LinkPreview
          href={links.linkedin}
          card={<LinkedInProfileCard />}
          label="LinkedIn"
          className={iconChipClassName}
        >
          <LinkedInHoverIcon className="text-foreground/50" />
        </LinkPreview>
        <LinkPreview
          href={links.github}
          card={
            contributions ? (
              <GitHubContributionsCard contributions={contributions} />
            ) : undefined
          }
          label="GitHub"
          className={iconChipClassName}
        >
          <GitHubHoverIcon className="text-foreground/50" />
        </LinkPreview>
        <LinkPreview
          href={links.x}
          card={<XProfileCard />}
          label="X"
          className={iconChipClassName}
        >
          <XHoverIcon className="text-foreground/50" />
        </LinkPreview>
        <LinkPreview
          href={links.cal}
          card={<CalCard />}
          label="Book a call"
          className={iconChipClassName}
        >
          <CalendarHoverIcon className="text-foreground/50" />
        </LinkPreview>
      </div>
    </section>
  );
}
