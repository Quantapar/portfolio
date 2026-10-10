import { Laptop } from "lucide-react";
import type { PointerEvent, ReactNode } from "react";
import type {
  Experience,
  ExperienceLogo,
  LogoTone,
} from "../../data/experience";
import { TransitionLink } from "../ui/TransitionLink";
import type { ExperienceHover } from "./ExperiencePreview";

const rowClassName =
  "group flex items-center gap-3 px-2 py-2 transition-[background-color] duration-[160ms] ease-[var(--ease-out)] active:bg-foreground/10 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/5";

type RowHandlers = {
  onPointerEnter: (event: PointerEvent<HTMLAnchorElement>) => void;
  onPointerLeave: () => void;
};

function ExperienceLink({
  href,
  handlers,
  children,
}: {
  href: string;
  handlers: RowHandlers;
  children: ReactNode;
}) {
  // Case studies live on this site; everything else opens the shipped work.
  if (href.startsWith("/")) {
    return (
      <TransitionLink to={href} className={rowClassName} {...handlers}>
        {children}
      </TransitionLink>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={rowClassName}
      {...handlers}
    >
      {children}
    </a>
  );
}

// A raised colour tile: gradient face, a darker 2px rim and a faint inner highlight line.
const toneClassNames: Record<LogoTone, string> = {
  blue: "from-blue-400 to-blue-600 ring-offset-blue-500",
  orange: "from-orange-400 to-orange-600 ring-offset-orange-500",
  neutral: "from-neutral-600 to-neutral-800 ring-offset-neutral-700",
};

const glyphShadow = "drop-shadow-xl drop-shadow-black/40";

function LogoTile({ logo }: { logo: ExperienceLogo }) {
  return (
    <span
      className={`relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-linear-to-b shadow-lg ${toneClassNames[logo.tone]}`}
    >
      {logo.kind === "icon" ? (
        <Laptop
          aria-hidden="true"
          className={`size-5 text-white ${glyphShadow}`}
        />
      ) : null}
      {logo.kind === "mark" ? (
        <img
          src={logo.src}
          alt=""
          className={`size-9 max-w-none brightness-0 invert ${glyphShadow}`}
        />
      ) : null}
      {logo.kind === "image" ? (
        <img src={logo.src} alt="" className="size-full object-cover" />
      ) : null}
      {/* Drawn above the artwork so the rim shows on full-tile images too. */}
      <span
        className={`absolute inset-0 rounded-sm ring-1 ring-white/20 ring-offset-2 ring-inset ${toneClassNames[logo.tone]}`}
      />
    </span>
  );
}

/** Underlines the highlighted phrase like a link; the row around it is the real link. */
function Summary({ text, highlight }: { text: string; highlight?: string }) {
  const start = highlight ? text.indexOf(highlight) : -1;

  if (!highlight || start === -1) return text;

  return (
    <>
      {text.slice(0, start)}
      <span className="link-inline [@media(hover:hover)_and_(pointer:fine)]:group-hover:decoration-foreground">
        {highlight}
      </span>
      {text.slice(start + highlight.length)}
    </>
  );
}

type ExperienceItemProps = {
  item: Experience;
  onHover: (hover: ExperienceHover | null) => void;
};

export function ExperienceItem({ item, onHover }: ExperienceItemProps) {
  const handlers: RowHandlers = {
    onPointerEnter: (event) => {
      // Touch has no hover: a tap should go straight to the link.
      if (event.pointerType !== "mouse") return;
      onHover({
        image: item.preview,
        rect: event.currentTarget.getBoundingClientRect(),
      });
    },
    onPointerLeave: () => onHover(null),
  };

  return (
    <ExperienceLink href={item.href} handlers={handlers}>
      <LogoTile logo={item.logo} />

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-medium text-foreground">{item.company}</span>
          <span className="text-[13px] text-foreground/50">{item.role}</span>
        </span>
        <span className="block text-pretty text-foreground/65">
          <Summary text={item.summary} highlight={item.highlight} />
        </span>
      </span>
    </ExperienceLink>
  );
}
