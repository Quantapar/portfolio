import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ComponentProps,
  type KeyboardEvent,
} from "react";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: CarouselApi;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function useCarouselValue<T>(
  api: CarouselApi,
  read: (api: NonNullable<CarouselApi>) => T,
  fallback: T,
) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!api) return () => {};

      api.on("select", onChange).on("reInit", onChange);

      return () => {
        api.off("select", onChange).off("reInit", onChange);
      };
    },
    [api],
  );

  return useSyncExternalStore(subscribe, () => (api ? read(api) : fallback));
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className = "",
  children,
  ...props
}: ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );
  const canScrollPrev = useCarouselValue(api, (a) => a.canScrollPrev(), false);
  const canScrollNext = useCarouselValue(api, (a) => a.canScrollNext(), false);

  // A manual step restarts the autoplay countdown so the next slide doesn't follow instantly.
  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
    api?.plugins().autoplay?.reset();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
    api?.plugins().autoplay?.reset();
  }, [api]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.defaultPrevented) return;
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        target?.closest(
          'input, textarea, select, [contenteditable="true"], [role="slider"]',
        )
      ) {
        return;
      }
      const back = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
      const forward = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
      if (event.key === back) {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === forward) {
        event.preventDefault();
        scrollNext();
      }
    },
    [orientation, scrollPrev, scrollNext],
  );

  useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={`relative transition-ring outline-none focus-visible:ring-3 focus-visible:ring-foreground/25 ${className}`.trim()}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className = "", ...props }: ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={`flex ${orientation === "vertical" ? "flex-col" : ""} ${className}`.trim()}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={`min-w-0 shrink-0 grow-0 basis-full ${className}`.trim()}
      {...props}
    />
  );
}

function CarouselButton({ className = "", ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={`inline-flex size-11 touch-manipulation items-center justify-center text-foreground/70 transition-[background-color] duration-[160ms] ease-[var(--ease-out)] active:bg-foreground/10 disabled:pointer-events-none disabled:opacity-40 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/5 ${className}`.trim()}
      {...props}
    />
  );
}

function CarouselPrevious(props: ComponentProps<"button">) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <CarouselButton
      data-slot="carousel-previous"
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeft
        aria-hidden="true"
        className={`size-4 ${orientation === "vertical" ? "rotate-90" : ""}`.trim()}
      />
      <span className="sr-only">Previous slide</span>
    </CarouselButton>
  );
}

function CarouselNext(props: ComponentProps<"button">) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <CarouselButton
      data-slot="carousel-next"
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRight
        aria-hidden="true"
        className={`size-4 ${orientation === "vertical" ? "rotate-90" : ""}`.trim()}
      />
      <span className="sr-only">Next slide</span>
    </CarouselButton>
  );
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
