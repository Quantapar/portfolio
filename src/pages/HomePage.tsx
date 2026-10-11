import { useEffect, useState } from "react";
import { AboutContact } from "../components/sections/AboutContact";
import { ExperienceSection } from "../components/sections/ExperienceSection";
import { WorkGallery } from "../components/sections/WorkGallery";

// The entrance is for a visitor who lands on this page. Arriving from another page
// is already carried by the morph, so a second entrance would only fight it.
let entrancePending =
  typeof window !== "undefined" && window.location.pathname === "/";

export function HomePage() {
  const [entering] = useState(entrancePending);

  // Once this page has been left, coming back to it is no longer a landing.
  useEffect(
    () => () => {
      entrancePending = false;
    },
    [],
  );

  return (
    // `contents` leaves the blocks as children of the page column, so its spacing still applies.
    // The blocks carry `data-enter` with their place in the order (see index.css).
    <div className="contents" data-entering={entering ? "" : undefined}>
      <AboutContact />
      <WorkGallery />
      <ExperienceSection />
    </div>
  );
}
