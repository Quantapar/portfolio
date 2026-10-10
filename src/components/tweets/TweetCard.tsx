import { Heart, MessageCircle } from "lucide-react";
import type { Tweet } from "../../data/tweets";
import { XIcon } from "../ui/ContactLink";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const countFormat = new Intl.NumberFormat("en-US", { notation: "compact" });

type TweetCardProps = {
  tweet: Tweet;
};

export function TweetCard({ tweet }: TweetCardProps) {
  const { author, media } = tweet;
  // Blank lines would eat the clamp, so paragraphs sit on consecutive lines.
  const text = tweet.text.replace(/\n{2,}/g, "\n");

  return (
    <a
      href={tweet.url}
      target="_blank"
      rel="noreferrer"
      draggable={false}
      className="group flex h-full flex-col gap-3 p-4 transition-[background-color] duration-[160ms] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/5 sm:p-5"
    >
      <div className="flex items-center gap-2.5">
        <img
          src={author.avatar}
          alt=""
          loading="lazy"
          draggable={false}
          className="size-9 shrink-0 rounded-sm object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground/85">
            {author.name}
          </p>
          <p className="truncate text-xs text-foreground/50">
            @{author.handle}
          </p>
        </div>
        <span className="shrink-0 text-foreground/40 transition-colors duration-[160ms] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-foreground">
          <XIcon />
        </span>
      </div>

      {media ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden border border-dotted border-border bg-foreground/3 transition-[border-color] duration-[160ms] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:border-foreground/35">
          <img
            src={media.src}
            alt={media.alt}
            loading="lazy"
            draggable={false}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      {text ? (
        <p
          className={`whitespace-pre-line text-sm leading-relaxed text-foreground/75 ${media ? "line-clamp-2" : "line-clamp-[9]"}`}
        >
          {text}
        </p>
      ) : null}

      <div className="mt-auto flex items-center gap-4 pt-1 text-xs tabular-nums text-foreground/50">
        <span className="inline-flex items-center gap-1.5">
          <Heart aria-hidden="true" className="size-3.5" />
          {countFormat.format(tweet.likes)}
          <span className="sr-only">likes</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MessageCircle aria-hidden="true" className="size-3.5" />
          {countFormat.format(tweet.replies)}
          <span className="sr-only">replies</span>
        </span>
        <time dateTime={tweet.createdAt} className="ml-auto">
          {dateFormat.format(new Date(tweet.createdAt))}
        </time>
      </div>
    </a>
  );
}
