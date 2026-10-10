import { Suspense, useLayoutEffect } from "react";
import type { Project } from "../../data/projects";
import { workKey } from "../../data/work";
import { markRouteReady, workTransitionName } from "../../lib/routeTransition";
import { TransitionLink } from "../ui/TransitionLink";
import { projectPreviews } from "./previews";

type LiveWorkProps = {
  project: Project;
};

/** Mounts with the piece, once its code has loaded, and lets the page transition proceed. */
function RouteReady() {
  useLayoutEffect(() => {
    markRouteReady();
  }, []);

  return null;
}

/** The piece itself fills the page; the only chrome is the way back. */
export function LiveWork({ project }: LiveWorkProps) {
  const Preview = projectPreviews[project.slug];

  return (
    <main className="grid min-h-dvh place-items-center">
      <h1 className="sr-only">
        {`${project.title1} ${project.title2}`.trim()}
      </h1>
      {/* The thumbnail that was clicked grows into this. */}
      <div
        className="w-full"
        style={{ viewTransitionName: workTransitionName(workKey(project)) }}
      >
        <Suspense fallback={null}>
          <Preview />
          <RouteReady />
        </Suspense>
      </div>
      <TransitionLink
        to="/"
        // White text blended as a difference, so it reads dark on light stages and light on dark ones.
        className="fixed bottom-[72px] left-1/2 z-10 -translate-x-1/2 text-sm whitespace-nowrap text-white/70 underline decoration-transparent decoration-dotted underline-offset-4 mix-blend-difference transition-colors duration-300 [@media(hover:hover)_and_(pointer:fine)]:hover:text-white [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-white/50"
      >
        Return home
      </TransitionLink>
    </main>
  );
}
