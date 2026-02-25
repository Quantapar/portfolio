import { useState, useEffect } from "react";
import "./index.css";

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);
const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);
const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);
const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const NameFlip = () => (
  <div className="h-12.5 overflow-hidden inline-flex flex-col relative top-1">
    <div className="animate-flip text-(--text-primary) font-bold text-4xl tracking-tight leading-12.5">
      <span className="block h-12.5">Manu Sharma</span>
      <span className="block h-12.5 text-(--text-muted)">Quantapar</span>
      <span className="block h-12.5">Manu Sharma</span>
    </div>
  </div>
);

const SectionMinimal = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <section className="py-2">
    <h2 className="text-[11px] font-bold tracking-[0.2em] text-(--text-muted) uppercase mb-6 pl-1 transition-colors duration-200 ease-out">
      {title}
    </h2>
    {children}
  </section>
);

const ExperienceRow = ({
  role,
  company,
  duration,
  description,
}: {
  role: string;
  company: React.ReactNode;
  duration: string;
  description?: string;
}) => (
  <div className="group pl-1">
    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
      <div className="flex items-center gap-3">
        <div className="font-medium text-(--text-primary)">
          {company}
        </div>
        <div className="text-xs font-medium text-(--text-secondary) bg-(--bg-tertiary) px-2.5 py-1 rounded-md border border-(--border-color) transition-colors duration-200 ease-out">
          {role}
        </div>
      </div>
      <div className="text-xs text-(--text-muted) font-mono mt-1 sm:mt-0 opacity-60 transition-colors hover:opacity-100 hover:text-(--text-primary) cursor-default">
        {duration}
      </div>
    </div>
    {description && (
      <p className="text-sm text-(--text-secondary) leading-relaxed max-w-2xl transition-colors duration-200 ease-out">
        {description}
      </p>
    )}
  </div>
);

const TechBadge = ({ name }: { name: string; colorClass: string }) => (
  <span className="inline-flex items-center text-[13px] font-medium px-3 py-1.5 rounded-lg bg-(--bg-tertiary) border border-(--border-color) text-(--text-secondary) transition-colors duration-200 ease-out hover:text-(--text-primary) hover:border-(--text-muted) cursor-default">
    <span>{name}</span>
  </span>
);

const ProjectRow = ({
  title,
  description,
  tech,
  githubUrl,
  liveUrl,
}: {
  title: string;
  description: string;
  tech: string[];
  githubUrl: string;
  liveUrl?: string;
}) => (
  <article className="group py-4 border-b border-(--border-color) last:border-0 last:pb-0 first:pt-0 pl-1">
    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
      <h3 className="text-base font-medium text-(--text-primary) mb-1 sm:mb-0">
        <a
          href={liveUrl || githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-(--accent)"
        >
          {title}
        </a>
      </h3>
      <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out">
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 px-2 rounded-md bg-(--bg-primary) border border-(--border-color) text-(--text-muted) hover:text-(--text-primary) transition-colors duration-200 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-color) text-xs flex items-center gap-1"
          >
            <ExternalLinkIcon /> Live
          </a>
        )}
          <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 px-2 rounded-md bg-(--bg-primary) border border-(--border-color) text-(--text-muted) hover:text-(--text-primary) transition-colors duration-200 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-color) text-xs flex items-center gap-1"
        >
          <GitHubIcon /> Code
        </a>
      </div>
    </div>
    <p className="text-sm text-(--text-secondary) mb-3 leading-relaxed max-w-2xl">
      {description}
    </p>
    <div className="flex flex-wrap gap-2">
      {tech.map((t) => (
        <span
          key={t}
          className="text-[10px] text-(--text-muted) font-mono tracking-tight bg-(--bg-primary) px-1.5 py-0.5 rounded border border-(--border-color) bg-opacity-50 transition-colors duration-200 ease-out"
        >
          {t}
        </span>
      ))}
    </div>
  </article>
);

