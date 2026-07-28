import { Agentation } from "agentation";
import { FullBleedDoubleDivider } from "./components/layout/FullBleedDoubleDivider";
import { GridDivider } from "./components/layout/GridDivider";
import { SiteHeader } from "./components/layout/SiteHeader";
import { PageShell } from "./components/layout/PageShell";
import { Hero } from "./components/sections/Hero";
import { AboutContact } from "./components/sections/AboutContact";
import { ExperienceSection } from "./components/sections/ExperienceSection";
import { GitHubActivitySection } from "./components/sections/GitHubActivitySection";
import { WorkGallery } from "./components/sections/WorkGallery";

function App() {
  return (
    <div className="min-h-dvh w-full overflow-x-clip">
      <PageShell>
        <SiteHeader />
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
      </PageShell>
      {import.meta.env.DEV && <Agentation endpoint="http://localhost:4747" />}
    </div>
  );
}

export default App;
