import type { ReactNode } from "react";

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface ComponentEntry {
  id: string;
  name: string;
  description: string;
  preview: ReactNode;
  code: string;
  npmCommand?: string;
  props?: ComponentProp[];
}
