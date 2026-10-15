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
    () => import("./address-card/AddressCardPreview"),
    "AddressCardPreview",
  ),
  "floating-toolbar": load(
    () => import("./floating-toolbar/FloatingToolbarPreview"),
    "FloatingToolbarPreview",
  ),
  "otp-verify": load(
    () => import("./otp-verify/OtpVerifyPreview"),
    "OtpVerifyPreview",
  ),
  "wallet-balance": load(
    () => import("./wallet-balance/WalletBalancePreview"),
    "WalletBalancePreview",
  ),
  "dithered-404": load(
    () => import("./dithered-404/Dithered404Preview"),
    "Dithered404Preview",
  ),
  "iss-anatomy": load(
    () => import("./iss-anatomy/IssAnatomyPreview"),
    "IssAnatomyPreview",
  ),
  "camera-anatomy": load(
    () => import("./camera-anatomy/CameraAnatomyPreview"),
    "CameraAnatomyPreview",
  ),
  "torchbase-landing": load(
    () => import("./torchbase-landing/TorchbaseLandingPreview"),
    "TorchbaseLandingPreview",
  ),
  "skeuomorphic-controls": load(
    () => import("./skeuo-keypad/SkeuoKeypadPreview"),
    "SkeuoKeypadPreview",
  ),
  "gooey-button": load(
    () => import("./gooey-action/GooeyActionPreview"),
    "GooeyActionPreview",
  ),
  "gooey-text": load(
    () => import("./gooey-text/GooeyTextPreview"),
    "GooeyTextPreview",
  ),
  "gooey-toggle": load(
    () => import("./gooey-toggle/GooeyTogglePreview"),
    "GooeyTogglePreview",
  ),
  "fast-and-easy-cards": load(
    () => import("./how-it-works/HowItWorksPreview"),
    "HowItWorksPreview",
  ),
  toaster: load(
    () => import("./toast-toaster/ToastToasterPreview"),
    "ToastToasterPreview",
  ),
  "that-button": load(
    () => import("./reject-button/RejectButtonPreview"),
    "RejectButtonPreview",
  ),
  "faq-in-motion": load(
    () => import("./klyro-faq/KlyroFaqPreview"),
    "KlyroFaqPreview",
  ),
  "radial-toolkit": load(
    () => import("./radial-tool-menu/RadialToolMenuPreview"),
    "RadialToolMenuPreview",
  ),
  "signature-animation": load(
    () => import("./signature/SignaturePreview"),
    "SignaturePreview",
  ),
  "skeuomorphic-toggle": load(
    () => import("./skeuo-theme-toggle/SkeuoThemeTogglePreview"),
    "SkeuoThemeTogglePreview",
  ),
  "card-layouts": load(
    () => import("./editorial-notes/EditorialNotesPreview"),
    "EditorialNotesPreview",
  ),
  "bento-features": load(
    () => import("./klyro-features/KlyroFeaturesPreview"),
    "KlyroFeaturesPreview",
  ),
  "scroll-text-reveal": load(
    () => import("./scroll-text-reveal/ScrollTextRevealPreview"),
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
