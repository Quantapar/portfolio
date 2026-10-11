import type { ReactNode } from "react";
import { FightClubAvatar } from "../ui/FightClubAvatar";
import { CopyEmailButton } from "../ui/CopyEmailButton";
import { GitHubContributionsCard } from "../ui/GitHubContributionsCard";
import {
  CalendarOutlineIcon,
  GitHubOutlineIcon,
  LinkedInLettersIcon,
  LinkedInOutlineIcon,
  XOutlineIcon,
} from "../ui/OutlineIcons";
import { LinkPreview } from "../ui/LinkPreview";
import {
  CalCard,
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

/**
 * How the four link icons beside the email are drawn. "outline" is a line icon in a dotted chip;
 * "tile" is the raised colour tile used for the company logos under Experience.
 * Change this one word to switch.
 */
const CONTACT_ICONS = "tile" as "outline" | "tile";
const tiles = CONTACT_ICONS === "tile";

// The tile recipe from the company logos: a gradient face, a darker rim and a faint highlight line inside it.
const tileTones = {
  blue: "from-blue-400 to-blue-600 ring-offset-blue-500",
  neutral: "from-neutral-600 to-neutral-800 ring-offset-neutral-700",
  black: "from-neutral-800 to-neutral-950 ring-offset-neutral-900",
  green: "from-emerald-400 to-emerald-600 ring-offset-emerald-500",
} as const;

type TileTone = keyof typeof tileTones;

// The tile is the link itself: the same height as the email chip, it brightens under the cursor
// and gives a little when pressed.
const tileClassName =
  "relative inline-flex size-[30px] shrink-0 items-center justify-center rounded-sm bg-linear-to-b text-white shadow-md transition-[scale,filter] duration-150 ease-[var(--ease-out)] active:scale-[0.96] [@media(hover:hover)_and_(pointer:fine)]:hover:brightness-110";

// White line icons, a little heavier than on the page so they hold up against colour.
const tileGlyphClassName = "stroke-[2.3] drop-shadow-md drop-shadow-black/40";

/** Drawn above the icon, so the rim and its highlight sit on top of everything in the tile. */
function TileRim({ tone }: { tone: TileTone }) {
  return (
    <span
      className={`pointer-events-none absolute inset-0 rounded-sm ring-1 ring-white/20 ring-offset-2 ring-inset ${tileTones[tone]}`}
    />
  );
}

type IconLinkProps = {
  href: string;
  label: string;
  card?: ReactNode;
  tone: TileTone;
  /** The line icon, and the one to draw on a tile when it needs a different drawing there. */
  icon: (props: { className?: string }) => ReactNode;
  tileIcon?: (props: { className?: string }) => ReactNode;
  /** Extra classes for the icon on its tile. */
  tileIconClassName?: string;
};

function IconLink({
  href,
  label,
  card,
  tone,
  icon: Icon,
  tileIcon: TileIcon = Icon,
  tileIconClassName = "",
}: IconLinkProps) {
  if (!tiles) {
    return (
      <LinkPreview
        href={href}
        card={card}
        label={label}
        className={iconChipClassName}
      >
        <Icon className="text-foreground/50" />
      </LinkPreview>
    );
  }

  return (
    <LinkPreview
      href={href}
      card={card}
      label={label}
      className={`${tileClassName} ${tileTones[tone]}`}
    >
      <TileIcon className={`${tileGlyphClassName} ${tileIconClassName}`} />
      <TileRim tone={tone} />
    </LinkPreview>
  );
}

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
          <LinkPreview href={designEngineeringPost.url}>
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

      {/* The column is 85% of the screen, so below 404px the email and the four icons no longer fit
          on one line. From there down they stack as two rows of the same width. */}
      <div
        className="mt-5 flex flex-wrap items-center gap-2 max-[404px]:inline-grid max-[404px]:grid-cols-[max-content] max-[404px]:gap-y-3"
        data-enter="1"
      >
        <CopyEmailButton email={EMAIL} className={textChipClassName} />
        {/* The four icons stay together. Stacked under the email they spread out to its width,
            so the two rows line up at both ends. */}
        <div className="flex items-center gap-2 max-[404px]:justify-between">
          <IconLink
            href={links.linkedin}
            label="LinkedIn"
            card={<LinkedInProfileCard />}
            tone="blue"
            icon={LinkedInOutlineIcon}
            tileIcon={LinkedInLettersIcon}
          />
          <IconLink
            href={links.github}
            label="GitHub"
            card={
              contributions ? (
                <GitHubContributionsCard contributions={contributions} />
              ) : undefined
            }
            tone="neutral"
            icon={GitHubOutlineIcon}
          />
          <IconLink
            href={links.x}
            label="X"
            card={<XProfileCard />}
            tone="black"
            icon={XOutlineIcon}
            // Filled, the wide stroke of the X reads as one bar instead of two thin lines.
            tileIconClassName="fill-current"
          />
          <IconLink
            href={links.cal}
            label="Book a call"
            card={<CalCard />}
            tone="green"
            icon={CalendarOutlineIcon}
          />
        </div>
      </div>
    </section>
  );
}