const AboutSection = () => (
  <SectionMinimal title="About Me">
    <div className="flex flex-col md:flex-row gap-8 items-start pl-1">
      <div className="relative group w-32 h-32 shrink-0 overflow-hidden rounded-xl border border-(--border-color) hover:border-(--text-muted) transition-colors duration-200 ease-out shadow-sm hover:shadow-md bg-(--bg-tertiary)">
        <img
          src="/me-color.jpeg"
          alt="Manu Sharma Color"
          width={128}
          height={128}
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out z-10"
        />
        <img
          src="/me-bw.jpeg"
          alt="Manu Sharma B&W"
          width={128}
          height={128}
          className="w-full h-full object-cover transition-transform duration-300 ease-out scale-100 group-hover:scale-[1.03]"
        />
      </div>
      <div>
        <h3 className="text-lg font-medium text-(--text-primary) mb-1">
          Manu Sharma
        </h3>
        <div className="flex items-center gap-1.5 text-[13px] text-(--text-highlight) font-medium mb-4">
          <span>20</span>
          <span className="opacity-40">•</span>
          <div className="h-4.5 overflow-hidden inline-flex flex-col relative top-[0.5px]">
            <div className="animate-flip leading-4.5">
              <span className="block h-4.5">Fullstack Engineer</span>
              <span className="block h-4.5">Freelancer</span>
              <span className="block h-4.5">Fullstack Engineer</span>
            </div>
          </div>
        </div>
        <p className="text-(--text-secondary) text-[15px] leading-relaxed mb-4 max-w-lg">
          I'm a Full Stack web developer. I love building products to solve
          real-world problems and creates MVPs efficiently.
        </p>
      </div>
    </div>
  </SectionMinimal>
);

