import { lazy, type ComponentType } from "react";

/** Wraps a named export so the piece (and its styles) is fetched only when its page is opened. */
function load<Name extends string>(
  importer: () => Promise<Record<Name, ComponentType>>,
  name: Name,
) {
  return lazy(() => importer().then((module) => ({ default: module[name] })));
}

export const projectPreviews: Record<string, ComponentType> = {
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
