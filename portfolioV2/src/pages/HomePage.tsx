import { Agentation } from "agentation";
import { FullBleedDoubleDivider } from "../components/layout/FullBleedDoubleDivider";
import { GridDivider } from "../components/layout/GridDivider";
import { Hero } from "../components/sections/Hero";
import { AboutContact } from "../components/sections/AboutContact";
import { ExperienceSection } from "../components/sections/ExperienceSection";
import { GitHubActivitySection } from "../components/sections/GitHubActivitySection";
import { ConversationSection } from "../components/sections/ConversationSection";
import { WorkGallery } from "../components/sections/WorkGallery";

export function HomePage() {
  return (
    <>
      <FullBleedDoubleDivider />
      <Hero />
      <GridDivider />
      <AboutContact />
      <GridDivider />
      <WorkGallery />
      <GridDivider />
      <ExperienceSection />
      <GridDivider />
      <GitHubActivitySection />
      <GridDivider />
      <ConversationSection />
      {import.meta.env.DEV && <Agentation endpoint="http://localhost:4747" />}
    </>
  );
}
