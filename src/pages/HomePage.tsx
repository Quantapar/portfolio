import { AboutContact } from "../components/sections/AboutContact";
import { ExperienceSection } from "../components/sections/ExperienceSection";
import { WorkGallery } from "../components/sections/WorkGallery";

export function HomePage() {
  return (
    <>
      <AboutContact />
      <WorkGallery />
      <ExperienceSection />
    </>
  );
}
