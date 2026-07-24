export const siteUrl = "https://www.quantapar.com";
export const siteName = "Quantapar";
export const authorName = "Manu Sharma";
export const aliasName = "Quantapar";
export const authorEmail = "quantapar@gmail.com";
export const ogImageUrl = `${siteUrl}/og-image.png`;

export type SeoRoute = {
  path: string;
  title: string;
  description: string;
  priority: number;
  changeFrequency: "monthly" | "weekly";
  keywords?: string[];
};

export const socialLinks = [
  "https://github.com/Quantapar",
  "https://x.com/quantapar",
  "https://www.linkedin.com/in/quantapar/",
  "https://discord.com/users/762906412564217857",
];

export const seoRoutes: SeoRoute[] = [
  {
    path: "/",
    title: "Quantapar",
    description:
      "Manu Sharma, also known as Quantapar, builds full-stack web products end-to-end with a UI-focused approach — React, TypeScript, Web3, and polished interfaces.",
    priority: 1,
    changeFrequency: "weekly",
    keywords: [
      "Manu Sharma",
      "Quantapar",
      "Manu Sharma portfolio",
      "Quantapar portfolio",
      "Design Engineer",
      "React developer",
      "UI engineer",
      "Web3 UI",
    ],
  },
  {
    path: "/projects",
    title: "Projects",
    description:
      "Explore projects by Manu Sharma (Quantapar), including OnChain UI, Gooey Text, Cypher, dashboards, and polished frontend experiments.",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  {
    path: "/about",
    title: "About",
    description:
      "Learn about Manu Sharma, also known as Quantapar: a design engineer who builds web products end-to-end with a UI-focused approach — React, TypeScript, and Framer Motion.",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/components",
    title: "Components",
    description:
      "Interactive React UI components by Quantapar with live previews, copy-paste code, and polished motion details.",
    priority: 0.75,
    changeFrequency: "weekly",
  },
  {
    path: "/onchain-ui",
    title: "OnChain UI",
    description:
      "OnChain UI is a Web3 component library by Manu Sharma (Quantapar) with production-ready React components for wallets, tokens, chains, and transactions.",
    priority: 0.75,
    changeFrequency: "weekly",
  },
  {
    path: "/gooey-text",
    title: "Gooey Text",
    description:
      "Gooey Text is a keyboard-driven text morph effect by Manu Sharma (Quantapar), built with SVG filters and Framer Motion — type any letter and watch it melt into a gooey blob.",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/dashboard-ui",
    title: "Dashboard UI",
    description:
      "Dashboard UI is a SaaS analytics dashboard by Manu Sharma (Quantapar) with KPI cards, order tables, filters, and a clean dark interface.",
    priority: 0.65,
    changeFrequency: "monthly",
  },
  {
    path: "/100xdevs",
    title: "100xDevs",
    description:
      "A frontend revamp for the 100xDevs platform by Manu Sharma (Quantapar), featuring modern UI components, animation, and design system work.",
    priority: 0.65,
    changeFrequency: "monthly",
  },
  {
    path: "/cypher",
    title: "Cypher",
    description:
      "Cypher is a full-stack contest hosting platform by Manu Sharma (Quantapar), built with React, Bun, Postgres, Prisma, and Docker.",
    priority: 0.65,
    changeFrequency: "monthly",
  },
  {
    path: "/components/address-card",
    title: "Address Card",
    description:
      "A compact address card React component by Quantapar for displaying wallet, account, and identity details in polished Web3 interfaces.",
    priority: 0.55,
    changeFrequency: "monthly",
  },
  {
    path: "/components/floating-toolbar",
    title: "Floating Toolbar",
    description:
      "A floating toolbar React component by Quantapar for compact navigation, tools, actions, and polished interface controls.",
    priority: 0.55,
    changeFrequency: "monthly",
  },
  {
    path: "/components/otp-verify",
    title: "OTP Verify",
    description:
      "An OTP verification React component by Quantapar with polished input states and interaction details.",
    priority: 0.55,
    changeFrequency: "monthly",
  },
  {
    path: "/components/wallet-balance",
    title: "Wallet Balance",
    description:
      "A wallet balance React component by Quantapar for clean Web3 portfolio and token balance interfaces.",
    priority: 0.55,
    changeFrequency: "monthly",
  },
];

export const rootSeoRoute = seoRoutes[0] as SeoRoute;

export function getSeoRoute(pathname: string) {
  const normalizedPath = normalizePath(pathname);
  return (
    seoRoutes.find((route) => route.path === normalizedPath) ?? rootSeoRoute
  );
}

export function normalizePath(pathname: string) {
  const path = pathname.split("#")[0]?.split("?")[0] || "/";
  if (path === "") return "/";
  return path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
}

export function getCanonicalUrl(pathname: string) {
  const route = getSeoRoute(pathname);
  return `${siteUrl}${route.path === "/" ? "/" : route.path}`;
}

export function getJsonLd(pathname: string) {
  const route = getSeoRoute(pathname);
  const canonicalUrl = getCanonicalUrl(route.path);

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: authorName,
      alternateName: aliasName,
      url: siteUrl,
      image: `${siteUrl}/me-color.jpeg`,
      email: `mailto:${authorEmail}`,
      jobTitle: "Design Engineer",
      sameAs: socialLinks,
      knowsAbout: [
        "Full-Stack Development",
        "React",
        "TypeScript",
        "Framer Motion",
        "Web3 UI",
        "Frontend Development",
        "Interaction Design",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteName,
      alternateName: `${authorName} Portfolio`,
      url: siteUrl,
      description: rootSeoRoute.description,
      inLanguage: "en",
      author: { "@id": `${siteUrl}/#person` },
      publisher: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: route.title,
      description: route.description,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#person` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: ogImageUrl,
      },
      inLanguage: "en",
    },
  ];

  if (route.path === "/projects") {
    graph.push({
      "@type": "ItemList",
      "@id": `${canonicalUrl}#projects`,
      name: "Projects by Manu Sharma",
      itemListElement: [
        "OnChain UI",
        "Gooey Text",
        "Dashboard UI",
        "100xDevs Frontend",
        "Cypher",
      ].map((name, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name,
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
