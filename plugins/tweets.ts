import type { Plugin } from "vite";
import { tweetLinks, type Tweet } from "../src/data/tweets.ts";

const VIRTUAL_ID = "virtual:tweets";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;
const ENDPOINT = "https://cdn.syndication.twimg.com/tweet-result";

type RawMedia = {
    type: "photo" | "video" | "animated_gif";
    media_url_https: string;
    ext_alt_text?: string;
};

type RawTweet = {
    __typename: string;
    id_str: string;
    text: string;
    created_at: string;
    display_text_range: [number, number];
    favorite_count?: number;
    conversation_count?: number;
    entities?: {
        urls?: Array<{ url: string; display_url: string }>;
    };
    user: {
        name: string;
        screen_name: string;
        profile_image_url_https: string;
    };
    mediaDetails?: RawMedia[];
};

function tweetId(link: string) {
    return link.match(/status\/(\d+)/)?.[1] ?? link.match(/^\d+$/)?.[0] ?? null;
}

// X's embed endpoint expects this token derived from the post id.
function tweetToken(id: string) {
    return ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, "");
}

function tweetText(raw: RawTweet) {
    // display_text_range counts code points and drops the trailing media link.
    const [start, end] = raw.display_text_range;
    let text = Array.from(raw.text).slice(start, end).join("");

    for (const link of raw.entities?.urls ?? []) {
        text = text.replaceAll(link.url, link.display_url);
    }

    return text
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">")
        .replaceAll("&amp;", "&")
        .trim();
}

function tweetMedia(raw: RawTweet): Tweet["media"] {
    const media = raw.mediaDetails?.[0];
    if (!media) return undefined;

    const src = new URL(media.media_url_https);
    src.searchParams.set("name", "small");

    return {
        type: media.type === "photo" ? "photo" : "video",
        src: src.toString(),
        alt: media.ext_alt_text ?? "",
    };
}

function toTweet(raw: RawTweet): Tweet {
    return {
        id: raw.id_str,
        url: `https://x.com/${raw.user.screen_name}/status/${raw.id_str}`,
        text: tweetText(raw),
        createdAt: raw.created_at,
        likes: raw.favorite_count ?? 0,
        replies: raw.conversation_count ?? 0,
        author: {
            name: raw.user.name,
            handle: raw.user.screen_name,
            avatar: raw.user.profile_image_url_https.replace("_normal.", "_x96."),
        },
        media: tweetMedia(raw),
    };
}

async function fetchTweet(id: string): Promise<Tweet> {
    const url = `${ENDPOINT}?id=${id}&lang=en&token=${tweetToken(id)}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });

    if (!response.ok) {
        throw new Error(`X responded with ${response.status}`);
    }

    const raw = (await response.json()) as RawTweet;

    if (raw.__typename !== "Tweet") {
        throw new Error("post is deleted or not public");
    }

    return toTweet(raw);
}

async function fetchTweets(warn: (message: string) => void) {
    const results = await Promise.all(
        tweetLinks.map(async (link) => {
            const id = tweetId(link);

            if (!id) {
                warn(`Skipping "${link}": not a post link.`);
                return null;
            }

            try {
                // One retry covers a dropped connection without slowing the build much.
                return await fetchTweet(id).catch(() => fetchTweet(id));
            } catch (error) {
                const reason = error instanceof Error ? error.message : String(error);
                warn(`Skipping post ${id}: ${reason}.`);
                return null;
            }
        }),
    );

    return results.filter((tweet) => tweet !== null);
}

/** Resolves the links in src/data/tweets.ts into `virtual:tweets` at dev start and build. */
export function tweets(): Plugin {
    let pending: Promise<Tweet[]> | undefined;

    return {
        name: "tweets",
        resolveId(id) {
            return id === VIRTUAL_ID ? RESOLVED_ID : undefined;
        },
        async load(id) {
            if (id !== RESOLVED_ID) return undefined;

            pending ??= fetchTweets((message) => this.warn(message));

            return `export const tweets = ${JSON.stringify(await pending)};`;
        },
    };
}
