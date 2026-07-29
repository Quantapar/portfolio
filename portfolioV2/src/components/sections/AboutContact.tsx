import { links } from "../../data/site";
import { Highlight } from "../ui/Highlight";
import { ReachOutSuffix } from "../ui/ReachOutLine";
import {
  ContactLink,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  ResumeIcon,
  XIcon,
} from "../ui/ContactLink";

const contactLinks = [
  { href: links.github, label: "GitHub", icon: <GitHubIcon /> },
  { href: links.linkedin, label: "LinkedIn", icon: <LinkedInIcon /> },
  { href: links.x, label: "Twitter", icon: <XIcon /> },
  { href: links.mail, label: "Mail", icon: <MailIcon /> },
  { href: links.resume, label: "Resume", icon: <ResumeIcon /> },
];

export function AboutContact() {
  return (
    <section id="about" className="scroll-mt-20 px-4 py-8 sm:px-6">
      <div className="border-b border-dotted border-border pb-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-medium">About</h2>
          <span className="inline-flex items-center gap-2 border border-dotted border-border px-2 py-0.5 text-xs text-foreground/60">
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-[#26a641]"
            />
            Open to work
          </span>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <img
            src="/avatar.jpg"
            alt=""
            className="size-11 shrink-0 border border-dotted border-border object-cover"
          />
          <div className="min-w-0">
            <p className="font-heading text-base font-medium tracking-tight text-foreground">
              Manu Sharma
            </p>
            <p className="text-sm text-foreground/50">
              aka <span className="italic">quantapar</span>
            </p>
          </div>
        </div>

        <div className="max-w-xl space-y-3 text-pretty text-sm leading-relaxed text-foreground/75">
          <p>
            I&apos;m a{" "}
            <Highlight href="https://vercel.com/blog/design-engineering-at-vercel">
              Design Engineer
            </Highlight>{" "}
            based in India, building clean, interactive web and mobile UI
            components that scale across platforms and users
          </p>
          <p>
            I work with <Highlight>React, Tailwind, and Motion</Highlight>, and
            I&apos;m usually on{" "}
            <a
              href={links.x}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline decoration-dotted decoration-foreground/40 underline-offset-[3px]"
            >
              X / Twitter
            </a>{" "}
            sharing what I&apos;m making
            <ReachOutSuffix />
          </p>
        </div>
      </div>

      <div id="contact" className="scroll-mt-20 pt-8">
        <h2 className="mb-6 text-lg font-medium">Contact</h2>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
          {contactLinks.map((link) => (
            <ContactLink key={link.label} {...link} />
          ))}
        </div>
      </div>
    </section>
  );
}
