import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, type PointerEvent } from "react";
import type { WorkItem } from "../../data/work";
import { workTransitionName } from "../../lib/routeTransition";
import { TransitionLink } from "../ui/TransitionLink";
import { preloadProjectPreview } from "./previews";

type WorkGridProps = {
  items: WorkItem[];
};

/** How long the cursor must rest on a thumbnail before its page starts loading. */
const PRELOAD_DELAY_MS = 80;

/** The piece a thumbnail opens on this site, if it opens one. */
function liveSlug(item: WorkItem) {
  return item.to.startsWith("/work/") ? item.to.slice("/work/".length) : null;
}

/** A silent clip that plays only while it is on screen. */
function LoopingVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    // With reduced motion the poster frame stands in for the clip.
    if (!video || shouldReduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [shouldReduceMotion]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className="size-full object-cover"
    />
  );
}

function Thumbnail({ item }: { item: WorkItem }) {
  return (
    <span
      // 16:10 is the shape the clips and screenshots were recorded in, so nothing is cut off the sides.
      className="block aspect-[16/10] overflow-hidden bg-background ring-1 ring-foreground/5"
      style={{ viewTransitionName: workTransitionName(item.key) }}
    >
      {item.video ? (
        <LoopingVideo src={item.video} poster={item.image} />
      ) : (
        <img
          src={item.image}
          alt=""
          loading="lazy"
          draggable={false}
          className="size-full object-cover"
        />
      )}
    </span>
  );
}

/** Thumbnails only: the picture is the label, and the page behind it carries the words. */
export function WorkGrid({ items }: WorkGridProps) {
  const preloadTimer = useRef<number | null>(null);

  const cancelPreload = () => {
    if (preloadTimer.current !== null) {
      window.clearTimeout(preloadTimer.current);
      preloadTimer.current = null;
    }
  };

  useEffect(() => cancelPreload, []);

  const entryProps = (item: WorkItem) => {
    const slug = liveSlug(item);

    return {
      "aria-label": item.title,
      title: item.title,
      className: "work-entry block",
      onPointerEnter: (event: PointerEvent<HTMLAnchorElement>) => {
        // Touch has no hover: its press, below, is the first sign there is.
        if (event.pointerType !== "mouse") return;

        cancelPreload();

        // A cursor only crossing the grid leaves before this fires, so nothing is fetched for it.
        if (slug) {
          preloadTimer.current = window.setTimeout(() => {
            preloadTimer.current = null;
            preloadProjectPreview(slug, "hover");
          }, PRELOAD_DELAY_MS);
        }
      },
      onPointerLeave: cancelPreload,
      // A press is no longer a guess.
      onPointerDown: () => {
        if (slug) preloadProjectPreview(slug, "press");
      },
    };
  };

  return (
    <div className="work-grid grid grid-cols-1 gap-6 sm:grid-cols-3">
      {items.map((item) =>
        item.to.startsWith("/") ? (
          <TransitionLink key={item.key} to={item.to} {...entryProps(item)}>
            <Thumbnail item={item} />
          </TransitionLink>
        ) : (
          <a
            key={item.key}
            href={item.to}
            target="_blank"
            rel="noreferrer"
            {...entryProps(item)}
          >
            <Thumbnail item={item} />
          </a>
        ),
      )}
    </div>
  );
}
