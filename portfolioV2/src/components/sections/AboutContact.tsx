import { Highlight } from "../ui/Highlight";
import {
  ContactLink,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  ResumeIcon,
  XIcon,
} from "../ui/ContactLink";

const contactLinks = [
  { href: "https://github.com/", label: "GitHub", icon: <GitHubIcon /> },
  { href: "https://linkedin.com/", label: "LinkedIn", icon: <LinkedInIcon /> },
  { href: "https://x.com/", label: "Twitter", icon: <XIcon /> },
  { href: "mailto:hello@example.com", label: "Mail", icon: <MailIcon /> },
  { href: "#", label: "Resume", icon: <ResumeIcon /> },
];

export function AboutContact() {
  return (
    <section className="px-6 py-8">
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
        <ul className="space-y-4 text-sm leading-relaxed text-foreground/75">
          <li>
            I&apos;m Manu a 20 years old <Highlight>Design Engineer</Highlight>{" "}
            based out of India.
            <br />I build clean, interactive web and mobile UI components that
            scale across platforms and users.
          </li>
          <li>
            I design and code user interfaces with{" "}
            <Highlight>React, Tailwind, and Motion</Highlight>, with a focus on
            usability, performance, and the little details that make products
            feel polished.
          </li>
        </ul>
      </div>

      <div className="pt-8">
        <h2 className="mb-6 text-lg font-medium">Contact</h2>
        <div className="flex flex-wrap gap-3">
          {contactLinks.map((link) => (
            <ContactLink key={link.label} {...link} />
          ))}
        </div>
      </div>
    </section>
  );
}
