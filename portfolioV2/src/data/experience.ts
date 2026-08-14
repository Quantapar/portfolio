export type Experience = {
    company: string;
    roleType?: string;
    period: {
        start: string;
        end: string;
    };
    bullets: Array<
        | string
        | {
            before: string;
            link: {
                label: string;
                href: string;
            };
            after: string;
        }
    >;
    tags: string[];
    logo: {
        src?: string;
        label: string;
        color?: string;
        className?: string;
    };
};

export const experience: Experience[] = [
    {
        company: "Freelance",
        roleType: "Design Engineer",
        period: {
            start: "Jun 2026",
            end: "Present"
        },
        bullets: [
            {
                before: "Redesigned and rebuilt the core product experience for ",
                link: {
                    label: "Screenshot Studio",
                    href: "https://www.screenshot-studio.com/landing"
                },
                after: ", a free, open-source screenshot editor."
            },
            "Delivered responsive improvements across the marketing site, editor workspace, canvas states, export controls, and animation timeline."
        ],
        tags: [
            "Next.js", "TypeScript", "Tailwind CSS", "Motion"
        ],
        logo: {
            src: "/logos/freelance.jpg",
            label: "Freelance"
        }
    },
    {
        company: "Neatlogs",
        roleType: "Design Engineer Intern",
        period: {
            start: "Apr 2026",
            end: "June 2026"
        },
        bullets: [
            {
                before: "Designed and developed the responsive landing page for ",
                link: {
                    label: "Neatlogs",
                    href: "https://neatlogs.com/"
                },
                after: ", focusing on a clear responsive layout, visual consistency, and polished interactions."
            },
            "Collaborated across design and engineering to translate product requirements into reusable, production-ready frontend components."
        ],
        tags: [
            "React", "TypeScript", "Tailwind CSS", "UI/UX"
        ],
        logo: {
            src: "/logos/neatlogs.png",
            label: "Neatlogs"
        }
    }, {
        company: "Krane Apps",
        roleType: "Design Engineer Intern",
        period: {
            start: "Oct 2025",
            end: "Apr 2026"
        },
        bullets: [
            {
                before: "Designed and developed a website revamp for ",
                link: {
                    label: "Krane Apps",
                    href: "https://krane-apps-github-style-website.vercel.app/"
                },
                after: ", creating a cleaner product experience with responsive layouts and consistent interface patterns."
            },
            "Contributed to product design, prototyping, component development, and the implementation of interactive user experiences."
        ],
        tags: [
            "React", "TypeScript", "Prototyping", "Motion"
        ],
        logo: {
            src: "/logos/krane-apps.png",
            label: "Krane Apps",
            className: "size-12"
        }
    },
];
