export type { ComponentEntry, ComponentProp } from "./types";
export { addressCard } from "./address-card";
export { floatingToolbar } from "./floating-toolbar";
export { otpVerify } from "./otp-verify";
export { walletBalance } from "./wallet-balance";

import { addressCard } from "./address-card";
import { floatingToolbar } from "./floating-toolbar";
import { otpVerify } from "./otp-verify";
import { walletBalance } from "./wallet-balance";

export const uiComponents = [addressCard, floatingToolbar, otpVerify, walletBalance];
