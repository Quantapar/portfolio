export type ProjectType = "product" | "component" | "mobile";

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
    contributionUrl?: string;
    tech?: string[];
    status?: string;
};

export const PROJECT_TYPE_LABELS: Record < ProjectType,
    string > = {
        product: "Product",
        component: "Component",
        mobile: "Mobile"
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
        summary: "A Web3 component library and UI marketplace. Production-ready React components for wallets, tokens, chains, and transactions.",
        useCase: "Copy, paste, and ship Web3 UI without rebuilding wallet flows, token displays, and transaction states from scratch.",
        src: "/work/onchain-ui.png",
        liveUrl: "https://onchainui.quantapar.com/",
        sourceUrl: "https://github.com/Quantapar/OnChainUI",
        tech: ["React", "TypeScript", "Tailwind CSS", "npm"]
    },
    {
        slug: "gooey-text",
        title1: "Gooey",
        title2: "Text",
        type: "product",
        featured: true,
        year: 2025,
        summary: "Type any letter and watch it melt into a gooey blob. SVG filters and Framer Motion drive the morph effect.",
        useCase: "Keyboard-driven morph animation where circles flow along each glyph's skeleton and fuse into one liquid shape.",
        src: "/work/gooey-text.png",
        liveUrl: "https://gooey-text.quantapar.com/",
        sourceUrl: "https://github.com/Quantapar/Gooey-Text",
        tech: ["React", "TypeScript", "Framer Motion", "SVG Filters"]
    },
    {
        slug: "screenshot-studio",
        title1: "Screenshot",
        title2: "Studio",
        type: "product",
        featured: true,
        year: 2026,
        status: "OSS contribution",
        summary: "A comprehensive redesign of a free, open-source screenshot editor, spanning its marketing experience and core browser-based workspace.",
        useCase: "Refreshed responsive landing pages, editor navigation, canvas states, export controls, and the animation timeline to make a feature-rich creative tool feel clearer and more cohesive.",
        src: "/work/screenshot-studio.png",
        liveUrl: "https://www.screenshot-studio.com/landing",
        sourceUrl: "https://github.com/KartikLabhshetwar/screenshot-studio",
        contributionUrl: "https://github.com/KartikLabhshetwar/screenshot-studio/commit/0740e087968b82580bff0005fd4dc464d1553775",
        tech: ["Next.js", "TypeScript", "Tailwind CSS", "Motion"]
    },
    {
        slug: "pulse-api",
        title1: "Pulse",
        title2: "API",
        type: "product",
        featured: false,
        year: 2025,
        summary: "A real-time API monitoring dashboard. Track endpoint uptime, response times, and system health with a responsive frosted-glass UI.",
        useCase: "Add an endpoint, set a check interval, and get email alerts the moment something goes down, plus shareable public status pages.",
        src: "/work/pulse-api.png",
        liveUrl: "https://pulseapi.quantapar.com/",
        sourceUrl: "https://github.com/Quantapar/PulseApi",
        tech: [
            "Bun",
            "TypeScript",
            "React",
            "Postgres",
            "Prisma"
        ]
    },
    {
        slug: "jagruk-jaipur",
        title1: "Jagruk",
        title2: "Jaipur",
        type: "product",
        featured: false,
        year: 2025,
        summary: "A full revamp of Jaipur's event guide. Discover concerts, comedy, food fests, art, and workshops across the city.",
        useCase: "Curated city events in one modern interface, built for locals looking for what's happening this week.",
        src: "/work/jaipur.png",
        liveUrl: "https://jagrukjaipur.quantapar.com/",
        tech: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"]
    }, {
        slug: "dashboard-ui",
        title1: "Dashboard",
        title2: "UI",
        type: "product",
        featured: false,
        year: 2025,
        summary: "A SaaS analytics dashboard built as an assignment. KPI cards with sparklines, filterable order tables, and a collapsible sidebar.",
        useCase: "Dark analytics interface with sortable columns, status tabs, and metric cards for operational monitoring.",
        src: "/work/dashboard-ui.png",
        liveUrl: "https://dashboard-ui.quantapar.com/",
        sourceUrl: "https://github.com/Quantapar/dashboard-ui",
        tech: ["React", "TypeScript", "Tailwind CSS"]
    }, {
        slug: "100xdevs",
        title1: "100xDevs",
        title2: "Frontend",
        type: "product",
        featured: true,
        year: 2025,
        summary: "A complete frontend revamp for the 100xDevs platform. Immersive web animations, modern UI components, and a robust design system.",
        useCase: "Platform refresh with motion-led interactions and a cohesive component library for developer education.",
        src: "/work/100xDevsFrontend.png",
        liveUrl: "https://100xdevs.quantapar.com/",
        sourceUrl: "https://github.com/Quantapar/100xDevs-Frontend",
        tech: ["React", "Tailwind CSS", "Framer Motion"]
    }, {
        slug: "cypher",
        title1: "Cypher",
        title2: "Arena",
        type: "product",
        featured: false,
        year: 2025,
        summary: "A full-stack contest hosting platform. Role-based access, real-time code submissions, and live leaderboards.",
        useCase: "Scalable contest infrastructure for coding competitions with live ranking and submission workflows.",
        src: "/work/Cypher.png",
        liveUrl: "https://cypherarena.quantapar.com/",
        sourceUrl: "https://github.com/Quantapar/contest-platform",
        tech: [
            "React",
            "Bun",
            "Postgres",
            "Prisma",
            "Docker"
        ]
    }, {
        slug: "morn-morn",
        title1: "Morn",
        title2: "Morn",
        type: "mobile",
        featured: false,
        year: 2025,
        summary: "Bet on yourself, not prediction markets. A Solana Mobile habit app where morning tasks are backed by a small $SOL or $SKR stake.",
        useCase: "Finish the task, stake returns. Miss it, your stake rewards people who actually showed up. Accountability with skin in the game.",
        src: "/work/morn-morn.png",
        tech: [
            "Expo",
            "React Native",
            "Reanimated",
            "Solana",
            "NativeWind"
        ]
    }, {
        slug: "krane-apps-revamp",
        title1: "Krane Apps",
        title2: "Revamp",
        type: "product",
        featured: false,
        year: 2025,
        summary: "Full UI revamp of the Krane Apps website with a GitHub-style design. Rebuilt for a cleaner, more professional look.",
        useCase: "Open-source contribution. GitHub-inspired layout and component patterns for a developer tools company site.",
        src: "/work/krane-apps.png",
        liveUrl: "https://krane-apps-github-style-website.vercel.app/",
        sourceUrl: "https://github.com/bluntbrain/krane-apps-github-style-website",
        tech: ["React", "UI Design", "Open Source"]
    }, {
        slug: "torchbase-landing",
        title1: "Torchbase",
        title2: "Landing",
        type: "product",
        featured: false,
        year: 2025,
        summary: "A warm, high-contrast product landing page for an AI reliability workspace.",
        useCase: "Product marketing screen with bold hero typography and clear navigation, shared as a design study on X.",
        src: "/work/torchbase-landing.png",
        tech: ["Landing page", "Product design"]
    }, {
        slug: "floating-toolbar",
        title1: "Floating",
        title2: "Toolbar",
        type: "component",
        featured: false,
        year: 2025,
        summary: "A dock-style floating navigation bar with spring-animated hover highlights, directional tooltips, and an active indicator dot.",
        useCase: "Compact navigation for dashboards or portfolios. Hover reveals labels with spring physics and active state tracking.",
        src: "",
        tech: ["React", "Framer Motion", "Navigation"]
    }, {
        slug: "address-card",
        title1: "Address",
        title2: "Card",
        type: "component",
        featured: false,
        year: 2025,
        summary: "A customizable profile card with animated color picker and editable fields.",
        useCase: "Web3 profile display with live theme customization useful for wallet or identity surfaces.",
        src: "",
        tech: ["React", "Framer Motion", "Web3 UI"]
    }, {
        slug: "otp-verify",
        title1: "OTP",
        title2: "Verify",
        type: "component",
        featured: false,
        year: 2025,
        summary: "A verification code input with animated number sphere, auto-advance between digits, paste support, and a verified success state.",
        useCase: "Auth flow input with tactile digit transitions and clear success feedback.",
        src: "",
        tech: ["React", "Framer Motion", "Auth UI"]
    }, {
        slug: "wallet-balance",
        title1: "Wallet",
        title2: "Balance",
        type: "component",
        featured: false,
        year: 2025,
        summary: "A crypto wallet balance card with stacked coin avatars, animated swap/send actions, and a green profit display.",
        useCase: "Wallet dashboard widget showing holdings, quick actions, and P&L at a glance.",
        src: "",
        tech: ["React", "Framer Motion", "Web3 UI"]
    }, {
        slug: "animated-timer",
        title1: "Animated",
        title2: "Timer",
        type: "component",
        featured: false,
        year: 2025,
        summary: "An animated digital clock with spring-based digit transitions and interactive hover effects.",
        useCase: "Live clock display with per-digit spring animations good for dashboards or session timers.",
        src: "",
        tech: ["React", "Framer Motion"]
    }, {
        slug: "dithered-404",
        title1: "Dithered",
        title2: "404",
        type: "component",
        featured: false,
        year: 2025,
        summary: "An interactive dithered 404. Particle dots dissolve under the cursor and ripple on click. Ported from Torchbase.",
        useCase: "Branded empty state with motion personality: “This page went up in smoke.”",
        src: "",
        tech: ["React", "Canvas", "Dithering"]
    },
];

export function getFeaturedProjects() {
    return projects.filter((project) => project.featured);
}

export function getProjectsByType(type : ProjectType) {
    return sortProjects(projects.filter((project) => project.type === type));
}

export function getProjectBySlug(slug : string) {
    return projects.find((project) => project.slug === slug);
}

export function sortProjects(items : Project[]) {
    return [... items].sort((a, b) => {
        if (a.featured !== b.featured) {
            return a.featured ? -1 : 1;
        }
        return b.year - a.year;
    });
}
