import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "../data/site";

/** Where the site is served, for the absolute links that crawlers and link previews need. */
export const SITE_URL = (
  process.env.SITE_URL?.replace(/\/$/, "") || "https://www.quantapar.com"
);

type PageMetadata = {
  /** Left out on the home page, which goes by the site name alone. */
  title?: string;
  description?: string;
  path: string;
};

/**
 * Title, description and link preview for one page. Next.js replaces nested objects such as
 * `openGraph` whole rather than merging them, so every page spells out its full preview.
 */
export function pageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
}: PageMetadata): Metadata {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: fullTitle,
      description,
      url: path,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} signature`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/og-image.png"],
    },
  };
}
