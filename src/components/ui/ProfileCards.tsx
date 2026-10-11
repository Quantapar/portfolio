import {
  designEngineeringPost,
  links,
  profiles,
  SITE_NAME,
} from "../../data/site";

// Spans throughout: these render inside a link preview, which may sit in running text.

/** Google Calendar's mark, in its own colours. */
function GoogleCalendarIcon() {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className="size-[15px] shrink-0"
    >
      <g transform="translate(3.75 3.75)">
        <path
          fill="#FFFFFF"
          d="M148.882,43.618l-47.368-5.263l-57.895,5.263L38.355,96.25l5.263,52.632l52.632,6.579l52.632-6.579l5.263-53.947L148.882,43.618z"
        />
        <path
          fill="#1A73E8"
          d="M65.211,125.276c-3.934-2.658-6.658-6.539-8.145-11.671l9.132-3.763c0.829,3.158,2.276,5.605,4.342,7.342c2.053,1.737,4.553,2.592,7.474,2.592c2.987,0,5.553-0.908,7.697-2.724s3.224-4.132,3.224-6.934c0-2.868-1.132-5.211-3.395-7.026s-5.105-2.724-8.5-2.724h-5.276v-9.039H76.5c2.921,0,5.382-0.789,7.382-2.368c2-1.579,3-3.737,3-6.487c0-2.447-0.895-4.395-2.684-5.855s-4.053-2.197-6.803-2.197c-2.684,0-4.816,0.711-6.395,2.145s-2.724,3.197-3.447,5.276l-9.039-3.763c1.197-3.395,3.395-6.395,6.618-8.987c3.224-2.592,7.342-3.895,12.342-3.895c3.697,0,7.026,0.711,9.974,2.145c2.947,1.434,5.263,3.421,6.934,5.947c1.671,2.539,2.5,5.382,2.5,8.539c0,3.224-0.776,5.947-2.329,8.184c-1.553,2.237-3.461,3.947-5.724,5.145v0.539c2.987,1.25,5.421,3.158,7.342,5.724c1.908,2.566,2.868,5.632,2.868,9.211s-0.908,6.776-2.724,9.579c-1.816,2.803-4.329,5.013-7.513,6.618c-3.197,1.605-6.789,2.421-10.776,2.421C73.408,129.263,69.145,127.934,65.211,125.276z"
        />
        <path
          fill="#1A73E8"
          d="M121.25,79.961l-9.974,7.25l-5.013-7.605l17.987-12.974h6.895v61.197h-9.895L121.25,79.961z"
        />
        <path
          fill="#EA4335"
          d="M148.882,196.25l47.368-47.368l-23.684-10.526l-23.684,10.526l-10.526,23.684L148.882,196.25z"
        />
        <path
          fill="#34A853"
          d="M33.092,172.566l10.526,23.684h105.263v-47.368H43.618L33.092,172.566z"
        />
        <path
          fill="#4285F4"
          d="M12.039-3.75C3.316-3.75-3.75,3.316-3.75,12.039v136.842l23.684,10.526l23.684-10.526V43.618h105.263l10.526-23.684L148.882-3.75H12.039z"
        />
        <path
          fill="#188038"
          d="M-3.75,148.882v31.579c0,8.724,7.066,15.789,15.789,15.789h31.579v-47.368H-3.75z"
        />
        <path
          fill="#FBBC04"
          d="M148.882,43.618v105.263h47.368V43.618l-23.684-10.526L148.882,43.618z"
        />
        <path
          fill="#1967D2"
          d="M196.25,43.618V12.039c0-8.724-7.066-15.789-15.789-15.789h-31.579v47.368H196.25z"
        />
      </g>
    </svg>
  );
}

/** Google Meet's mark, in its own colours. */
function GoogleMeetIcon() {
  return (
    <svg
      viewBox="0 0 87.5 72"
      aria-hidden="true"
      className="h-[15px] w-auto shrink-0"
    >
      <path
        fill="#00832d"
        d="M49.5 36l8.53 9.75 11.47 7.33 2-17.02-2-16.64-11.69 6.44z"
      />
      <path
        fill="#0066da"
        d="M0 51.5V66c0 3.315 2.685 6 6 6h14.5l3-10.96-3-9.54-9.95-3z"
      />
      <path fill="#e94235" d="M20.5 0L0 20.5l10.55 3 9.95-3 2.95-9.41z" />
      <path fill="#2684fc" d="M20.5 20.5H0v31h20.5z" />
      <path
        fill="#00ac47"
        d="M82.6 8.68L69.5 19.42v33.66l13.16 10.79c1.97 1.54 4.85.135 4.85-2.37V11c0-2.535-2.945-3.925-4.91-2.32z"
      />
      <path
        fill="#00ac47"
        d="M49.5 36v15.5h-29V72h43c3.315 0 6-2.685 6-6V53.08z"
      />
      <path
        fill="#ffba00"
        d="M63.5 0h-43v20.5h29V36l20-16.57V6c0-3.315-2.685-6-6-6z"
      />
    </svg>
  );
}

/** Vercel's mark, in the colour of the text around it. */
function VercelIcon() {
  return (
    <svg
      viewBox="0 0 76 65"
      aria-hidden="true"
      // A triangle's weight sits low, so it is raised 1px to look centred in its tile.
      className="-mt-px h-3 w-auto shrink-0 text-foreground"
    >
      <path fill="currentColor" d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}

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
        <GoogleCalendarIcon />
        <span className="font-medium text-foreground">{event}</span>
      </span>
      <span className="mt-1.5 flex items-center gap-2 text-[13px]">
        <GoogleMeetIcon />
        <span className="text-foreground/60">{location}</span>
      </span>
    </span>
  );
}

/** Says where the "Design Engineer" link leads before it is clicked. */
export function DesignEngineeringCard() {
  const { source, title } = designEngineeringPost;

  return (
    // Kept small: one row, as wide as its title, with the site's mark where a favicon would be.
    <span className="flex items-center gap-2.5 whitespace-nowrap">
      <span className="flex size-8 shrink-0 items-center justify-center border border-dotted border-border">
        <VercelIcon />
      </span>
      <span className="block">
        <span className="block text-[13px] leading-tight font-medium text-foreground">
          {title}
        </span>
        <span className="mt-0.5 block text-[13px] leading-tight text-foreground/60">
          {source}
        </span>
      </span>
    </span>
  );
}
