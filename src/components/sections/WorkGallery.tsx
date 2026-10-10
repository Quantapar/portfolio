import { Link } from "react-router-dom";
import { homeItems } from "../../data/work";
import { WorkGrid } from "../work/WorkGrid";

export function WorkGallery() {
  return (
    <section id="work" className="flex scroll-mt-20 flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-medium">
          {/* The heading is one way into the full list; its fill sits 4px/6px outside the text. */}
          <Link
            to="/work"
            className="relative isolate flex w-fit items-center before:absolute before:-inset-x-1.5 before:-inset-y-1 before:-z-10 before:bg-foreground/5 before:opacity-0 before:transition-opacity before:duration-200 [@media(hover:hover)_and_(pointer:fine)]:hover:before:opacity-100"
          >
            Work
          </Link>
        </h2>
        {/* The grid shows six pieces; this says plainly that there are more. */}
        <Link
          to="/work"
          className="group inline-flex items-center gap-1 text-[13px] text-foreground/50 transition-colors duration-200 [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground"
        >
          View all
          <span
            aria-hidden="true"
            className="transition-transform duration-200 motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
      </div>
      <WorkGrid items={homeItems} />
    </section>
  );
}
