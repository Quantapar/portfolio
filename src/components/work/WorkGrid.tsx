import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { WorkItem } from "../../data/work";
import { workTransitionName } from "../../lib/routeTransition";
import { TransitionLink } from "../ui/TransitionLink";

type WorkGridProps = {
  items: WorkItem[];
};

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
  return (
    <div className="work-grid grid grid-cols-1 gap-6 sm:grid-cols-3">
      {items.map((item) =>
        item.to.startsWith("/") ? (
          <TransitionLink
            key={item.key}
            to={item.to}
            aria-label={item.title}
            title={item.title}
            className="work-entry block"
          >
            <Thumbnail item={item} />
          </TransitionLink>
        ) : (
          <a
            key={item.key}
            href={item.to}
            target="_blank"
            rel="noreferrer"
            aria-label={item.title}
            title={item.title}
            className="work-entry block"
          >
            <Thumbnail item={item} />
          </a>
        ),
      )}
    </div>
  );
}