export function App() {
  const [isDark, setIsDark] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("quantapar@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (stored === "light" || (!stored && !prefersDark)) {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = (event: React.MouseEvent) => {
    const isSwitchingToDark = !isDark;

    const toggle = () => {
      setIsDark(isSwitchingToDark);
      if (isSwitchingToDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    };

    if (!("startViewTransition" in document)) {
      toggle();
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = (document as any).startViewTransition(toggle);

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: "ease-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  const projects = [
    {
      title: "Cypher",
      description:
        "A full-stack contest hosting platform. Built for scalability with role-based access, real-time code submissions, and live leaderboards.",
      tech: ["React", "Bun", "Postgres", "Prisma", "Docker"],
      githubUrl: "https://github.com/Quantapar/contest-platform",
      liveUrl: "https://cypherarena.vercel.app/",
    },
    {
      title: "Mayhem",
      description:
        "Experimental landing page design. Focusing on micro-interactions, smooth scrolling, and cinematic typography.",
      tech: ["HTML", "Tailwind", "Motion"],
      githubUrl: "https://github.com/Quantapar/Tailwind/tree/main/tailwind01",
      liveUrl: "https://joinmayhem.vercel.app/",
    },
    {
      title: "Contact Manager",
      description:
        "Robust REST API design pattern demonstration. Features protected routes, input validation, and secure JWT handling.",
      tech: ["Node.js", "Express", "MongoDB", "Zod"],
      githubUrl: "https://github.com/Quantapar/contact-manager-api",
    },
  ];

  const techStack = [
    { name: "React", colorClass: "badge-react" },
    { name: "Next.js", colorClass: "badge-nextjs" },
    { name: "TypeScript", colorClass: "badge-typescript" },
    { name: "Bun", colorClass: "badge-bun" },
    { name: "Node.js", colorClass: "badge-nodejs" },
    { name: "Express", colorClass: "badge-express" },
    { name: "Postgres", colorClass: "badge-postgresql" },
    { name: "MongoDB", colorClass: "badge-mongodb" },
    { name: "Docker", colorClass: "badge-docker" },
    { name: "Tailwind", colorClass: "badge-tailwind" },
  ];

  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) selection:bg-(--text-primary) selection:text-(--bg-primary) font-sans">
      <nav className="fixed top-0 right-0 p-6 z-50">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-(--bg-secondary) border border-(--border-color) text-(--text-muted) hover:text-(--text-primary) transition-transform duration-200 ease-out hover:scale-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-color) shadow-sm cursor-pointer"
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-20 space-y-12">
        <header className="flex flex-col justify-center min-h-40 pl-1">
          <NameFlip />

          <div className="flex flex-col gap-6 mt-4">
            <p className="text-(--text-secondary) text-[15px] leading-relaxed max-w-lg font-light">
              I craft interactive web experiences using{" "}
              <span className="font-medium text-(--text-primary)">
                TypeScript
              </span>
              , <span className="font-medium text-(--text-primary)">React</span>
              ,{" "}
              <span className="font-medium text-(--text-primary)">Next.js</span>
              , and{" "}
              <span className="font-medium text-(--text-primary)">
                PostgreSQL
              </span>
              . Driven by a passion for{" "}
              <span className="font-medium text-(--text-primary)">
                UI design
              </span>{" "}
              and seamless user interactions.
            </p>

            <div className="inline-flex items-center flex-wrap gap-2 text-[15px]">
              <span className="text-(--text-secondary)">Get in touch:</span>
              <span className="font-medium text-(--text-primary)">
                quantapar@gmail.com
              </span>
              <button
                onClick={copyEmail}
                className="p-1.5 rounded-md hover:bg-(--bg-tertiary) text-(--text-muted) hover:text-(--text-primary) transition-colors duration-200 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-color) ml-1 cursor-pointer"
                title="Copy email"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
          </div>
        </header>

        <SectionMinimal title="Socials">
          <div className="flex flex-wrap gap-x-6 gap-y-3 pl-1">
            <a
              href="mailto:quantapar@gmail.com"
              className="group flex items-center gap-2 text-xs font-medium text-(--text-muted) hover:text-(--text-primary) transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-color) rounded-md"
            >
              <span className="p-1.5 rounded-md bg-(--bg-tertiary) border border-(--border-color) group-hover:border-(--text-muted) transition-colors duration-200 ease-out group-active:scale-[0.97]">
                <MailIcon />
              </span>
              <span>Email</span>
            </a>
            <a
              href="https://x.com/quantapar"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-xs font-medium text-(--text-muted) hover:text-(--text-primary) transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-color) rounded-md"
            >
              <span className="p-1.5 rounded-md bg-(--bg-tertiary) border border-(--border-color) group-hover:border-(--text-muted) transition-colors duration-200 ease-out group-active:scale-[0.97]">
                <TwitterIcon />
              </span>
              <span>Twitter</span>
            </a>
            <a
              href="https://github.com/Quantapar"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-xs font-medium text-(--text-muted) hover:text-(--text-primary) transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-color) rounded-md"
            >
              <span className="p-1.5 rounded-md bg-(--bg-tertiary) border border-(--border-color) group-hover:border-(--text-muted) transition-colors duration-200 ease-out group-active:scale-[0.97]">
                <GitHubIcon />
              </span>
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/manu-sharma-6012bb32a/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-xs font-medium text-(--text-muted) hover:text-(--text-primary) transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-color) rounded-md"
            >
              <span className="p-1.5 rounded-md bg-(--bg-tertiary) border border-(--border-color) group-hover:border-(--text-muted) transition-colors duration-200 ease-out group-active:scale-[0.97]">
                <LinkedInIcon />
              </span>
              <span>LinkedIn</span>
            </a>
          </div>
        </SectionMinimal>

        <SectionMinimal title="Experience">
          <ExperienceRow
            role="Fullstack Intern"
            company={
              <span className="flex items-center gap-3">
                <a
                  href="https://www.appx.co.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity duration-200 ease-out hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-color) rounded-sm inline-flex items-center text-[15px]"
                  aria-label="AppX"
                >
                  <span className="font-black tracking-tighter text-(--text-primary)">App</span>
                  <span className="font-black tracking-tighter text-[#FF3512]">X</span>
                </a>
                <span className="w-px h-4 bg-(--border-color)"></span>
                <a
                  href="https://www.ycombinator.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity flex items-center"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="rounded-sm"
                  >
                    <rect width="24" height="24" fill="#F26522" rx="2" />
                    <path d="M7 6L12 14L17 6H15L12 11L9 6H7Z" fill="white" />
                    <rect x="11" y="13" width="2" height="7" fill="white" />
                  </svg>
                </a>
              </span>
            }
            duration="Feb 2026 — Present"
          />
        </SectionMinimal>

        <SectionMinimal title="Projects">
          <div className="flex flex-col gap-6">
            {projects.map((project) => (
              <ProjectRow key={project.title} {...project} />
            ))}
          </div>
        </SectionMinimal>

        <SectionMinimal title="Technologies">
          <div className="flex flex-wrap gap-x-2 gap-y-2 pl-1">
            {techStack.map((tech) => (
              <TechBadge key={tech.name} {...tech} />
            ))}
          </div>
        </SectionMinimal>

        <AboutSection />

        <footer className="mt-24 py-12 flex flex-col items-center gap-6 border-t border-(--border-color)">
          <div className="flex gap-6 text-xs text-(--text-muted)">
            <a
              href="mailto:quantapar@gmail.com"
              className="hover:text-(--text-primary) transition-colors"
            >
              Email
            </a>
            <a
              href="https://x.com/quantapar"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-(--text-primary) transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://github.com/Quantapar"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-(--text-primary) transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/manu-sharma-6012bb32a/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-(--text-primary) transition-colors"
            >
              LinkedIn
            </a>
          </div>
          <div className="flex flex-col items-center text-[11px] text-(--text-muted) gap-1">
            <span className="flex items-center gap-1">
              Design & Developed by{" "}
              <span className="font-medium text-(--text-primary)">
                Manu Sharma
              </span>
            </span>
            <span className="opacity-60">
              © {new Date().getFullYear()}. All rights reserved.
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
