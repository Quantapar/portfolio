export type Experience = {
    company: string;
    roleType: string;
    period: {
        start: string;
        end: string;
        location: string;
    };
    bullets: string[];
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
        company: "Neatlogs",
        roleType: "Design Engineer Intern",
        period: {
            start: "Apr 2026",
            end: "May 2026",
            location: "Remote",
        },
        bullets: [
            "Designed and developed responsive product interfaces with an emphasis on usability, visual consistency, and polished interactions.", "Collaborated across design and engineering to translate product requirements into reusable, production-ready frontend components.",
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
            end: "Apr 2026",
            location: "Remote",
        },
        bullets: [
            "Built and refined user-facing interfaces using modern frontend technologies while maintaining responsive layouts and consistent design patterns.", "Contributed to product design, prototyping, component development, and the implementation of interactive user experiences.",
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
