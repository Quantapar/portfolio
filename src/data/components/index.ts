export type { ComponentEntry, ComponentProp } from "./types";
export { animatedTimer } from "./animated-timer";
export { addressCard } from "./address-card";
export { floatingToolbar } from "./floating-toolbar";

import { animatedTimer } from "./animated-timer";
import { addressCard } from "./address-card";
import { floatingToolbar } from "./floating-toolbar";

// Add new components here — one import + one array entry
export const uiComponents = [animatedTimer, addressCard, floatingToolbar];
