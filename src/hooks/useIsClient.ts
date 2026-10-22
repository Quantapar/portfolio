import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False while the server renders the page and while it hydrates, true from then on. */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
