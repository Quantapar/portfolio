"use client";

import { Suspense, useLayoutEffect, useSyncExternalStore } from "react";
import type { Project } from "../../data/projects";
import { workKey } from "../../data/work";
import { useIsClient } from "../../hooks/useIsClient";
import { entryFrom } from "../../lib/historyEntry";
import { markRouteReady, workTransitionName } from "../../lib/routeTransition";
import { TransitionLink } from "../ui/TransitionLink";
import { projectPreviews } from "./previews";

type LiveWorkProps = {
  project: Project;
};

// Pieces that stack into a column taller than a phone screen. Floating, the link back would
// ride over their content as it scrolls, so on a phone it rests at the end of the piece instead,
// in room each of them leaves for it (see the end of their stylesheets).
const LINK_AT_END_ON_PHONES = new Set([
  "fast-and-easy-cards",
  "faq-in-motion",
  "bento-features",
  "card-layouts",
]);

/** Mounts with the piece, once its code has loaded, and lets the page transition proceed. */
function RouteReady() {
  useLayoutEffect(() => {
    markRouteReady();
  }, []);

  return null;
}

const subscribe = () => () => {};

/** The piece itself fills the page; the only chrome is the way back. */
export function LiveWork({ project }: LiveWorkProps) {
  const Preview = projectPreviews[project.slug];
  // The server can't know where the visitor came from, so it renders the link for a direct visit.
  const from = useSyncExternalStore(subscribe, entryFrom, () => undefined);
  const openedFromWork = from === "/work";
  // Pieces run in the browser only: they measure, animate and load their own code there.
  const isClient = useIsClient();

  return (
    <main className="relative grid min-h-dvh place-items-center">
      <h1 className="sr-only">
        {`${project.title1} ${project.title2}`.trim()}
      </h1>
      {/* The thumbnail that was clicked grows into this. */}
      <div
        className="w-full"
        style={{ viewTransitionName: workTransitionName(workKey(project)) }}
      >
        {isClient ? (
          <Suspense fallback={null}>
            <Preview />
            <RouteReady />
          </Suspense>
        ) : null}
      </div>
      <TransitionLink
        // Back to the page the piece was opened from, at the thumbnail that was clicked.
        // Someone who arrived here directly has no such page, and goes home.
        to={openedFromWork ? "/work" : "/"}
        back
        // White text blended as a difference, so it reads dark on light stages and light on dark ones.
        className={`fixed bottom-[64px] left-1/2 z-10 -translate-x-1/2 px-3 py-2 text-sm whitespace-nowrap text-white/70 underline decoration-transparent decoration-dotted underline-offset-4 mix-blend-difference transition-colors duration-300 [@media(hover:hover)_and_(pointer:fine)]:hover:text-white [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-white/50 ${LINK_AT_END_ON_PHONES.has(project.slug) ? "max-sm:absolute" : ""}`}
      >
        {openedFromWork ? "Back to all work" : "Return home"}
      </TransitionLink>
    </main>
  );
}
