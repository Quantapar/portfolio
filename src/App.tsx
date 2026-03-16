import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";
import devsImage from "./assets/100xDevsFrontend.png";
import cypherImage from "./assets/Cypher.png";
import mayhemImage from "./assets/Mayhem.png";

import pulseapiImage from "./assets/pulse-api.png";
import ringVideo from "./assets/ring-loop.mp4";

import {
  SunIcon,
  MoonIcon,
  HomeIcon,
  UserIcon,
  LayersIcon,
  ComponentsIcon,
  ArrowLeftIcon,
  TerminalIcon,
  GitHubIcon,
  ExternalLinkIcon,
  TwitterIcon,
  LinkedInIcon,
  CopyIcon,
  CheckIcon,
  DiscordIcon,
  MailIcon,
} from "./components/Icons";
import { SectionMinimal } from "./components/ui/SectionMinimal";
import { ExperienceRow } from "./components/ui/ExperienceRow";
import { TechBadge } from "./components/ui/TechBadge";
import { ProjectRow } from "./components/projects/ProjectRow";
import { ProjectCard } from "./components/projects/ProjectCard";
import { AboutSection } from "./components/about/AboutSection";
import { MovieShelf } from "./components/about/MovieShelf";
import { FloatingToolbar } from "./components/ui/FloatingToolbar";
import { ComponentPreviewCard } from "./components/ui/ComponentPreviewCard";
import { CodeBlock } from "./components/ui/CodeBlock";
import { uiComponents } from "./data/components";

