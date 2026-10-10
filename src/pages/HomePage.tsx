import { FullBleedDoubleDivider } from "../components/layout/FullBleedDoubleDivider";
import { GridDivider } from "../components/layout/GridDivider";
import { Hero } from "../components/sections/Hero";
import { AboutContact } from "../components/sections/AboutContact";
import { ExperienceSection } from "../components/sections/ExperienceSection";
import { GitHubActivitySection } from "../components/sections/GitHubActivitySection";
import { TweetsSection } from "../components/sections/TweetsSection";
import { WorkGallery } from "../components/sections/WorkGallery";
import { tweets } from "virtual:tweets";

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
      {tweets.length > 0 ? (
        <>
          <TweetsSection />
          <GridDivider />
        </>
      ) : null}
      <ExperienceSection />
      <GridDivider />
      <GitHubActivitySection />
    </>
  );
}
