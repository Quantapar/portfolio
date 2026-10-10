import { Calendar, Video } from "lucide-react";
import { links, profiles, SITE_NAME } from "../../data/site";

// Spans throughout: these render inside a link preview, which may sit in running text.

const buttonClassName =
  "bg-foreground px-3 py-1.5 text-[13px] leading-none font-semibold text-background transition-opacity duration-150 ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-80";

const avatarClassName = "border border-dotted border-border object-cover";

export function XProfileCard() {
  const { name, handle, following, followers } = profiles.x;

  return (
    <span className="block w-[240px]">
      <span className="flex items-start justify-between">
        <img
          src="/avatar.jpg"
          alt=""
          width={44}
          height={44}
          className={`size-11 ${avatarClassName}`}
        />
        {/* The card is hidden from assistive tech; the chip itself is the accessible link. */}
        <a
          href={links.x}
          target="_blank"
          rel="noreferrer"
          tabIndex={-1}
          className={buttonClassName}
        >
          Follow
        </a>
      </span>
      <span className="mt-3 flex items-baseline gap-1.5">
        <span className="text-[15px] leading-none font-semibold text-foreground">
          {name}
        </span>
        <span className="text-[13px] leading-none text-foreground/60">
          @{handle}
        </span>
      </span>
      <span className="mt-3 flex items-center gap-4 text-[13px] tabular-nums">
        <span>
          <span className="font-semibold text-foreground">{following}</span>{" "}
          <span className="text-foreground/60">Following</span>
        </span>
        <span>
          <span className="font-semibold text-foreground">{followers}</span>{" "}
          <span className="text-foreground/60">Followers</span>
        </span>
      </span>
    </span>
  );
}

export function LinkedInProfileCard() {
  const { headline, connections } = profiles.linkedin;

  return (
    <span className="block w-[260px]">
      <img
        src="/previews/profile-banner.jpg"
        alt=""
        width={800}
        height={267}
        className="block aspect-[4/1] w-full object-cover"
      />
      <span className="relative block">
        <img
          src="/previews/linkedin-avatar.jpg"
          alt=""
          width={56}
          height={56}
          className="absolute -top-7 left-2 size-14 border-2 border-background object-cover"
        />
        <a
          href={links.linkedin}
          target="_blank"
          rel="noreferrer"
          tabIndex={-1}
          className={`absolute top-2.5 right-0 ${buttonClassName}`}
        >
          Connect
        </a>
        <span className="block pt-10">
          <span className="block text-base leading-tight font-semibold text-foreground">
            {SITE_NAME}
          </span>
          <span className="mt-1 block text-[13px] leading-snug text-foreground/60">
            {headline} · {connections} connections
          </span>
        </span>
      </span>
    </span>
  );
}

export function CalCard() {
  const { handle, event, location } = profiles.cal;

  return (
    <span className="block w-[220px]">
      <span className="flex items-center gap-2.5">
        <img
          src="/avatar.jpg"
          alt=""
          width={40}
          height={40}
          className={`size-10 shrink-0 ${avatarClassName}`}
        />
        <span className="min-w-0">
          <span className="block truncate text-[15px] leading-tight font-semibold text-foreground">
            {SITE_NAME}
          </span>
          <span className="block truncate text-[13px] leading-tight text-foreground/60">
            @{handle}
          </span>
        </span>
      </span>
      <span className="mt-3 flex items-center gap-2 text-[13px]">
        <Calendar
          aria-hidden="true"
          className="size-[15px] text-foreground/50"
        />
        <span className="font-medium text-foreground">{event}</span>
      </span>
      <span className="mt-1.5 flex items-center gap-2 text-[13px]">
        <Video aria-hidden="true" className="size-[15px] text-foreground/50" />
        <span className="text-foreground/60">{location}</span>
      </span>
    </span>
  );
}
