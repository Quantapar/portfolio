import { Agentation } from "agentation";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/layout/SiteLayout";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProjectPage } from "./pages/ProjectPage";
import { WorkIndexPage } from "./pages/WorkIndexPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="work" element={<WorkIndexPage />} />
          <Route path="work/:slug" element={<ProjectPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      {import.meta.env.DEV && <Agentation endpoint="http://localhost:4747" />}
    </BrowserRouter>
  );
}

export default App;
