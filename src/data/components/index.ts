export type { ComponentEntry, ComponentProp } from "./types";
export { animatedButton } from "./animated-button";
export { animatedTimer } from "./animated-timer";
export { addressCard } from "./address-card";

import { animatedButton } from "./animated-button";
import { animatedTimer } from "./animated-timer";
import { addressCard } from "./address-card";

// Add new components here — one import + one array entry
export const uiComponents = [animatedButton, animatedTimer, addressCard];
