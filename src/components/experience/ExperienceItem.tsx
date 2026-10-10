import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Experience } from "../../data/experience";
import { BevelBox } from "../ui/BevelBox";

const easeOut = [0.23, 1, 0.32, 1] as const;

type ExperienceItemProps = {
  item: Experience;
  defaultOpen?: boolean;
};

function ExperiencePeriod({ period }: { period: Experience["period"] }) {
  return (
    <>
      <span className="mt-1 block font-mono text-xs text-foreground/50 sm:hidden">
        {period.start} to {period.end}
      </span>
      <span className="mt-1 hidden font-mono text-xs text-foreground/50 sm:block">
        {period.start} — {period.end}
      </span>
    </>
  );
}

function ExpandIcon({ open }: { open: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  const transition = {
    duration: shouldReduceMotion ? 0.12 : 0.2,
    ease: easeOut,
  };

  return (
    <span className="relative flex size-5 shrink-0 self-center items-center justify-center">
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center text-base font-semibold leading-none text-foreground/65"
        initial={false}
        animate={{
          opacity: open ? 0 : 1,
          scale: open ? 0.92 : 1,
          rotate: open ? -90 : 0,
        }}
        transition={transition}
      >
        +
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center text-base font-semibold leading-none text-foreground/65"
        initial={false}
        animate={{
          opacity: open ? 1 : 0,
          scale: open ? 1 : 0.92,
          rotate: open ? 0 : 90,
        }}
        transition={transition}
      >
        −
      </motion.span>
    </span>
  );
}

export function ExperienceItem({
  item,
  defaultOpen = false,
}: ExperienceItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const shouldReduceMotion = useReducedMotion();

  return (
    <BevelBox>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="pressable flex w-full items-start gap-3 px-3 py-4 text-left sm:px-4"
        aria-expanded={open}
      >
        {item.logo.src ? (
          <img
            src={item.logo.src}
            alt={item.logo.label}
            className={`shrink-0 rounded-sm object-cover ${item.logo.className ?? "size-10"}`}
          />
        ) : (
          <span
            className="flex size-10 shrink-0 items-center justify-center text-xs font-medium text-white"
            style={{ backgroundColor: item.logo.color }}
          >
            {item.logo.label}
          </span>
        )}

        <span className="min-w-0 flex-1">
          <span className="flex flex-col items-start gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
            <span className="text-sm font-medium">{item.company}</span>
            {item.roleType ? (
              <span className="w-fit border border-dotted border-border px-2 py-0.5 text-xs text-foreground/60">
                {item.roleType}
              </span>
            ) : null}
          </span>
          <ExperiencePeriod period={item.period} />
        </span>

        <ExpandIcon open={open} />
      </button>

      <div
        className="grid overflow-hidden transition-[grid-template-rows,opacity] [transition-timing-function:var(--ease-out)]"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
          transitionDuration: shouldReduceMotion
            ? "120ms"
            : open
              ? "220ms"
              : "180ms",
          clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
          transitionProperty: "grid-template-rows, opacity, clip-path",
        }}
        aria-hidden={!open}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-dotted border-border px-3 pb-4 pt-3 sm:px-4">
            <ul
              className="space-y-2 text-pretty text-sm leading-relaxed text-foreground/70 transition-opacity [transition-timing-function:var(--ease-out)]"
              style={{
                opacity: open ? 1 : 0,
                transitionDuration: shouldReduceMotion ? "120ms" : "180ms",
                transitionDelay: open && !shouldReduceMotion ? "40ms" : "0ms",
              }}
            >
              {item.bullets.map((bullet) => (
                <li
                  key={
                    typeof bullet === "string"
                      ? bullet
                      : `${bullet.before}${bullet.link.href}${bullet.after}`
                  }
                  className="flex gap-2"
                >
                  <span aria-hidden="true" className="text-foreground/35">
                    •
                  </span>
                  <span>
                    {typeof bullet === "string" ? (
                      bullet
                    ) : (
                      <>
                        {bullet.before}
                        {bullet.link.href.startsWith("/") ? (
                          <Link
                            to={bullet.link.href}
                            className="link-inline"
                          >
                            {bullet.link.label}
                          </Link>
                        ) : (
                          <a
                            href={bullet.link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="link-inline"
                          >
                            {bullet.link.label}
                          </a>
                        )}
                        {bullet.after}
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <div
              className="mt-4 flex flex-wrap gap-2 transition-opacity [transition-timing-function:var(--ease-out)]"
              style={{
                opacity: open ? 1 : 0,
                transitionDuration: shouldReduceMotion ? "120ms" : "180ms",
                transitionDelay: open && !shouldReduceMotion ? "60ms" : "0ms",
              }}
            >
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-dotted border-border px-2 py-1 text-xs text-foreground/65"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BevelBox>
  );
}
