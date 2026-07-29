export type ProjectType =
  | "component"
  | "landing"
  | "interaction"
  | "tweak"
  | "product";

export type Project = {
  slug: string;
  title1: string;
  title2: string;
  type: ProjectType;
  featured: boolean;
  year: number;
  summary: string;
  useCase: string;
  src: string;
  hero?: string;
  liveUrl?: string;
  sourceUrl?: string;
  tech?: string[];
  status?: string;
};

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  component: "Component",
  landing: "Landing page",
  interaction: "Micro-interaction",
  tweak: "Redesign / tweak",
  product: "Product",
};

export const projects: Project[] = [
  {
    slug: "onchain-ui",
    title1: "OnChain",
    title2: "UI",
    type: "product",
    featured: true,
    year: 2026,
    status: "Currently building",
    summary:
      "A Web3 component library and UI marketplace. Production-ready React components for wallets, tokens, chains, and transactions.",
    useCase:
      "Copy, paste, and ship Web3 UI without rebuilding wallet flows, token displays, and transaction states from scratch.",
    src: "/work/onchain-ui.png",
    liveUrl: "https://onchainui.quantapar.com/",
    sourceUrl: "https://github.com/Quantapar/OnChainUI",
    tech: ["React", "TypeScript", "Tailwind CSS", "npm"],
  },
  {
    slug: "gooey-text",
    title1: "Gooey",
    title2: "Text",
    type: "interaction",
    featured: true,
    year: 2025,
    summary:
      "Type any letter and watch it melt into a gooey blob. SVG filters and Framer Motion drive the morph effect.",
    useCase:
      "Keyboard-driven morph animation where circles flow along each glyph's skeleton and fuse into one liquid shape.",
    src: "/work/gooey-text.png",
    liveUrl: "https://gooey-text.quantapar.com/",
    sourceUrl: "https://github.com/Quantapar/Gooey-Text",
    tech: ["React", "TypeScript", "Framer Motion", "SVG Filters"],
  },
  {
    slug: "jagruk-jaipur",
    title1: "Jagruk",
    title2: "Jaipur",
    type: "landing",
    featured: true,
    year: 2025,
    summary:
      "A full revamp of Jaipur's event guide. Discover concerts, comedy, food fests, art, and workshops across the city.",
    useCase:
      "Curated city events in one modern interface — built for locals looking for what's happening this week.",
    src: "/work/jaipur.png",
    liveUrl: "https://jagrukjaipur.quantapar.com/",
    tech: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    slug: "dashboard-ui",
    title1: "Dashboard",
    title2: "UI",
    type: "landing",
    featured: false,
    year: 2025,
    summary:
      "A SaaS analytics dashboard built as an assignment. KPI cards with sparklines, filterable order tables, and a collapsible sidebar.",
    useCase:
      "Dark analytics interface with sortable columns, status tabs, and metric cards for operational monitoring.",
    src: "/work/dashboard-ui.png",
    liveUrl: "https://dashboard-ui.quantapar.com/",
    sourceUrl: "https://github.com/Quantapar/dashboard-ui",
    tech: ["React", "TypeScript", "Tailwind CSS"],
  },
  {
    slug: "100xdevs",
    title1: "100xDevs",
    title2: "Frontend",
    type: "tweak",
    featured: false,
    year: 2025,
    summary:
      "A complete frontend revamp for the 100xDevs platform. Immersive web animations, modern UI components, and a robust design system.",
    useCase:
      "Platform refresh with motion-led interactions and a cohesive component library for developer education.",
    src: "/work/100xDevsFrontend.png",
    liveUrl: "https://100xdevs.quantapar.com/",
    sourceUrl: "https://github.com/Quantapar/100xDevs-Frontend",
    tech: ["React", "Tailwind CSS", "Framer Motion"],
  },
  {
    slug: "cypher",
    title1: "Cypher",
    title2: "Arena",
    type: "product",
    featured: false,
    year: 2025,
    summary:
      "A full-stack contest hosting platform. Role-based access, real-time code submissions, and live leaderboards.",
    useCase:
      "Scalable contest infrastructure for coding competitions with live ranking and submission workflows.",
    src: "/work/Cypher.png",
    liveUrl: "https://cypherarena.quantapar.com/",
    sourceUrl: "https://github.com/Quantapar/contest-platform",
    tech: ["React", "Bun", "Postgres", "Prisma", "Docker"],
  },
  {
    slug: "100xmobile-revamp",
    title1: "100xMobile",
    title2: "Revamp",
    type: "tweak",
    featured: false,
    year: 2025,
    summary:
      "Complete UI overhaul of the 100xMobile website. Redesigned the entire app with a modern, polished interface.",
    useCase:
      "Open-source contribution — full UI revamp improving usability and visual consistency across the mobile platform site.",
    src: "/work/100xmobile.png",
    liveUrl: "https://github.com/bluntbrain/100xmobile/pull/1",
    sourceUrl: "https://github.com/bluntbrain/100xmobile",
    tech: ["React", "UI Design", "Open Source"],
  },
  {
    slug: "krane-apps-revamp",
    title1: "Krane Apps",
    title2: "Revamp",
    type: "tweak",
    featured: false,
    year: 2025,
    summary:
      "Full UI revamp of the Krane Apps website with a GitHub-style design. Rebuilt for a cleaner, more professional look.",
    useCase:
      "Open-source contribution — GitHub-inspired layout and component patterns for a developer tools company site.",
    src: "/work/dashboard-ui.png",
    liveUrl: "https://github.com/bluntbrain/krane-apps-github-style-website",
    sourceUrl: "https://github.com/bluntbrain/krane-apps-github-style-website",
    tech: ["React", "UI Design", "Open Source"],
  },
  {
    slug: "torchbase-landing",
    title1: "Torchbase",
    title2: "Landing",
    type: "landing",
    featured: false,
    year: 2025,
    summary:
      "A warm, high-contrast product landing page for an AI reliability workspace.",
    useCase:
      "Product marketing screen with bold hero typography and clear navigation — shared as a design study on X.",
    src: "/work/torchbase-landing.png",
    liveUrl: "https://x.com/quantapar/status/2077693670493769794",
    tech: ["Landing page", "Product design"],
  },
  {
    slug: "torchbase-404",
    title1: "Up in",
    title2: "Smoke",
    type: "tweak",
    featured: false,
    year: 2025,
    summary:
      "A branded empty state with a pixel-fire 404 treatment and clear recovery actions.",
    useCase:
      "404 page design with personality — pixel art fire motif and actionable recovery paths for a lost user.",
    src: "/work/torchbase-lms-404.png",
    liveUrl: "https://x.com/quantapar/status/2077822493302329806",
    tech: ["Empty state", "404", "Product design"],
  },
  {
    slug: "floating-toolbar",
    title1: "Floating",
    title2: "Toolbar",
    type: "component",
    featured: true,
    year: 2025,
    summary:
      "A dock-style floating navigation bar with spring-animated hover highlights, directional tooltips, and an active indicator dot.",
    useCase:
      "Compact navigation for dashboards or portfolios — hover reveals labels with spring physics and active state tracking.",
    src: "",
    tech: ["React", "Framer Motion", "Navigation"],
  },
  {
    slug: "address-card",
    title1: "Address",
    title2: "Card",
    type: "component",
    featured: false,
    year: 2025,
    summary:
      "A customizable profile card with animated color picker and editable fields.",
    useCase:
      "Web3 profile display with live theme customization — useful for wallet or identity surfaces.",
    src: "",
    tech: ["React", "Framer Motion", "Web3 UI"],
  },
  {
    slug: "otp-verify",
    title1: "OTP",
    title2: "Verify",
    type: "component",
    featured: false,
    year: 2025,
    summary:
      "A verification code input with animated number sphere, auto-advance between digits, paste support, and a verified success state.",
    useCase:
      "Auth flow input with tactile digit transitions and clear success feedback.",
    src: "",
    tech: ["React", "Framer Motion", "Auth UI"],
  },
  {
    slug: "wallet-balance",
    title1: "Wallet",
    title2: "Balance",
    type: "component",
    featured: false,
    year: 2025,
    summary:
      "A crypto wallet balance card with stacked coin avatars, animated swap/send actions, and a green profit display.",
    useCase:
      "Wallet dashboard widget showing holdings, quick actions, and P&L at a glance.",
    src: "",
    tech: ["React", "Framer Motion", "Web3 UI"],
  },
  {
    slug: "batch-tx-approver",
    title1: "Batch Tx",
    title2: "Approver",
    type: "component",
    featured: false,
    year: 2025,
    summary:
      "An accordion list of pending transactions with expandable details, hover lift, and staggered checkmark approval animation.",
    useCase:
      "Multi-transaction approval UI for Web3 apps — review, expand, and approve in batch.",
    src: "",
    tech: ["React", "Framer Motion", "Web3 UI"],
  },
  {
    slug: "progress-stake-card",
    title1: "Progress",
    title2: "Stake",
    type: "component",
    featured: false,
    year: 2025,
    summary:
      "A staking dashboard card with animated progress bar, counting-up yield estimate, and a hover-reveal unstake section.",
    useCase:
      "DeFi staking widget with animated yield projection and secondary action reveal on hover.",
    src: "",
    tech: ["React", "Framer Motion", "Web3 UI"],
  },
  {
    slug: "shimmer-tx-loader",
    title1: "Shimmer",
    title2: "Loader",
    type: "component",
    featured: false,
    year: 2025,
    summary:
      "A transaction loading indicator with gradient shimmer wave animation, cycling through Pending, Confirming, and Confirmed states.",
    useCase:
      "Transaction status feedback with shimmer loading and checkmark bloom on confirmation.",
    src: "",
    tech: ["React", "Framer Motion", "Web3 UI"],
  },
  {
    slug: "animated-timer",
    title1: "Animated",
    title2: "Timer",
    type: "component",
    featured: false,
    year: 2025,
    summary:
      "An animated digital clock with spring-based digit transitions and interactive hover effects.",
    useCase:
      "Live clock display with per-digit spring animations — good for dashboards or session timers.",
    src: "",
    tech: ["React", "Framer Motion"],
  },
  {
    slug: "animated-button",
    title1: "Animated",
    title2: "Button",
    type: "component",
    featured: false,
    year: 2025,
    summary:
      "A button with smooth press and hover animations using Framer Motion.",
    useCase:
      "Primary action button with scale feedback on press and hover — a baseline motion primitive.",
    src: "",
    tech: ["React", "Framer Motion"],
  },
];

export function getFeaturedProjects() {
  return projects.filter((project) => project.featured);
}

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function sortProjects(items: Project[]) {
  return [...items].sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    return b.year - a.year;
  });
}
