import { lazy, type ComponentType } from "react";

type Preview = ComponentType & {
  /** Starts fetching the piece ahead of time. Asking twice costs nothing: the browser keeps the first answer. */
  preload: () => Promise<unknown>;
};

/** Wraps a named export so the piece (and its styles) is fetched only when it is needed. */
function load<Name extends string>(
  importer: () => Promise<Record<Name, ComponentType>>,
  name: Name,
): Preview {
  return Object.assign(
    lazy<ComponentType>(() =>
      importer().then((module) => ({ default: module[name] })),
    ),
    { preload: importer },
  );
}

export const projectPreviews: Record<string, Preview> = {
  "address-card": load(
    () => import("./AddressCardPreview"),
    "AddressCardPreview",
  ),
  "floating-toolbar": load(
    () => import("./FloatingToolbarPreview"),
    "FloatingToolbarPreview",
  ),
  "otp-verify": load(() => import("./OtpVerifyPreview"), "OtpVerifyPreview"),
  "wallet-balance": load(
    () => import("./WalletBalancePreview"),
    "WalletBalancePreview",
  ),
  "dithered-404": load(
    () => import("./Dithered404Preview"),
    "Dithered404Preview",
  ),
  "camera-anatomy": load(
    () => import("./CameraAnatomyPreview"),
    "CameraAnatomyPreview",
  ),
  "skeuomorphic-controls": load(
    () => import("./SkeuoKeypadPreview"),
    "SkeuoKeypadPreview",
  ),
  "gooey-button": load(
    () => import("./GooeyActionPreview"),
    "GooeyActionPreview",
  ),
  "gooey-text": load(() => import("./GooeyTextPreview"), "GooeyTextPreview"),
  "gooey-toggle": load(
    () => import("./GooeyTogglePreview"),
    "GooeyTogglePreview",
  ),
  "fast-and-easy-cards": load(
    () => import("./HowItWorksPreview"),
    "HowItWorksPreview",
  ),
  toaster: load(() => import("./ToastToasterPreview"), "ToastToasterPreview"),
  "that-button": load(
    () => import("./RejectButtonPreview"),
    "RejectButtonPreview",
  ),
  "faq-in-motion": load(() => import("./KlyroFaqPreview"), "KlyroFaqPreview"),
  "radial-toolkit": load(
    () => import("./RadialToolMenuPreview"),
    "RadialToolMenuPreview",
  ),
  "signature-animation": load(
    () => import("./SignaturePreview"),
    "SignaturePreview",
  ),
  "skeuomorphic-toggle": load(
    () => import("./SkeuoThemeTogglePreview"),
    "SkeuoThemeTogglePreview",
  ),
  "card-layouts": load(
    () => import("./EditorialNotesPreview"),
    "EditorialNotesPreview",
  ),
  "bento-features": load(
    () => import("./KlyroFeaturesPreview"),
    "KlyroFeaturesPreview",
  ),
  "scroll-text-reveal": load(
    () => import("./ScrollTextRevealPreview"),
    "ScrollTextRevealPreview",
  ),
};

export function getProjectPreview(slug: string) {
  return projectPreviews[slug];
}

/** Too large to fetch on a passing hover: the charts library alone is several hundred KB. */
const HEAVY = new Set(["bento-features"]);

/**
 * Fetches a piece before its page is asked for, so the click that follows has nothing to wait on.
 * A hover is only a guess, so heavy pieces wait for the press.
 */
export function preloadProjectPreview(slug: string, intent: "hover" | "press") {
  const preview = projectPreviews[slug];
  if (!preview || (intent === "hover" && HEAVY.has(slug))) return;

  // A failed guess is not an error: the page fetches the piece again when it opens.
  void preview.preload().catch(() => {});
}
