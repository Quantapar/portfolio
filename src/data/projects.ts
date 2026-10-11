export type ProjectType = "product" | "component";

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
    /** Pixel size of `src`, so its space is reserved before it loads. */
    srcSize?: { width: number; height: number };
    hero?: string;
    videoSrc?: string;
    archiveNote?: string;
    liveUrl?: string;
    sourceUrl?: string;
    contributionUrl?: string;
    featureUrl?: string;
    /** The post on X where this was first shared. */
    postUrl?: string;
    tech?: string[];
    status?: string;
};

export const projects: Project[] = [
    {
        slug: "neatlogs",
        title1: "Neatlogs",
        title2: "",
        type: "product",
        featured: true,
        year: 2026,
        summary: "The responsive product site I designed and developed for Neatlogs during my design engineering internship.",
        useCase: "A polished launch experience that turns an observability workflow into a clear visual story, with responsive layouts, reusable UI, and considered interaction details.",
        src: "/work/neatlogs.jpg",
        srcSize: { width: 1250, height: 720 },
        videoSrc: "/work/neatlogs.mp4",
        archiveNote: "This recording preserves the version I designed and shipped during my internship, before later changes to neatlogs.com.",
        featureUrl: "https://vibrant.design/website/l4accpy-neatlogs-com",
        tech: ["React", "TypeScript", "Tailwind CSS", "UI/UX"]
    },
    {
        slug: "gooey-text",
        title1: "Gooey",
        title2: "Text",
        type: "component",
        featured: true,
        year: 2025,
        summary: "Type any letter and watch it melt into a gooey blob. SVG filters and Framer Motion drive the morph effect.",
        useCase: "Keyboard-driven morph animation where circles flow along each glyph's skeleton and fuse into one liquid shape.",
        src: "/work/gooey-text.png",
        liveUrl: "https://gooey-text.quantapar.com/",
        sourceUrl: "https://github.com/Quantapar/Gooey-Text",
        postUrl: "https://x.com/quantapar/status/2068122566859149516",
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
        src: "/work/screenshot-studio.jpg",
        srcSize: { width: 1600, height: 988 },
        liveUrl: "https://www.screenshot-studio.com/landing",
        sourceUrl: "https://github.com/KartikLabhshetwar/screenshot-studio",
        contributionUrl: "https://github.com/KartikLabhshetwar/screenshot-studio/commit/0740e087968b82580bff0005fd4dc464d1553775",
        tech: ["Next.js", "TypeScript", "Tailwind CSS", "Motion"]
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
        src: "/work/jagruk-jaipur.jpg",
        srcSize: { width: 1600, height: 1000 },
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
        src: "/work/dashboard.png",
        srcSize: { width: 1600, height: 1000 },
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
        src: "/work/100xdevs.jpg",
        srcSize: { width: 1600, height: 998 },
        liveUrl: "https://100xdevs.quantapar.com/",
        sourceUrl: "https://github.com/Quantapar/100xDevs-Frontend",
        tech: ["React", "Tailwind CSS", "Framer Motion"]
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
        srcSize: { width: 1024, height: 566 },
        liveUrl: "https://krane-apps-github-style-website.vercel.app/",
        sourceUrl: "https://github.com/bluntbrain/krane-apps-github-style-website",
        tech: ["React", "UI Design", "Open Source"]
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
        slug: "dithered-404",
        title1: "Dithered",
        title2: "404",
        type: "component",
        featured: false,
        year: 2025,
        summary: "An interactive dithered 404. Particle dots dissolve under the cursor and ripple on click. Ported from Torchbase.",
        useCase: "Branded empty state with motion personality: “This page went up in smoke.”",
        src: "",
        postUrl: "https://x.com/quantapar/status/2077822493302329806",
        tech: ["React", "Canvas", "Dithering"]
    }, {
        slug: "torchbase-landing",
        title1: "Torchbase",
        title2: "Landing",
        type: "component",
        featured: false,
        year: 2025,
        summary: "A warm, high-contrast product landing page for an AI reliability workspace.",
        useCase: "Product marketing screen with bold hero typography and clear navigation, rebuilt here from the page's own code.",
        src: "/work/torchbase-landing.png",
        srcSize: { width: 1440, height: 900 },
        postUrl: "https://x.com/quantapar/status/2077693670493769794",
        tech: ["React", "TypeScript", "Tailwind CSS", "Motion"]
    },
    {
        slug: "iss-anatomy",
        title1: "ISS",
        title2: "Anatomy",
        type: "component",
        featured: false,
        year: 2026,
        summary: "An interactive drawing of the International Space Station in isometric SVG: it turns, pulls apart into its modules, and sends its crew ship on a fly-around.",
        useCase: "A study in making a large, intricate machine readable. Drag to turn the station, tap to separate its elements, hover one to pick it out, and tap the crew ship to watch it undock and circle.",
        src: "/work/experiments/iss-anatomy.jpg",
        videoSrc: "/work/experiments/iss-anatomy.mp4",
        tech: ["React", "TypeScript", "SVG"]
    },
    {
        slug: "camera-anatomy",
        title1: "Camera",
        title2: "Anatomy",
        type: "component",
        featured: false,
        year: 2026,
        summary: "An interactive exploded view of a single-lens reflex camera, drawn as an isometric SVG that turns, comes apart and fires its shutter.",
        useCase: "A study in explaining a mechanism by letting people handle it: drag to turn the camera, tap to take it apart, and press the shutter release to watch the mirror, curtains and wind lever run.",
        src: "/work/experiments/camera-anatomy.jpg",
        videoSrc: "/work/experiments/camera-anatomy.mp4",
        tech: ["React", "TypeScript", "SVG"]
    },
    {
        slug: "skeuomorphic-controls",
        title1: "Skeuomorphic",
        title2: "Controls",
        type: "component",
        featured: false,
        year: 2026,
        summary: "A row of skeuomorphic media keys: a latching power key plus play, pause and stop, each with a pressed state and a synthesised click.",
        useCase: "A study in tactile, hardware-like controls. The keycaps, tray and cast shadows are layered gradients and shadows, with Motion handling the press.",
        src: "",
        postUrl: "https://x.com/quantapar/status/2107981350540280266",
        tech: ["React", "TypeScript", "Tailwind CSS", "Motion"]
    },
    {
        slug: "gooey-button",
        title1: "Gooey",
        title2: "Button",
        type: "component",
        featured: false,
        year: 2026,
        summary: "A toggle whose label melts between OFF and ON while a liquid fill floods the button, drawn with an SVG gooey filter.",
        useCase: "An interaction experiment in making a state change feel physical, with the letters and the fill moving as one material.",
        src: "",
        postUrl: "https://x.com/quantapar/status/2106481012205351264",
        tech: ["React", "TypeScript", "SVG filters", "Motion"]
    },
    {
        slug: "gooey-toggle",
        title1: "Gooey",
        title2: "Toggle",
        type: "component",
        featured: false,
        year: 2026,
        summary: "A switch whose dark fill floods the track as a gooey liquid while the knob springs across.",
        useCase: "A small study in giving an on/off control some weight, built from SVG circles under a gooey filter.",
        src: "",
        postUrl: "https://x.com/quantapar/status/2106148793901289662",
        tech: ["React", "TypeScript", "SVG filters", "Motion"]
    },
    {
        slug: "fast-and-easy-cards",
        title1: "Fast & Easy",
        title2: "Cards",
        type: "component",
        featured: false,
        year: 2026,
        summary: "Three how-it-works cards, each with its own small animated scene: a plan picker, an updates feed and an approval folder.",
        useCase: "A marketing section where every step explains itself through motion instead of a static illustration.",
        src: "",
        postUrl: "https://x.com/quantapar/status/2105668385317294275",
        tech: ["React", "TypeScript", "CSS", "Motion"]
    },
    {
        slug: "toaster",
        title1: "Toaster",
        title2: "",
        type: "component",
        featured: false,
        year: 2026,
        summary: "A skeuomorphic toaster that pops up a toast message on hover or focus, with a lever, a timer dial and a soft floor shadow.",
        useCase: "A playful take on the toast notification, drawn entirely in CSS with Motion driving the pop.",
        src: "",
        postUrl: "https://x.com/quantapar/status/2088754683750084634",
        tech: ["React", "TypeScript", "CSS", "Motion"]
    },
    {
        slug: "that-button",
        title1: "That",
        title2: "Button",
        type: "component",
        featured: false,
        year: 2026,
        summary: "A reject button with a pressed, tactile response.",
        useCase: "An interface experiment first shared on X.",
        src: "",
        postUrl: "https://x.com/quantapar/status/2106370001347486199",
        tech: ["React", "TypeScript", "CSS", "Motion"]
    },
    {
        slug: "faq-in-motion",
        title1: "FAQ",
        title2: "in Motion",
        type: "component",
        featured: false,
        year: 2026,
        summary: "An FAQ panel whose answers open with motion, with a question box that streams a reply.",
        useCase: "An interface experiment first shared on X.",
        src: "",
        postUrl: "https://x.com/quantapar/status/2106110424676802947",
        tech: ["React", "TypeScript", "CSS", "Motion"]
    },
    {
        slug: "radial-toolkit",
        title1: "Radial",
        title2: "Toolkit",
        type: "component",
        featured: false,
        year: 2026,
        summary: "A radial tool menu in the spirit of a design tool, with tools arranged around a centre ring.",
        useCase: "An interface experiment first shared on X.",
        src: "",
        postUrl: "https://x.com/quantapar/status/2105417315898757443",
        tech: ["React", "TypeScript", "CSS", "Motion"]
    },
    {
        slug: "signature-animation",
        title1: "Signature",
        title2: "Animation",
        type: "component",
        featured: false,
        year: 2026,
        summary: "A sign-here card that draws a signature and moves through idle, signing and complete states.",
        useCase: "An interface experiment first shared on X.",
        src: "",
        postUrl: "https://x.com/quantapar/status/2104968968671047843",
        tech: ["React", "TypeScript", "CSS", "Motion"]
    },
    {
        slug: "skeuomorphic-toggle",
        title1: "Skeuomorphic",
        title2: "Toggle",
        type: "component",
        featured: false,
        year: 2026,
        summary: "A tactile light and dark switch with a gripped thumb and a click sound.",
        useCase: "An interface experiment first shared on X.",
        src: "",
        postUrl: "https://x.com/quantapar/status/2088296066685042855",
        tech: ["React", "TypeScript", "CSS", "Motion"]
    },
    {
        slug: "card-layouts",
        title1: "Card",
        title2: "Layouts",
        type: "component",
        featured: false,
        year: 2026,
        summary: "An editorial section of article cards in mixed shapes.",
        useCase: "An interface experiment first shared on X.",
        src: "",
        postUrl: "https://x.com/quantapar/status/2105803356245729347",
        tech: ["React", "TypeScript", "CSS", "Motion"]
    },
    {
        slug: "bento-features",
        title1: "Bento",
        title2: "Features",
        type: "component",
        featured: false,
        year: 2026,
        summary: "A product features bento with a live chart, integrations and a shortcut tile.",
        useCase: "An interface experiment first shared on X.",
        src: "",
        postUrl: "https://x.com/quantapar/status/2105748267082650008",
        tech: ["React", "TypeScript", "CSS", "Motion"]
    },
    {
        slug: "scroll-text-reveal",
        title1: "Scroll Text",
        title2: "Reveal",
        type: "component",
        featured: false,
        year: 2026,
        summary: "A paragraph that brightens letter by letter as you scroll.",
        useCase: "An interface experiment first shared on X.",
        src: "",
        postUrl: "https://x.com/quantapar/status/2077288953015910708",
        tech: ["React", "TypeScript", "Tailwind CSS", "Motion"]
    },
];

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
