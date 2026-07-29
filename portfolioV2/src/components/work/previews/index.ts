import type { ComponentType } from "react";
import { AddressCardPreview } from "./AddressCardPreview";
import { AnimatedTimerPreview } from "./AnimatedTimer";
import { BatchTxApproverPreview } from "./BatchTxApproverPreview";
import { FloatingToolbarPreview } from "./FloatingToolbarPreview";
import { OtpVerifyPreview } from "./OtpVerifyPreview";
import { ProgressStakeCardPreview } from "./ProgressStakeCardPreview";
import { ShimmerTxLoaderPreview } from "./ShimmerTxLoaderPreview";
import { WalletBalancePreview } from "./WalletBalancePreview";
import { AnimatedButtonPreview } from "./AnimatedButtonPreview";

export const projectPreviews: Record<string, ComponentType> = {
  "address-card": AddressCardPreview,
  "floating-toolbar": FloatingToolbarPreview,
  "otp-verify": OtpVerifyPreview,
  "wallet-balance": WalletBalancePreview,
  "batch-tx-approver": BatchTxApproverPreview,
  "progress-stake-card": ProgressStakeCardPreview,
  "shimmer-tx-loader": ShimmerTxLoaderPreview,
  "animated-timer": AnimatedTimerPreview,
  "animated-button": AnimatedButtonPreview,
};

export function getProjectPreview(slug: string) {
  return projectPreviews[slug];
}
