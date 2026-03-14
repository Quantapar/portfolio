export type { ComponentEntry, ComponentProp } from "./types";
export { animatedTimer } from "./animated-timer";
export { addressCard } from "./address-card";
export { floatingToolbar } from "./floating-toolbar";
export { swap } from "./swap";

import { animatedTimer } from "./animated-timer";
import { addressCard } from "./address-card";
import { floatingToolbar } from "./floating-toolbar";
import { swap } from "./swap";

// Add new components here — one import + one array entry
export const uiComponents = [animatedTimer, addressCard, floatingToolbar, swap];
