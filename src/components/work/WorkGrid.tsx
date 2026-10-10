import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import type { WorkItem } from "../../data/work";

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
    <span className="block aspect-[3/2] overflow-hidden bg-background ring-1 ring-foreground/5">
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
          <Link
            key={item.key}
            to={item.to}
            aria-label={item.title}
            title={item.title}
            className="work-entry block"
          >
            <Thumbnail item={item} />
          </Link>
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
