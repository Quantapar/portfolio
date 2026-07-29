import type { ComponentType } from "react";
import { AddressCardPreview } from "./AddressCardPreview";
import { AnimatedCounterPreview } from "./AnimatedCounterPreview";
import { AnimatedTimerPreview } from "./AnimatedTimer";
import { FloatingToolbarPreview } from "./FloatingToolbarPreview";
import { OtpVerifyPreview } from "./OtpVerifyPreview";
import { WalletBalancePreview } from "./WalletBalancePreview";

export const projectPreviews: Record<string, ComponentType> = {
  "address-card": AddressCardPreview,
  "floating-toolbar": FloatingToolbarPreview,
  "otp-verify": OtpVerifyPreview,
  "wallet-balance": WalletBalancePreview,
  "animated-timer": AnimatedTimerPreview,
  "animated-counter": AnimatedCounterPreview,
};

export function getProjectPreview(slug: string) {
  return projectPreviews[slug];
}
