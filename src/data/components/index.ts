export type { ComponentEntry, ComponentProp } from "./types";
export { addressCard } from "./address-card";
export { floatingToolbar } from "./floating-toolbar";
export { swap } from "./swap";
export { walletConnect } from "./wallet-connect";
export { chainSwitcher } from "./chain-switcher";
export { disconnectModal } from "./disconnect-modal";

import { addressCard } from "./address-card";
import { floatingToolbar } from "./floating-toolbar";
import { swap } from "./swap";
import { walletConnect } from "./wallet-connect";
import { chainSwitcher } from "./chain-switcher";
import { disconnectModal } from "./disconnect-modal";

export const uiComponents = [addressCard, floatingToolbar, swap, walletConnect, chainSwitcher, disconnectModal];
