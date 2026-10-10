import Autoplay from "embla-carousel-autoplay";
import { useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { tweets } from "virtual:tweets";
import { TweetCard } from "../tweets/TweetCard";
import { BevelBox } from "../ui/BevelBox";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/Carousel";
import { XIcon } from "../ui/BrandIcons";

import { links } from "../../data/site";

const AUTOPLAY_DELAY = 3000;

// Embla's duration is a glide factor, not milliseconds: 25 is its snappy default, 50 settles in about a second.
const carouselOptions = { loop: true, align: "start", duration: 50 } as const;

export function TweetsSection() {
  const shouldReduceMotion = useReducedMotion();
  const plugins = useMemo(
    () =>
      shouldReduceMotion
        ? []
        : [
            Autoplay({
              delay: AUTOPLAY_DELAY,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ],
    [shouldReduceMotion],
  );

  return (
    <section id="posts" className="scroll-mt-20 px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 className="text-lg font-medium">Posts</h2>
        <a
          href={links.x}
          target="_blank"
          rel="noreferrer"
          className="group pressable inline-flex items-center gap-2 text-sm text-foreground/60"
        >
          <XIcon />
          Profile
          <span aria-hidden="true" className="arrow-nudge">
            ↗
          </span>
        </a>
      </div>

      <Carousel
        opts={carouselOptions}
        plugins={plugins}
        aria-label="Recent posts on X"
      >
        <BevelBox className="overflow-hidden">
          {/* One pixel wider than the frame so the last card's divider is clipped, not doubled. */}
          <div className="-me-px">
            <CarouselContent>
              {tweets.map((tweet) => (
                <CarouselItem
                  key={tweet.id}
                  className="border-r border-dotted border-border sm:basis-1/2"
                >
                  <TweetCard tweet={tweet} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
        </BevelBox>

        <div className="mt-4 flex justify-end">
          <BevelBox>
            <div className="flex divide-x divide-dotted divide-border">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </BevelBox>
        </div>
      </Carousel>
    </section>
  );
}
