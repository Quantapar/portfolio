"use client";

import { Agentation } from "agentation";

/** Tools for working on the site locally; never part of a production build. */
export function DevTools() {
  return <Agentation endpoint="http://localhost:4747" />;
}
