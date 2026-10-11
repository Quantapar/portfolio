import { FightClubAvatar } from "../ui/FightClubAvatar";
import { CopyEmailButton } from "../ui/CopyEmailButton";
import { GitHubContributionsCard } from "../ui/GitHubContributionsCard";
import {
  CalendarOutlineIcon,
  GitHubOutlineIcon,
  LinkedInOutlineIcon,
  XOutlineIcon,
} from "../ui/OutlineIcons";
import { LinkPreview } from "../ui/LinkPreview";
import {
  CalCard,
  DesignEngineeringCard,
  LinkedInProfileCard,
  XProfileCard,
} from "../ui/ProfileCards";

import { designEngineeringPost, EMAIL, links, USERNAME } from "../../data/site";
import { useGitHubContributions } from "../../hooks/useGitHubContributions";

// The dotted border and fill live on a layer behind the content, so a press can shrink
// the surface while the text and icon stay put.
const chipClassName =
  "group relative isolate inline-flex items-center border border-transparent py-1 text-sm whitespace-nowrap text-foreground before:absolute before:-inset-px before:-z-10 before:border before:border-dotted before:border-border before:transition-[background-color,border-color,scale] before:duration-150 before:ease-[var(--ease-out)] active:before:bg-foreground/10 [@media(hover:hover)_and_(pointer:fine)]:hover:before:border-foreground/35 [@media(hover:hover)_and_(pointer:fine)]:hover:before:bg-foreground/5";

// A wide chip needs only a slight squeeze to read as pressed.
const textChipClassName = `${chipClassName} pr-3 pl-2.5 active:before:scale-[0.985]`;

// Square chips that hold only a logo, sized to the height of the text chips.
const iconChipClassName = `${chipClassName} size-[30px] justify-center active:before:scale-[0.96]`;

export function AboutContact() {
  const contributions = useGitHubContributions(USERNAME);

  return (
    <section id="about" className="scroll-mt-20">
      <div className="mb-5" data-enter="0">
        <div className="flex items-center gap-3">
          <FightClubAvatar />
          <div className="min-w-0">
            <h1 className="font-heading font-medium tracking-tight text-foreground">
              Manu Sharma
            </h1>
            <p className="-mt-1 text-foreground/60">
              aka <span className="italic">quantapar</span>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-pretty text-foreground/65" data-enter="0">
        <p>
          I&apos;m a{" "}
          <LinkPreview
            href={designEngineeringPost.url}
            card={<DesignEngineeringCard />}
          >
            Design Engineer
          </LinkPreview>{" "}
          based in India, building clean, interactive interfaces and UI
          components for web and mobile
        </p>
        <p>
          I work with React, Tailwind, and Motion, and I&apos;m usually on{" "}
          <LinkPreview href={links.x} card={<XProfileCard />}>
            X / Twitter
          </LinkPreview>{" "}
          sharing what I&apos;m building and experimenting with. If you&apos;re
          building something cool, say hi
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2" data-enter="1">
        <CopyEmailButton email={EMAIL} className={textChipClassName} />
        <LinkPreview
          href={links.linkedin}
          card={<LinkedInProfileCard />}
          label="LinkedIn"
          className={iconChipClassName}
        >
          <LinkedInOutlineIcon className="text-foreground/50" />
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
          <GitHubOutlineIcon className="text-foreground/50" />
        </LinkPreview>
        <LinkPreview
          href={links.x}
          card={<XProfileCard />}
          label="X"
          className={iconChipClassName}
        >
          <XOutlineIcon className="text-foreground/50" />
        </LinkPreview>
        <LinkPreview
          href={links.cal}
          card={<CalCard />}
          label="Book a call"
          className={iconChipClassName}
        >
          <CalendarOutlineIcon className="text-foreground/50" />
        </LinkPreview>
      </div>
    </section>
  );
}
