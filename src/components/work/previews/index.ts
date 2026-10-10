import type { ComponentType } from "react";
import { AddressCardPreview } from "./AddressCardPreview";
import { Dithered404Preview } from "./Dithered404Preview";
import { FloatingToolbarPreview } from "./FloatingToolbarPreview";
import { OtpVerifyPreview } from "./OtpVerifyPreview";
import { WalletBalancePreview } from "./WalletBalancePreview";

export const projectPreviews: Record<string, ComponentType> = {
  "address-card": AddressCardPreview,
  "floating-toolbar": FloatingToolbarPreview,
  "otp-verify": OtpVerifyPreview,
  "wallet-balance": WalletBalancePreview,
  "dithered-404": Dithered404Preview,
};

export function getProjectPreview(slug: string) {
  return projectPreviews[slug];
}
