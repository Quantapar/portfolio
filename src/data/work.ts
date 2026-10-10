import { tweets } from "virtual:tweets";
import { getProjectsByType, projects, type Project } from "./projects";

/** One thumbnail in a work grid. */
export type WorkItem = {
    key: string;
    title: string;
    image: string;
    /** A looping clip that plays in place of the image. */
    video?: string;
    /** A path on this site, or a full URL that opens in a new tab. */
    to: string;
};

function projectTitle(project: Project) {
    return `${project.title1} ${project.title2}`.trim();
}

function toItem(project: Project): WorkItem {
    return {
        key: project.slug,
        title: projectTitle(project),
        image: project.src,
        to: `/work/${project.slug}`,
    };
}

// Posts whose component is rebuilt here open that live page instead of the post.
const liveByPostId = new Map(
    projects.flatMap((project) => {
        const id = project.postUrl?.match(/status\/(\d+)/)?.[1];
        return id ? [[id, project] as const] : [];
    }),
);

/** Work shared on X, in the order set in tweets.ts. */
export const experimentItems: WorkItem[] = tweets.flatMap((tweet) => {
    if (!tweet.media) return [];

    const live = liveByPostId.get(tweet.id);

    return [
        {
            key: tweet.id,
            title: live ? projectTitle(live) : tweet.text.split("\n")[0],
            image: tweet.media.src,
            video: tweet.media.video,
            to: live ? `/work/${live.slug}` : tweet.url,
        },
    ];
});

/** The six posts shown on the home page, in display order. All are videos, so the grid moves. */
const HOME_POST_IDS = [
    "2068122566859149516", // gooey letter morph
    "2107981350540280266", // skeuomorphic controls
    "2106481012205351264", // gooey interaction
    "2106148793901289662", // lil gooey toggle
    "2105668385317294275", // cards with motion
    "2088754683750084634", // toast
];

export const homeItems = HOME_POST_IDS.flatMap(
    (id) => experimentItems.find((item) => item.key === id) ?? [],
);

export const projectItems = getProjectsByType("product").map(toItem);
