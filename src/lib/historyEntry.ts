/**
 * Which visit to a page this is, and where it was opened from.
 *
 * Next.js keeps no key per history entry and rewrites `history.state` on every navigation, so the
 * key comes from the browser's Navigation API. Browsers without it get one kept in `history.state`,
 * which holds for as long as Next.js leaves it there.
 */

type NavigationApi = {
  currentEntry: { key: string } | null;
};

const STATE_FIELD = "__entry";
/** Where each entry was opened from, kept for the tab's lifetime so a reload still knows. */
const FROM_STORAGE_KEY = "entry-from";

/** The page this tab first loaded on. There is nothing of this site behind it to step back to. */
let landingKey: string | null = null;
/** Keys already shown in this document: meeting one again means Back or Forward led there. */
const seenKeys = new Set<string>();
/** The page a link was pressed on, until the page it opens takes it. */
let pendingFrom: string | undefined;

function navigationApi() {
  return (window as Window & { navigation?: NavigationApi }).navigation;
}

function readFromStore(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(FROM_STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeFrom(key: string, from: string) {
  try {
    sessionStorage.setItem(
      FROM_STORAGE_KEY,
      JSON.stringify({ ...readFromStore(), [key]: from }),
    );
  } catch {
    // Storage can be blocked; the link back then reads as if the page was opened directly.
  }
}

function currentKey() {
  const fromApi = navigationApi()?.currentEntry?.key;
  if (fromApi) return fromApi;

  const stored = window.history.state?.[STATE_FIELD];
  if (typeof stored === "string") return stored;

  const key = crypto.randomUUID();
  window.history.replaceState(
    { ...window.history.state, [STATE_FIELD]: key },
    "",
  );
  return key;
}

/** Called by a link as it opens another page, so that page knows where it came from. */
export function rememberFrom(pathname: string) {
  pendingFrom = pathname;
}

/**
 * Called once each page has rendered. Returns its key, and whether it is one returned to
 * with Back or Forward rather than newly opened.
 */
export function enterEntry() {
  const key = currentKey();
  const returning = seenKeys.has(key);

  landingKey ??= key;
  seenKeys.add(key);

  if (!returning && pendingFrom !== undefined) writeFrom(key, pendingFrom);
  pendingFrom = undefined;

  return { key, returning };
}

/** Whether a page of this site sits behind this one in the tab's history. */
export function canStepBack() {
  return landingKey !== null && currentKey() !== landingKey;
}

/** Where this page was opened from, if a link on this site opened it. */
export function entryFrom() {
  // A link that was just pressed has not handed its page over yet.
  return pendingFrom ?? readFromStore()[currentKey()];
}
