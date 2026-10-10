export type Experience = {
    company: string;
    role: string;
    period: {
        start: string;
        end: string;
    };
    /** One line on what the work was. */
    summary: string;
    /** A phrase inside the summary to mark as the thing the row links to. */
    highlight?: string;
    /** Where the row leads: the shipped work, or its case study on this site. */
    href: string;
    /** Screenshot of that work, shown beside the row on hover. */
    preview: string;
    logo: ExperienceLogo;
};

/** Background colour of the logo tile. */
export type LogoTone = "blue" | "orange" | "neutral";

export type ExperienceLogo =
    // A stock icon, for work with no brand of its own.
    | { kind: "icon"; icon: "laptop"; tone: LogoTone }
    // A transparent brand mark, drawn in white on the tile.
    | { kind: "mark"; src: string; tone: LogoTone }
    // Artwork that already is a tile, shown edge to edge.
    | { kind: "image"; src: string; tone: LogoTone };

export const experience: Experience[] = [
    {
        company: "Freelance",
        role: "Design Engineer",
        period: {
            start: "Jun 2026",
            end: "Present"
        },
        summary: "Designing and building product interfaces for clients, e.g. Screenshot Studio",
        highlight: "Screenshot Studio",
        href: "https://www.screenshot-studio.com/landing",
        preview: "/work/screenshot-studio.jpg",
        logo: {
            kind: "icon",
            icon: "laptop",
            tone: "blue"
        }
    },
    {
        company: "Neatlogs",
        role: "Design Engineer Intern",
        period: {
            start: "Apr 2026",
            end: "Jun 2026"
        },
        summary: "Designed and built the product site, reusable UI components and interactions",
        highlight: "product site",
        href: "/work/neatlogs",
        preview: "/work/neatlogs.jpg",
        logo: {
            kind: "image",
            src: "/logos/neatlogs.png",
            tone: "neutral"
        }
    },
    {
        company: "Krane Apps",
        role: "Design Engineer Intern",
        period: {
            start: "Oct 2025",
            end: "Apr 2026"
        },
        summary: "Product design, prototyping and interactive components, plus the website revamp",
        highlight: "website revamp",
        href: "https://krane-apps-github-style-website.vercel.app/",
        preview: "/work/krane-apps.png",
        logo: {
            kind: "mark",
            src: "/logos/krane-apps.png",
            tone: "orange"
        }
    },
];