export function App() {
  const [isDark, setIsDark] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedNpm, setCopiedNpm] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [activeTab, setActiveTab] = useState<"projects" | "oss">("projects");
  const [compTab, setCompTab] = useState<"preview" | "code">("preview");
  const [ringHovered, setRingHovered] = useState(false);

  useEffect(() => {
    if (currentPath !== "/projects") return;
    const projectsEl = document.getElementById("projects-section");
    const ossEl = document.getElementById("oss-section");
    if (!projectsEl || !ossEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveTab(
              entry.target.id === "oss-section" ? "oss" : "projects",
            );
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px" },
    );

    observer.observe(projectsEl);
    observer.observe(ossEl);
    return () => observer.disconnect();
  }, [currentPath]);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (path: string, event?: React.MouseEvent) => {
    if (event) event.preventDefault();
    if (path.includes("#")) {
      const [base, hash] = path.split("#");
      const targetBase = base || "/";

      if (currentPath !== targetBase) {
        window.history.pushState({}, "", path);
        setCurrentPath(targetBase);
        if (hash) {
          setTimeout(() => {
            document
              .getElementById(hash)
              ?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      } else {
        window.history.pushState({}, "", path);
        if (hash) {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      window.history.pushState({}, "", path);
      setCurrentPath(path);
      window.scrollTo(0, 0);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("quantapar@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else if (stored === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
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
      Math.max(y, window.innerHeight - y),
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
          duration: 900,
          easing: "cubic-bezier(0.32, 0.72, 0, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  const projects = [
    {
      id: "pulseapi",
      title: "PulseAPI",
      description:
        "A real-time API monitoring dashboard. Built with a responsive frosted glass UI and comprehensive system metrics to track endpoint uptime.",
      tech: ["Bun", "TypeScript", "React", "Postgres", "Prisma"],
      roles: [{ name: "Fullstack", type: "dev" }] as const,
      githubUrl: "https://github.com/Quantapar/PulseApi",
      liveUrl: "https://pulseapi.quantapar.com/",
      image: pulseapiImage,
    },
    {
      id: "100xdevs",
      title: "100xDevs Frontend Revamp",
      description:
        "A complete frontend revamp for the 100xDevs platform. Features immersive web animations, modern UI components, and a robust design system.",
      tech: ["React", "Tailwind CSS", "Framer Motion"],
      roles: [
        { name: "Design", type: "design" },
        { name: "Dev", type: "dev" },
      ] as const,
      githubUrl: "https://github.com/Quantapar/100xDevs-Frontend",
      liveUrl: "https://100xdevs.quantapar.com/",
      image: devsImage,
    },
    {
      id: "cypher",
      title: "Cypher",
      description:
        "A full-stack contest hosting platform. Built for scalability with role-based access, real-time code submissions, and live leaderboards.",
      tech: ["React", "Bun", "Postgres", "Prisma", "Docker"],
      roles: [{ name: "Fullstack", type: "dev" }] as const,
      githubUrl: "https://github.com/Quantapar/contest-platform",
      liveUrl: "https://cypherarena.quantapar.com/",
      image: cypherImage,
    },
    {
      id: "mayhem",
      title: "Mayhem",
      description:
        "Experimental landing page design. Focusing on micro-interactions, smooth scrolling, and cinematic typography.",
      tech: ["HTML", "Tailwind", "Motion"],
      roles: [
        { name: "Design", type: "design" },
        { name: "Interactions", type: "prototype" },
      ] as const,
      githubUrl: "https://github.com/Quantapar/Tailwind/tree/main/tailwind01",
      liveUrl: "https://joinmayhem.quantapar.com/",
      image: mayhemImage,
    },
  ];

  const contributions = [
    {
      repo: "bluntbrain/100xmobile",
      repoUrl: "https://github.com/bluntbrain/100xmobile",
      title: "UI Revamp — #1",
      description:
        "Complete UI overhaul of the 100xMobile website. Redesigned the entire app with a modern, polished interface and improved user experience.",
      prUrl: "https://github.com/bluntbrain/100xmobile/pull/1",
    },
    {
      repo: "bluntbrain/krane-apps",
      repoUrl: "https://github.com/bluntbrain/krane-apps-github-style-website",
      title: "GitHub-Style UI Revamp",
      description:
        "Full UI revamp of the Krane Apps website with a GitHub-style design. Rebuilt the interface for a cleaner, more professional look.",
      prUrl: "https://github.com/bluntbrain/krane-apps-github-style-website",
    },
  ];

  const techStack = [
    { name: "Framer Motion", colorClass: "badge-framermotion" },
    { name: "Figma", colorClass: "badge-figma" },
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

  const menuItems = [
    { id: "home", icon: <HomeIcon />, label: "Home", targetPath: "/" },
    {
      id: "projects",
      icon: <LayersIcon />,
      label: "Projects",
      targetPath: "/projects",
    },
    {
      id: "components",
      icon: <ComponentsIcon />,
      label: "Components",
      targetPath: "/components",
    },
    { id: "about", icon: <UserIcon />, label: "About", targetPath: "/about" },
  ];

  return (
    <div className={`bg-(--bg-primary) bg-grid text-(--text-primary) selection:bg-(--text-primary) selection:text-(--bg-primary) font-sans overflow-x-hidden ${currentPath === "/" || currentPath === "" ? "h-screen overflow-hidden" : "min-h-screen"}`}>
      <nav className="sticky top-0 z-50 flex justify-center pt-4 pb-4 overflow-visible">
        <FloatingToolbar
          items={[
            ...menuItems.map((item) => ({
              id: item.id,
              label: item.label,
              icon: item.icon,
              onClick: (e: React.MouseEvent) => navigateTo(item.targetPath, e),
            })),
            {
              id: "theme",
              label: isDark ? "Light Mode" : "Dark Mode",
              icon: isDark ? <SunIcon /> : <MoonIcon />,
              onClick: toggleTheme,
            },
          ]}
          activeId={
            currentPath === "/" || currentPath === ""
              ? "home"
              : currentPath === "/projects"
                ? "projects"
                : currentPath.startsWith("/components")
                  ? "components"
                  : currentPath === "/about"
                    ? "about"
                    : undefined
          }
          separator={3}
        />
      </nav>

      {currentPath.startsWith("/components/") &&
      uiComponents.find((c) => c.id === currentPath.split("/")[2]) ? (
        <main className="max-w-2xl mx-auto px-6 pt-4 pb-32 space-y-8 transition-all min-h-screen">
          {(() => {
            const comp = uiComponents.find(
              (c) => c.id === currentPath.split("/")[2],
            )!;
            return (
              <div className="animate-in fade-in duration-300 slide-in-from-bottom-4 space-y-8">

                <div className="rounded-xl neo-brutal overflow-hidden">
                  <div className="flex items-center gap-4 px-4 border-b-2 border-(--border-color) bg-(--bg-secondary)">
                    <button
                      onClick={() => setCompTab("preview")}
                      className={`relative text-[13px] font-medium py-3 transition-colors duration-200 cursor-pointer ${
                        compTab === "preview"
                          ? "text-(--text-primary)"
                          : "text-(--text-muted) hover:text-(--text-primary)"
                      }`}
                    >
                      Preview
                      {compTab === "preview" && (
                        <motion.div
                          layoutId="comp-tab-indicator"
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-(--accent) rounded-full"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                    </button>
                    <button
                      onClick={() => setCompTab("code")}
                      className={`relative text-[13px] font-medium py-3 transition-colors duration-200 cursor-pointer ${
                        compTab === "code"
                          ? "text-(--text-primary)"
                          : "text-(--text-muted) hover:text-(--text-primary)"
                      }`}
                    >
                      Code
                      {compTab === "code" && (
                        <motion.div
                          layoutId="comp-tab-indicator"
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-(--accent) rounded-full"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                    </button>
                  </div>
                  <div className="relative overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {compTab === "preview" ? (
                        <motion.div
                          key="preview"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{
                            duration: 0.25,
                            ease: [0.32, 0.72, 0, 1],
                          }}
                          className="bg-(--bg-tertiary)/50 p-10 flex items-center justify-center min-h-112"
                        >
                          {comp.preview}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="code"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{
                            duration: 0.25,
                            ease: [0.32, 0.72, 0, 1],
                          }}
                          className="max-h-96 overflow-y-auto"
                        >
                          <CodeBlock code={comp.code} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>


                <div>
                  <h1 className="text-3xl font-bold text-(--text-primary) tracking-tight mb-2">
                    {comp.name}
                  </h1>
                  <p className="text-(--text-secondary) text-[15px] leading-relaxed max-w-xl">
                    {comp.description}
                  </p>
                </div>

                {comp.npmCommand && (
                  <div className="flex items-center gap-3 rounded-xl neo-brutal bg-(--bg-secondary) px-4 py-3">
                    <TerminalIcon />
                    <code className="text-[13px] font-mono text-(--text-secondary) flex-1">
                      {comp.npmCommand}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(comp.npmCommand!);
                        setCopiedNpm(true);
                        setTimeout(() => setCopiedNpm(false), 2000);
                      }}
                      className="p-1.5 rounded-md hover:bg-(--bg-tertiary) text-(--text-muted) hover:text-(--text-primary) transition-colors duration-200 cursor-pointer"
                      title="Copy command"
                    >
                      {copiedNpm ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                )}

                {comp.props && comp.props.length > 0 && (
                  <div>
                    <p
                      className="text-xs font-bold tracking-[0.15em] uppercase text-(--text-muted) mb-4"
                      style={{ fontFamily: "'Press Start 2P', cursive" }}
                    >
                      Props
                    </p>
                    <div className="rounded-xl neo-brutal overflow-hidden">
                      <table className="w-full text-[13px]">
                        <thead>
                          <tr className="bg-(--bg-tertiary)/50 text-left text-(--text-muted)">
                            <th className="px-4 py-2.5 font-medium">Prop</th>
                            <th className="px-4 py-2.5 font-medium">Type</th>
                            <th className="px-4 py-2.5 font-medium hidden sm:table-cell">
                              Required
                            </th>
                            <th className="px-4 py-2.5 font-medium">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {comp.props.map((prop) => (
                            <tr
                              key={prop.name}
                              className="border-t border-(--border-color) text-(--text-secondary)"
                            >
                              <td className="px-4 py-2.5 font-mono text-(--text-primary) font-medium">
                                {prop.name}
                              </td>
                              <td className="px-4 py-2.5 font-mono text-(--text-muted)">
                                {prop.type}
                              </td>
                              <td className="px-4 py-2.5 hidden sm:table-cell">
                                {prop.required ? (
                                  <span className="text-[11px] font-medium bg-(--accent) text-white px-1.5 py-0.5 rounded">
                                    Required
                                  </span>
                                ) : (
                                  <span className="text-(--text-muted)">
                                    Optional
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-2.5">
                                {prop.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </main>
      ) : currentPath === "/components" ? (
        <main className="max-w-5xl mx-auto px-6 pt-4 pb-24 transition-all min-h-screen">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 rounded-xl neo-brutal bg-(--bg-secondary) p-8">
              <h1 className="text-4xl md:text-5xl font-black tracking-[-0.04em] text-(--text-primary)">
                Components<span className="text-(--accent)">.</span>
              </h1>
              <p className="text-(--text-secondary) text-[17px] mt-3 max-w-lg">
                Interactive UI components with live previews and copy-paste
                code.
              </p>
            </div>

            {uiComponents.map((comp) => (
              <div
                key={comp.id}
                className="col-span-12 md:col-span-6 rounded-xl neo-brutal bg-(--bg-secondary) overflow-hidden hover:border-(--text-primary) transition-all duration-200 cursor-pointer group flex flex-col"
                onClick={(e) => navigateTo(`/components/${comp.id}`, e)}
              >
                <div className="w-full bg-(--bg-tertiary) border-b-2 border-(--border-color) p-6 flex items-center justify-center flex-1">
                  <div className="pointer-events-none scale-90">
                    {comp.preview}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-(--text-primary) tracking-tight mb-1">
                    {comp.name}
                  </h3>
                  <p className="text-(--text-muted) text-sm leading-relaxed">
                    {comp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : currentPath === "/about" ? (
        <main className="max-w-5xl mx-auto px-6 pt-4 pb-24 transition-all min-h-screen">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-8 rounded-xl neo-brutal bg-(--bg-secondary) p-8">
              <p
                className="text-xs font-bold tracking-[0.15em] uppercase text-(--text-muted) mb-4"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
              >
                About me
              </p>
              <h1 className="text-4xl md:text-5xl font-black tracking-[-0.04em] leading-[1.05] text-(--text-primary) mb-4">
                Manu Sharma<span className="text-(--accent)">.</span>
              </h1>
              <div className="flex items-center gap-1.5 text-[14px] text-(--text-secondary) font-medium mb-5">
                <span>20</span>
                <span className="opacity-40">•</span>
                <div className="h-4.5 overflow-hidden inline-flex flex-col relative top-[0.5px]">
                  <div className="animate-flip leading-4.5">
                    <span className="block h-4.5">Design Engineer</span>
                    <span className="block h-4.5">UI Craftsman</span>
                    <span className="block h-4.5">Design Engineer</span>
                  </div>
                </div>
              </div>
              <p className="text-(--text-secondary) text-[17px] leading-[1.7] max-w-lg">
                I'm a Design Engineer who cares deeply about how things look,
                feel, and move. I build polished interfaces with attention to
                every pixel and interaction.
              </p>
            </div>

            <div className="col-span-12 md:col-span-4 rounded-xl neo-brutal bg-(--accent) overflow-hidden relative min-h-70 group">
              <img
                src="/me-color.jpeg"
                alt="Manu Sharma Color"
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-10"
              />
              <img
                src="/me-bw.jpeg"
                alt="Manu Sharma"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </div>

            <div className="col-span-12 rounded-xl neo-brutal bg-(--bg-secondary) p-6">
              <p
                className="text-xs font-bold tracking-[0.15em] uppercase text-(--text-muted) mb-5"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
              >
                Technologies
              </p>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <TechBadge key={tech.name} {...tech} />
                ))}
              </div>
            </div>

            <div className="col-span-12 rounded-xl neo-brutal bg-(--bg-secondary) p-6 overflow-hidden">
              <p
                className="text-xs font-bold tracking-[0.15em] uppercase text-(--text-muted) mb-5"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
              >
                Movies I'm lovin'
              </p>
              <MovieShelf />
            </div>
          </div>
        </main>
      ) : currentPath === "/projects" ? (
        <main className="max-w-5xl mx-auto px-6 pt-4 pb-24 transition-all min-h-screen">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 rounded-xl neo-brutal bg-(--bg-secondary) p-8 flex items-end justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-[-0.04em] text-(--text-primary)">
                  Work<span className="text-(--accent)">.</span>
                </h1>
                <p className="text-(--text-secondary) text-[17px] mt-3 max-w-lg">
                  Projects I've built and open source I've contributed to.
                </p>
              </div>
              <button
                onClick={() =>
                  document
                    .getElementById("oss-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-(--border-color) bg-(--accent) text-white text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer shrink-0"
              >
                Open Source ↓
              </button>
            </div>

            {projects.map((project) => (
              <div
                key={project.id}
                className="col-span-12 md:col-span-6 rounded-xl neo-brutal bg-(--bg-secondary) overflow-hidden hover:border-(--text-primary) transition-all duration-200 group"
              >
                <a
                  href={project.liveUrl || project.githubUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {project.image && (
                    <div className="w-full bg-(--bg-tertiary) border-b-2 border-(--border-color) overflow-hidden p-4">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full rounded-xl group-hover:scale-[1.03] transition-transform duration-300 ease-out"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-(--text-primary) tracking-tight">
                        {project.title}
                      </h3>
                      <div className="flex gap-2 shrink-0">
                        {project.githubUrl && (
                          <span className="text-(--text-muted) group-hover:text-(--text-primary) transition-colors">
                            <GitHubIcon />
                          </span>
                        )}
                        {project.liveUrl && (
                          <span className="text-(--text-muted) group-hover:text-(--text-primary) transition-colors">
                            <ExternalLinkIcon />
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-(--text-secondary) text-sm leading-relaxed mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-medium font-mono text-(--text-secondary) bg-(--bg-tertiary) px-2 py-0.5 rounded-md border border-(--border-color)"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              </div>
            ))}

            <div
              id="oss-section"
              className="col-span-12 rounded-xl neo-brutal bg-(--accent) p-8 text-white scroll-mt-20"
            >
              <p
                className="text-xs font-bold tracking-[0.15em] uppercase text-white/50 mb-6"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
              >
                Open Source
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contributions.map((contrib) => (
                  <a
                    key={contrib.title}
                    href={contrib.prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-white/20 bg-white/10 p-5 hover:bg-white/15 transition-all duration-200 group/oss block"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <GitHubIcon />
                      <span className="text-[14px] font-bold text-white/90">
                        {contrib.repo}
                      </span>
                    </div>
                    <p className="text-[14px] font-medium text-white/80 mb-2">
                      {contrib.title}
                    </p>
                    <p className="text-[13px] text-white/50 leading-relaxed">
                      {contrib.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </main>
      ) : currentPath !== "/" &&
        currentPath !== "" &&
        !currentPath.includes("#") &&
        projects.find((p) => p.id === currentPath.slice(1)) ? (
        <main className="max-w-2xl mx-auto px-6 pt-4 pb-32 space-y-12 transition-all min-h-screen">
          {(() => {
            const project = projects.find(
              (p) => p.id === currentPath.slice(1),
            )!;
            return (
              <div className="animate-in fade-in duration-300 slide-in-from-bottom-4">
                <SectionMinimal title="Project Details">
                  {project.image && (
                    <div className="w-full rounded-2xl overflow-hidden border-2 border-(--border-color) mb-10">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-auto block"
                      />
                    </div>
                  )}

                  <h1 className="text-3xl font-bold text-(--text-primary) tracking-tight mb-6 pl-1">
                    {project.title}
                  </h1>

                  <div className="flex flex-wrap gap-2 mb-8 pl-1">
                    {project.tech.map((t) => (
                      <TechBadge key={t} name={t} colorClass="" />
                    ))}
                  </div>

                  <p className="text-(--text-secondary) text-[15px] leading-relaxed max-w-xl mb-10 pl-1">
                    {project.description}
                  </p>

                  <div className="flex gap-4 pl-1">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-[13px] font-medium bg-(--text-primary) text-(--bg-primary) rounded-lg hover:bg-(--text-secondary) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--text-muted)"
                      >
                        Visit Website <ExternalLinkIcon />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-[13px] font-medium bg-(--bg-tertiary) border border-(--border-color) text-(--text-primary) rounded-lg hover:bg-(--border-color) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-color)"
                      >
                        <GitHubIcon /> View Source
                      </a>
                    )}
                  </div>
                </SectionMinimal>
              </div>
            );
          })()}
        </main>
      ) : (
        <main className="max-w-5xl mx-auto px-6 pt-8 transition-all origin-top scale-[0.95]">
          <div className="grid grid-cols-12 gap-5 auto-rows-auto" id="home">
            <div className="col-span-12 md:col-span-8 rounded-xl neo-brutal bg-(--bg-secondary) p-8 flex flex-col justify-between min-h-60">
              <div>
                <p
                  className="text-xs font-bold tracking-[0.15em] uppercase text-(--text-muted) mb-4"
                  style={{ fontFamily: "'Press Start 2P', cursive" }}
                >
                  Hello there
                </p>
                <h1 className="text-5xl md:text-6xl font-black tracking-[-0.04em] leading-[1.05] text-(--text-primary)">
                  Manu
                  <br />
                  Sharma<span className="text-(--accent)">.</span>
                </h1>
              </div>
              <div className="mt-6">
                <p className="text-[17px] leading-[1.7] text-(--text-secondary) max-w-md">
                  Design Engineer obsessed with motion, micro-interactions, and
                  UI detail, building with React, TypeScript & Framer Motion.
                </p>
                <span className="inline-flex items-center gap-2">
                  <span
                    onClick={copyEmail}
                    className="text-[14px] text-(--text-muted) hover:text-(--text-primary) cursor-pointer transition-colors duration-200"
                  >
                    {copied ? "Copied!" : "quantapar@gmail.com"}
                  </span>
                  <button
                    onClick={copyEmail}
                    className="p-1 rounded-md text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-tertiary) transition-all duration-200 cursor-pointer active:scale-95"
                    title="Copy email"
                  >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </span>
              </div>
            </div>

            <div
              className="col-span-12 md:col-span-4 rounded-xl neo-brutal overflow-hidden relative min-h-60 bg-black cursor-pointer"
              onMouseEnter={() => setRingHovered(true)}
              onMouseLeave={() => setRingHovered(false)}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                src={ringVideo}
              />
              <AnimatePresence>
                {ringHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: "100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute inset-x-0 bottom-0 rounded-b-xl border-t border-white/15 p-5 flex flex-col gap-3 z-10 backdrop-blur-xl"
                    style={{ background: "rgba(0,0,0,0.65)" }}
                  >
                    <p
                      className="text-xs font-bold tracking-[0.15em] uppercase text-white/60"
                      style={{ fontFamily: "'Press Start 2P', cursive" }}
                    >
                      Voyager Golden Record
                    </p>
                    <p className="text-sm leading-[1.7] text-white/85">
                      A gold-plated copper disc carrying sounds and images of life on Earth — greetings in 55 languages, music from Mozart to Chuck Berry, and 115 encoded photographs.
                    </p>
                    <a
                      href="https://en.wikipedia.org/wiki/Voyager_Golden_Record"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-white transition-colors w-fit"
                    >
                      Read on Wikipedia <ExternalLinkIcon />
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              className="col-span-12 md:col-span-4 rounded-xl neo-brutal bg-(--accent) p-6 text-white cursor-pointer"
              onClick={(e) => navigateTo("/projects", e)}
            >
              <p
                className="text-xs font-bold tracking-[0.15em] uppercase text-white/60 mb-5"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
              >
                Work
              </p>
              <div className="flex flex-col gap-3">
                {projects.slice(0, 3).map((project) => (
                  <button
                    key={project.id}
                    onClick={(e) => navigateTo(`/${project.id}`, e)}
                    className="text-left text-[15px] font-semibold text-white/90 hover:text-white transition-colors cursor-pointer"
                  >
                    {project.title} →
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <a
                  href="/projects"
                  onClick={(e) => navigateTo("/projects", e)}
                  className="text-sm font-medium text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  View all →
                </a>
              </div>
            </div>

            <div className="col-span-12 md:col-span-4 rounded-xl neo-brutal bg-(--bg-secondary) p-6 flex flex-col">
              <p
                className="text-xs font-bold tracking-[0.15em] uppercase text-(--text-muted) mb-4"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
              >
                Experience
              </p>
              <div className="flex flex-col flex-1">
                <a
                  href="https://www.kraneapps.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3 -mx-3 rounded-xl hover:bg-(--bg-tertiary) transition-colors duration-200 group"
                >
                  <div className="w-11 h-11 rounded-xl shrink-0 overflow-hidden border border-(--border-color) group-hover:border-(--text-primary) transition-colors">
                    <img
                      src="https://www.kraneapps.com/images/logo.png"
                      alt="Krane Apps"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-(--text-primary) leading-tight">
                      Design Engineer
                    </p>
                    <p className="text-[12px] text-(--text-muted) mt-0.5">
                      Krane Apps · Nov 2025 — Present
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <div className="col-span-12 md:col-span-4 rounded-xl neo-brutal bg-(--bg-secondary) p-6">
              <p
                className="text-xs font-bold tracking-[0.15em] uppercase text-(--text-muted) mb-5"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
              >
                Social
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    href: "https://github.com/Quantapar",
                    icon: <GitHubIcon />,
                    label: "GitHub",
                    color: "#181717",
                    darkColor: "#f0f0f0",
                  },
                  {
                    href: "https://x.com/quantapar",
                    icon: <TwitterIcon />,
                    label: "X",
                    color: "#000000",
                    darkColor: "#f0f0f0",
                  },
                  {
                    href: "https://www.linkedin.com/in/manu-sharma-6012bb32a/",
                    icon: <LinkedInIcon />,
                    label: "LinkedIn",
                    color: "#0A66C2",
                    darkColor: "#5B9BD5",
                  },
                  {
                    href: "https://discord.com/users/762906412564217857",
                    icon: <DiscordIcon />,
                    label: "Discord",
                    color: "#5865F2",
                    darkColor: "#7983F5",
                  },
                  {
                    href: "mailto:quantapar@gmail.com",
                    icon: <MailIcon />,
                    label: "Email",
                    color: "#EA4335",
                    darkColor: "#F87171",
                  },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center aspect-square rounded-xl neo-brutal bg-(--bg-tertiary) hover:scale-[1.03] transition-all duration-200 ease-out [&_svg]:w-7 [&_svg]:h-7"
                    style={{ color: isDark ? link.darkColor : link.color }}
                    title={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="/components"
              onClick={(e) => navigateTo("/components", e)}
              className="col-span-12 rounded-xl neo-brutal bg-(--bg-secondary) p-6 flex items-center justify-between hover:border-(--text-primary) transition-all duration-200 ease-out cursor-pointer group"
            >
              <div>
                <p
                  className="text-xs font-bold tracking-[0.15em] uppercase text-(--text-muted) mb-3"
                  style={{ fontFamily: "'Press Start 2P', cursive" }}
                >
                  Components
                </p>
                <p className="text-2xl font-bold text-(--text-primary) tracking-tight">
                  Interactive UI components I've crafted
                  <span className="text-(--accent)">.</span>
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-(--text-muted) group-hover:text-(--accent) group-hover:translate-x-1 transition-all duration-200"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>
        </main>
      )}

    </div>
  );
}

export default App;
