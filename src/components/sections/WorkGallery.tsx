import { homeItems } from "../../data/work";
import { TransitionLink } from "../ui/TransitionLink";
import { WorkGrid } from "../work/WorkGrid";

export function WorkGallery() {
  return (
    <section id="work" className="flex scroll-mt-20 flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-medium">
          {/* The heading is one way into the full list; its fill sits 4px/6px outside the text. */}
          <TransitionLink
            to="/work"
            className="relative isolate flex w-fit items-center before:absolute before:-inset-x-1.5 before:-inset-y-1 before:-z-10 before:bg-foreground/5 before:opacity-0 before:transition-opacity before:duration-200 [@media(hover:hover)_and_(pointer:fine)]:hover:before:opacity-100"
          >
            {/* Shared with the breadcrumb on the work page, so the word slides there. */}
            <span
              className="inline-block"
              style={{ viewTransitionName: "work-heading" }}
            >
              Work
            </span>
          </TransitionLink>
        </h2>
        {/* The grid shows six pieces; this says plainly that there are more. */}
        <TransitionLink
          to="/work"
          // The padding widens the clickable area; the negative margin keeps the words where they were.
          className="group -my-1.5 -mr-2 inline-flex items-center gap-1 px-2 py-1.5 text-[13px] text-foreground/60 transition-colors duration-200 [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
        >
          View all
          <span
            aria-hidden="true"
            className="transition-transform duration-200 motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5"
          >
            →
          </span>
        </TransitionLink>
      </div>
      <WorkGrid items={homeItems} />
    </section>
  );
}
