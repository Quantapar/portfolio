export type Experience = {
  company: string;
  roleType: string;
  period: string;
  bullets: string[];
  tags: string[];
  logo: {
    label: string;
    color: string;
  };
};

export const experience: Experience[] = [
  {
    company: "Conduit Commerce",
    roleType: "Intern",
    period: "Aug 2025 — Present",
    bullets: [
      "Contributing to the development of enterprise-grade frontend systems powering modern wholesale e-commerce.",
      "Collaborating with the engineering team to build scalable, responsive UI components and optimize performance across the platform.",
    ],
    tags: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Redux",
      "Python",
      "FastAPI",
      "Docker",
    ],
    logo: {
      label: "C",
      color: "#2563eb",
    },
  },
  {
    company: "Mach5 Software",
    roleType: "Freelance",
    period: "Mar 2025 — May 2025",
    bullets: [
      "Worked as a Frontend Developer, transforming Figma design into fully responsive, high-performance website.",
      "Implemented core SEO features: lazy loading, WebP images, clean URLs, meta tags, Open Graph, and accessibility.",
      "Set up essential SEO infrastructure that includes robots.txt, dynamic sitemap.xml, and crawlable internal links.",
    ],
    tags: ["HTML", "Tailwind CSS", "SEO"],
    logo: {
      label: "M5",
      color: "#ea580c",
    },
  },
];
