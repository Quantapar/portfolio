import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { tweetLinks, type Tweet } from "../src/data/tweets.ts";

const PUBLIC_DIR = "public";
/** Read by src/data/work.ts. Rebuilt on every run, so it is not committed. */
const OUTPUT_FILE = "src/data/tweets.generated.json";
const ENDPOINT = "https://cdn.syndication.twimg.com/tweet-result";
/** Where post videos and their still frames are kept, inside the public folder. */
const MEDIA_DIR = "work/experiments";

type RawMedia = {
    type: "photo" | "video" | "animated_gif";
    media_url_https: string;
    ext_alt_text?: string;
    video_info?: {
        variants: Array<{ content_type: string; url: string; bitrate?: number }>;
    };
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

/** The smallest MP4 X offers: thumbnails are tiny, so the lightest file is the right one. */
function smallestVideoUrl(raw: RawTweet) {
    const variants = raw.mediaDetails?.[0]?.video_info?.variants ?? [];

    return variants
        .filter((variant) => variant.content_type === "video/mp4")
        .sort((a, b) => (a.bitrate ?? 0) - (b.bitrate ?? 0))[0]?.url;
}

/**
 * X refuses to serve its videos to other sites, so each one is saved next to the site's own files.
 * Returns the public path, or undefined when there is no video or it could not be fetched.
 */
async function localVideo(raw: RawTweet, publicDir: string) {
    const url = smallestVideoUrl(raw);
    if (!url) return undefined;

    return saveMedia(url, `${raw.id_str}.mp4`, publicDir);
}

/**
 * Keeps a copy of a post's file beside the site's own, and returns its public path.
 * A file already there is left alone, so a hand-trimmed copy is never overwritten.
 */
async function saveMedia(url: string, fileName: string, publicDir: string) {
    const file = path.join(publicDir, MEDIA_DIR, fileName);

    if (!existsSync(file)) {
        const response = await fetch(url, { signal: AbortSignal.timeout(60_000) });
        if (!response.ok) throw new Error(`file responded with ${response.status}`);

        await mkdir(path.dirname(file), { recursive: true });
        await writeFile(file, Buffer.from(await response.arrayBuffer()));
    }

    return `/${MEDIA_DIR}/${fileName}`;
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

async function fetchTweet(
    id: string,
    publicDir: string,
    warn: (message: string) => void,
): Promise<Tweet> {
    const url = `${ENDPOINT}?id=${id}&lang=en&token=${tweetToken(id)}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });

    if (!response.ok) {
        throw new Error(`X responded with ${response.status}`);
    }

    const raw = (await response.json()) as RawTweet;

    if (raw.__typename !== "Tweet") {
        throw new Error("post is deleted or not public");
    }

    const tweet = toTweet(raw);

    if (tweet.media) {
        // The still frame is saved too, so thumbnails don't depend on X staying reachable.
        const extension = path.extname(new URL(tweet.media.src).pathname) || ".jpg";
        tweet.media.src = await saveMedia(
            tweet.media.src,
            `${id}${extension}`,
            publicDir,
        ).catch(() => tweet.media!.src);

        // A missing video only costs the motion: the thumbnail still shows the poster.
        tweet.media.video = await localVideo(raw, publicDir).catch((error) => {
            const reason = error instanceof Error ? error.message : String(error);
            warn(`No video saved for post ${id}: ${reason}.`);
            return undefined;
        });
    }

    return tweet;
}

async function fetchTweets(publicDir: string, warn: (message: string) => void) {
    const results = await Promise.all(
        tweetLinks.map(async (link) => {
            const id = tweetId(link);

            if (!id) {
                warn(`Skipping "${link}": not a post link.`);
                return null;
            }

            try {
                // One retry covers a dropped connection without slowing the build much.
                return await fetchTweet(id, publicDir, warn).catch(() =>
                    fetchTweet(id, publicDir, warn),
                );
            } catch (error) {
                const reason = error instanceof Error ? error.message : String(error);
                warn(`Skipping post ${id}: ${reason}.`);
                return null;
            }
        }),
    );

    return results.filter((tweet) => tweet !== null);
}

/** Resolves the links in src/data/tweets.ts into OUTPUT_FILE. Runs before dev start and build. */
const tweets = await fetchTweets(PUBLIC_DIR, (message) => console.warn(`[tweets] ${message}`));

await writeFile(OUTPUT_FILE, `${JSON.stringify(tweets, null, 2)}\n`);
console.log(`[tweets] ${tweets.length} of ${tweetLinks.length} posts saved to ${OUTPUT_FILE}.`);
