import type { MetadataRoute } from "next";
import { projects } from "../data/projects";
import { SITE_URL } from "../lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/work", ...projects.map((project) => `/work/${project.slug}`)].map(
    (path) => ({ url: `${SITE_URL}${path === "/" ? "" : path}` }),
  );
}
