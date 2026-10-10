export type Tweet = {
    id: string;
    url: string;
    text: string;
    createdAt: string;
    likes: number;
    replies: number;
    author: {
        name: string;
        handle: string;
        avatar: string;
    };
    media?: {
        type: "photo" | "video";
        /** The photo, or the poster frame of a video. */
        src: string;
        alt: string;
        /** A copy of the post's video served from this site, when it has one. */
        video?: string;
    };
};

// Paste post links here, in the order they should appear.
// Text, media, and counts are pulled from X whenever the site builds.
export const tweetLinks: string[] = [
    "https://x.com/quantapar/status/2068122566859149516",
    "https://x.com/quantapar/status/2107981350540280266",
    "https://x.com/quantapar/status/2106481012205351264",
    "https://x.com/quantapar/status/2106370001347486199",
    "https://x.com/quantapar/status/2106148793901289662",
    "https://x.com/quantapar/status/2106110424676802947",
    "https://x.com/quantapar/status/2105803356245729347",
    "https://x.com/quantapar/status/2105748267082650008",
    "https://x.com/quantapar/status/2105668385317294275",
    "https://x.com/quantapar/status/2105417315898757443",
    "https://x.com/quantapar/status/2104968968671047843",
    "https://x.com/quantapar/status/2088754683750084634",
    "https://x.com/quantapar/status/2088296066685042855",
    "https://x.com/quantapar/status/2077822493302329806",
    "https://x.com/quantapar/status/2077693670493769794",
    "https://x.com/quantapar/status/2077288953015910708",
];
