import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "../../../data/projects";
import { pageMetadata } from "../../../lib/seo";
import { ProjectPage } from "../../../views/ProjectPage";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Every project page is built ahead of time; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = getProjectBySlug((await params).slug);
  if (!project) return {};

  return pageMetadata({
    title: `${project.title1} ${project.title2}`.trim(),
    description: project.summary,
    path: `/work/${project.slug}`,
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  if (!getProjectBySlug(slug)) notFound();

  return <ProjectPage slug={slug} />;
}
