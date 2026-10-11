export const USERNAME = "quantapar";
export const EMAIL = "quantapar@gmail.com";
export const SITE_NAME = "Manu Sharma";
export const SITE_DESCRIPTION =
    "Design Engineer building clean, interactive web and mobile UI with React, Tailwind, and Motion.";

export const links = {
    github: `https://github.com/${USERNAME}`,
    linkedin: `https://linkedin.com/in/${USERNAME}`,
    x: `https://x.com/${USERNAME}`,
    mail: `mailto:${EMAIL}`,
    resume: "/resume.pdf",
    cal: `https://cal.com/${USERNAME}/30min`,
} as const;

/** The article behind "Design Engineer" in the intro, as shown on its hover card. */
export const designEngineeringPost = {
    url: "https://vercel.com/blog/design-engineering-at-vercel",
    source: "vercel.com",
    title: "Design Engineering at Vercel",
} as const;

/** Shown on the contact hover cards. Typed in by hand, so refresh them now and then. */
export const profiles = {
    x: { name: "manu", handle: USERNAME, following: 625, followers: 421 },
    linkedin: { headline: "Design Engineer", connections: "500+" },
    cal: {
        handle: USERNAME,
        event: "30 min meeting",
        location: "Google Meet",
    },
} as const;
