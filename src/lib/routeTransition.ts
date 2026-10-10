/**
 * Page changes run inside a view transition, so elements that exist on both pages
 * (the work thumbnails, the "Work" title) morph into place instead of being redrawn.
 */

let markReady: (() => void) | null = null;

/** Longest the old page stays frozen while the new one gets ready. */
const READY_TIMEOUT_MS = 1500;

export function canTransition() {
  return (
    "startViewTransition" in document &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Runs `navigate`, holding the old page on screen until the new one reports it has rendered. */
export function startRouteTransition(navigate: () => void) {
  if (!canTransition()) {
    navigate();
    return;
  }

  document.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        const done = () => {
          window.clearTimeout(timer);
          markReady = null;
          resolve();
        };
        // A page that never reports ready must not leave the screen frozen.
        const timer = window.setTimeout(done, READY_TIMEOUT_MS);

        markReady = done;
        navigate();
      }),
  );
}

/** Called by the new page once its content is in the DOM. */
export function markRouteReady() {
  markReady?.();
}

/** The shared name that ties a thumbnail to the same piece on another page. */
export function workTransitionName(key: string) {
  return `work-${key}`;
}
