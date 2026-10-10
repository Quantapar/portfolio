import { Suspense } from "react";
import { Link } from "react-router-dom";
import type { Project } from "../../data/projects";
import { projectPreviews } from "./previews";

type LiveWorkProps = {
  project: Project;
};

/** The piece itself fills the page; the only chrome is the way back. */
export function LiveWork({ project }: LiveWorkProps) {
  const Preview = projectPreviews[project.slug];

  return (
    <main className="grid min-h-dvh place-items-center">
      <h1 className="sr-only">
        {`${project.title1} ${project.title2}`.trim()}
      </h1>
      <div className="w-full">
        <Suspense fallback={null}>
          <Preview />
        </Suspense>
      </div>
      <Link
        to="/"
        // White text blended as a difference, so it reads dark on light stages and light on dark ones.
        className="fixed bottom-[72px] left-1/2 z-10 -translate-x-1/2 text-sm whitespace-nowrap text-white/70 underline decoration-transparent decoration-dotted underline-offset-4 mix-blend-difference transition-colors duration-300 [@media(hover:hover)_and_(pointer:fine)]:hover:text-white [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-white/50"
      >
        Return home
      </Link>
    </main>
  );
}
