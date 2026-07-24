import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import "./index.css";
import devsImage from "./assets/100xDevsFrontend.png";
import cypherImage from "./assets/Cypher.png";

// import pulseapiImage from "./assets/pulse-api.png";
import dashboardUiImage from "./assets/dashboard-ui.png";
import onchainUiImage from "./assets/onchain-ui.png";
import neatlogsImage from "./assets/neatlogs.png";
import jaipurImage from "./assets/jaipur.png";
import gooeyTextImage from "./assets/gooey-text.png";
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
import { TechBadge } from "./components/ui/TechBadge";
import { MovieShelf } from "./components/about/MovieShelf";
import { FloatingToolbar } from "./components/ui/FloatingToolbar";
import { CodeBlock } from "./components/ui/CodeBlock";
import { uiComponents } from "./data/components";
import {
  authorEmail,
  getCanonicalUrl,
  getJsonLd,
  getSeoRoute,
  ogImageUrl,
  siteName,
} from "./seo";

function setMeta(
  selector: string,
  attribute: "name" | "property",
  value: string,
  content: string,
) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  element.content = content;
}

function updateDocumentSeo(pathname: string) {
  const route = getSeoRoute(pathname);
  const canonicalUrl = getCanonicalUrl(pathname);

  document.title = route.title;
  setMeta('meta[name="description"]', "name", "description", route.description);
  setMeta('meta[name="author"]', "name", "author", "Manu Sharma");
  setMeta('meta[name="robots"]', "name", "robots", "index, follow");
  setMeta('meta[property="og:title"]', "property", "og:title", route.title);
  setMeta(
    'meta[property="og:description"]',
    "property",
    "og:description",
    route.description,
  );
  setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
  setMeta(
    'meta[property="og:site_name"]',
    "property",
    "og:site_name",
    siteName,
  );
  setMeta('meta[property="og:type"]', "property", "og:type", "website");
  setMeta('meta[property="og:image"]', "property", "og:image", ogImageUrl);
  setMeta('meta[name="twitter:title"]', "name", "twitter:title", route.title);
  setMeta(
    'meta[name="twitter:description"]',
    "name",
    "twitter:description",
    route.description,
  );
  setMeta('meta[name="twitter:image"]', "name", "twitter:image", ogImageUrl);

  let canonical = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl;

  let jsonLd = document.head.querySelector<HTMLScriptElement>(
    'script[type="application/ld+json"][data-seo="route"]',
  );
  if (!jsonLd) {
    jsonLd = document.createElement("script");
    jsonLd.type = "application/ld+json";
    jsonLd.dataset.seo = "route";
    document.head.appendChild(jsonLd);
  }
  jsonLd.textContent = JSON.stringify(getJsonLd(pathname));
}

export function App() {
  const [isDark, setIsDark] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedNpm, setCopiedNpm] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [compTab, setCompTab] = useState<"preview" | "code">("preview");
  const [ringHovered, setRingHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    updateDocumentSeo(currentPath);
    window.scrollTo(0, 0);
  }, [currentPath]);

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
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(authorEmail);
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
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
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
      id: "onchain-ui",
      title: "OnChain UI",
      description:
        "A Web3 component library and UI marketplace. Production-ready React components for wallets, tokens, chains, and transactions — copy, paste, and ship.",
      status: "Currently building",
      tech: ["React", "TypeScript", "Tailwind CSS", "npm"],
      roles: [
        { name: "Design", type: "design" },
        { name: "Dev", type: "dev" },
      ] as const,
      githubUrl: "https://github.com/Quantapar/OnChainUI",
      liveUrl: "https://onchainui.quantapar.com/",
      image: onchainUiImage,
    },
    {
      id: "gooey-text",
      title: "Gooey Text",
      description:
        "Type any letter and watch it melt into a gooey blob. A keyboard-driven morph effect built with SVG filters and Framer Motion — circles flow along each glyph's skeleton and fuse into one liquid shape.",
      tech: ["React", "TypeScript", "Framer Motion", "SVG Filters"],
      roles: [
        { name: "Design", type: "design" },
        { name: "Dev", type: "dev" },
      ] as const,
      githubUrl: "https://github.com/Quantapar/Gooey-Text",
      liveUrl: "https://gooey-text.quantapar.com/",
      image: gooeyTextImage,
    },
    {
      id: "jagruk-jaipur",
      title: "Jagruk Jaipur",
      description:
        "A full revamp of Jaipur's event guide. Discover concerts, comedy, food fests, art, and workshops across the city — all curated in one modern interface.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      roles: [
        { name: "Design", type: "design" },
        { name: "Dev", type: "dev" },
      ] as const,
      liveUrl: "https://jagrukjaipur.quantapar.com/",
      image: jaipurImage,
    },
    // {
    //   id: "pulseapi",
    //   title: "PulseAPI",
    //   description:
    //     "A real-time API monitoring dashboard. Built with a responsive frosted glass UI and comprehensive system metrics to track endpoint uptime.",
    //   tech: ["Bun", "TypeScript", "React", "Postgres", "Prisma"],
    //   roles: [{ name: "Fullstack", type: "dev" }] as const,
    //   githubUrl: "https://github.com/Quantapar/PulseApi",
    //   liveUrl: "https://pulseapi.quantapar.com/",
    //   image: pulseapiImage,
    // },
    {
      id: "dashboard-ui",
      title: "Dashboard UI",
      description:
        "A SaaS analytics dashboard built as an assignment. Features KPI metric cards with sparkline charts, filterable order tables with status tabs, sortable columns, and a collapsible sidebar — all in a clean dark interface.",
      tech: ["React", "TypeScript", "Tailwind CSS"],
      roles: [
        { name: "Design", type: "design" },
        { name: "Frontend", type: "dev" },
      ] as const,
      githubUrl: "https://github.com/Quantapar/dashboard-ui",
      liveUrl: "https://dashboard-ui.quantapar.com/",
      image: dashboardUiImage,
    },
    {
      id: "100xdevs",
      title: "100xDevs Frontend",
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
    { name: "React Native", colorClass: "badge-reactnative" },
    { name: "Expo", colorClass: "badge-expo" },
    { name: "NativeWind", colorClass: "badge-nativewind" },
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
    <div
      className={`bg-(--bg-primary) bg-grid text-(--text-primary) selection:bg-(--text-primary) selection:text-(--bg-primary) font-sans overflow-x-hidden min-h-screen relative`}
    >
      <div className="gradient-bg" aria-hidden="true">
        <div className="gradient-blob blob-1" />
        <div className="gradient-blob blob-2" />
      </div>
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

      <AnimatePresence mode="wait">
        {currentPath.startsWith("/components/") &&
        uiComponents.find((c) => c.id === currentPath.split("/")[2]) ? (
          <motion.main
            key={currentPath}
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="max-w-2xl mx-auto px-6 pt-8 pb-32 space-y-8 min-h-screen bento-scale"
          >
            {(() => {
              const comp = uiComponents.find(
                (c) => c.id === currentPath.split("/")[2],
              )!;
              return (
                <div className="space-y-8">
                  <motion.div
                    initial={
                      prefersReducedMotion ? false : { opacity: 0, y: -50 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                    className="rounded-xl neo-brutal overflow-hidden"
                  >
                    <div className="flex items-center gap-4 px-4 border-b-2 border-(--border-color) bg-(--bg-secondary)">
                      <button
                        onClick={(e) => navigateTo("/components", e)}
                        className="inline-flex items-center gap-1.5 pr-3 mr-1 text-[13px] font-bold text-(--text-muted) hover:text-(--text-primary) transition-colors cursor-pointer py-3"
                      >
                        <ArrowLeftIcon />
                      </button>
                      <div className="w-0.5 h-5 bg-(--border-color) rounded-full mr-1" />
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
                            transition={
                              prefersReducedMotion
                                ? { duration: 0 }
                                : {
                                    duration: 0.25,
                                    ease: [0.32, 0.72, 0, 1],
                                  }
                            }
                            className="bg-(--bg-primary) p-10 flex items-center justify-center min-h-112"
                          >
                            {comp.preview}
                          </motion.div>
                        ) : (
                          <motion.div
                            key="code"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={
                              prefersReducedMotion
                                ? { duration: 0 }
                                : {
                                    duration: 0.25,
                                    ease: [0.32, 0.72, 0, 1],
                                  }
                            }
                            className="min-h-112 max-h-112 overflow-y-auto"
                          >
                            <CodeBlock code={comp.code} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={
                      prefersReducedMotion ? false : { opacity: 0, x: -50 }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                  >
                    <h1 className="text-3xl font-bold text-(--text-primary) tracking-tight mb-2">
                      {comp.name}
                    </h1>
                    <p className="text-(--text-secondary) text-[15px] leading-relaxed max-w-xl">
                      {comp.description}
                    </p>
                  </motion.div>

                  {comp.npmCommand && (
                    <motion.div
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, x: 50 }
                      }
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                      className="flex items-center gap-3 rounded-xl neo-brutal bg-(--bg-secondary) px-4 py-3"
                    >
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
                    </motion.div>
                  )}

                  {comp.props && comp.props.length > 0 && (
                    <motion.div
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 50 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                    >
                      <p
                        className="text-xs font-bold tracking-[0.15em] uppercase text-(--text-muted) mb-4"
                        style={{ fontFamily: "'Press Start 2P', cursive" }}
                      >
                        Props
                      </p>
                      <div className="rounded-xl overflow-hidden bg-(--bg-primary) border border-(--border-color)">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-(--bg-tertiary) text-left text-(--text-muted)">
                              <th className="px-4 py-3 font-medium">Prop</th>
                              <th className="px-4 py-3 font-medium">Type</th>
                              <th className="px-4 py-3 font-medium hidden sm:table-cell">
                                Required
                              </th>
                              <th className="px-4 py-3 font-medium">
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
                                <td className="px-4 py-3 font-mono text-(--text-primary) font-medium text-[13px]">
                                  {prop.name}
                                </td>
                                <td className="px-4 py-3 font-mono text-(--text-muted) text-[13px]">
                                  {prop.type}
                                </td>
                                <td className="px-4 py-3 hidden sm:table-cell">
                                  {prop.required ? (
                                    <span className="text-[11px] font-medium bg-(--accent) text-white px-1.5 py-0.5 rounded">
                                      Required
                                    </span>
                                  ) : (
                                    <span className="text-(--text-muted) text-[13px]">
                                      Optional
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-[13px]">
                                  {prop.description}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })()}
          </motion.main>
        ) : currentPath === "/components" ? (
          <motion.main
            key="components"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="max-w-5xl mx-auto px-6 pt-8 pb-24 min-h-screen bento-scale"
          >
            <div className="grid grid-cols-12 gap-4">
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                className="col-span-12 rounded-xl neo-brutal bg-(--bg-secondary) p-8"
              >
                <h1 className="text-4xl md:text-5xl font-black tracking-[-0.04em] text-(--text-primary)">
                  Components<span className="text-(--accent)">.</span>
                </h1>
                <p className="text-(--text-secondary) text-[17px] mt-3 max-w-lg">
                  Interactive UI components with live previews and copy-paste
                  code.
                </p>
              </motion.div>

              {uiComponents.map((comp, i) => (
                <motion.div
                  key={comp.id}
                  initial={
                    prefersReducedMotion
                      ? false
                      : { opacity: 0, x: i % 2 === 0 ? -50 : 50 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                  className="col-span-12 md:col-span-6 rounded-xl neo-brutal bg-(--bg-secondary) overflow-hidden hover:border-(--text-primary) transition-colors duration-200 ease-out cursor-pointer group flex flex-col"
                  onClick={(e) => navigateTo(`/components/${comp.id}`, e)}
                >
                  <div className="w-full bg-(--bg-tertiary) border-b-2 border-(--border-color) p-6 flex items-center justify-center flex-1">
                    <div className="pointer-events-none">{comp.preview}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-(--text-primary) tracking-tight mb-1">
                      {comp.name}
                    </h3>
                    <p className="text-(--text-muted) text-sm leading-relaxed">
                      {comp.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.main>
        ) : currentPath === "/about" ? (
          <motion.main
            key="about"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="max-w-5xl mx-auto px-6 pt-8 pb-24 min-h-screen bento-scale"
          >
            <div className="grid grid-cols-12 gap-4">
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                className="col-span-12 md:col-span-8 rounded-xl neo-brutal bg-(--bg-secondary) p-8"
              >
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
                  <span>Design Engineer</span>
                </div>
                <p className="text-(--text-secondary) text-[17px] leading-[1.7] max-w-lg">
                  I am a design engineer who likes building interfaces that
                  look good and feel right to use. I care about the small
                  details most people never notice.
                </p>
              </motion.div>

              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                className="col-span-12 md:col-span-4 rounded-xl neo-brutal bg-(--accent) overflow-hidden relative min-h-70 group"
              >
                <img
                  src="/me-color.jpeg"
                  alt="Color portrait of Manu Sharma, also known as Quantapar"
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out z-10"
                />
                <img
                  src="/me-bw.jpeg"
                  alt="Black and white portrait of Manu Sharma, also known as Quantapar"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                />
              </motion.div>

              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                className="col-span-12 rounded-xl neo-brutal bg-(--bg-secondary) p-6"
              >
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
              </motion.div>

              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                className="col-span-12 rounded-xl neo-brutal bg-(--bg-secondary) p-6 overflow-hidden"
              >
                <p
                  className="text-xs font-bold tracking-[0.15em] uppercase text-(--text-muted) mb-5"
                  style={{ fontFamily: "'Press Start 2P', cursive" }}
                >
                  Movies I'm lovin'
                </p>
                <MovieShelf />
              </motion.div>
            </div>
          </motion.main>
        ) : currentPath === "/projects" ? (
          <motion.main
            key="projects"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="max-w-5xl mx-auto px-6 pt-8 pb-24 min-h-screen bento-scale"
          >
            <div className="grid grid-cols-12 gap-4">
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                className="col-span-12 rounded-xl neo-brutal bg-(--bg-secondary) p-8 flex items-end justify-between"
              >
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
              </motion.div>

              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={
                    prefersReducedMotion
                      ? false
                      : { opacity: 0, x: i % 2 === 0 ? -50 : 50 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                  className="col-span-12 md:col-span-6 rounded-xl neo-brutal bg-(--bg-secondary) overflow-hidden hover:border-(--text-primary) transition-colors duration-200 ease-out group flex flex-col"
                >
                  {project.image && (
                    <a
                      href={project.liveUrl || project.githubUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-(--bg-tertiary) border-b-2 border-(--border-color) overflow-hidden p-4"
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full rounded-xl group-hover:scale-[1.03] transition-transform duration-300 ease-out"
                      />
                    </a>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-(--text-primary) tracking-tight mb-2">
                      {project.title}
                      {"status" in project && project.status && (
                        <>
                          {" ("}
                          <span
                            className="underline decoration-wavy decoration-blue-400 underline-offset-4 whitespace-nowrap"
                            style={{ fontFamily: '"Geist Pixel Square"' }}
                          >
                            {project.status}
                          </span>
                          {")"}
                        </>
                      )}
                    </h3>
                    <p className="text-(--text-secondary) text-sm leading-relaxed mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-medium font-mono text-(--text-secondary) bg-(--bg-tertiary) px-2 py-0.5 rounded-md border border-(--border-color)"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-auto">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-bold bg-(--text-primary) text-(--bg-primary) rounded-lg hover:opacity-85 transition-opacity"
                        >
                          Live Demo <ExternalLinkIcon />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-bold border-2 border-(--border-color) text-(--text-primary) rounded-lg hover:bg-(--bg-tertiary) transition-colors"
                        >
                          <GitHubIcon /> Source
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
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
                      className="rounded-2xl border border-white/20 bg-white/10 p-5 hover:bg-white/15 transition-colors duration-200 ease-out group/oss block"
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
              </motion.div>
            </div>
          </motion.main>
        ) : currentPath !== "/" &&
          currentPath !== "" &&
          !currentPath.includes("#") &&
          projects.find((p) => p.id === currentPath.slice(1)) ? (
          <motion.main
            key={currentPath}
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="max-w-2xl mx-auto px-6 pt-8 pb-32 space-y-12 min-h-screen bento-scale"
          >
            {(() => {
              const project = projects.find(
                (p) => p.id === currentPath.slice(1),
              )!;
              return (
                <div className="space-y-10">
                  <motion.div
                    initial={
                      prefersReducedMotion ? false : { opacity: 0, y: -50 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                  >
                    {project.image && (
                      <div className="w-full rounded-2xl overflow-hidden neo-brutal">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-auto block"
                        />
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    initial={
                      prefersReducedMotion ? false : { opacity: 0, x: -50 }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                  >
                    <h1 className="text-3xl font-bold text-(--text-primary) tracking-tight mb-4">
                      {project.title}
                    </h1>
                    <p className="text-(--text-secondary) text-[15px] leading-relaxed max-w-xl">
                      {project.description}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={
                      prefersReducedMotion ? false : { opacity: 0, x: 50 }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                    className="flex flex-wrap gap-2"
                  >
                    {project.tech.map((t) => (
                      <TechBadge key={t} name={t} colorClass="" />
                    ))}
                  </motion.div>

                  <motion.div
                    initial={
                      prefersReducedMotion ? false : { opacity: 0, y: 50 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                    className="flex gap-3"
                  >
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-bold bg-(--text-primary) text-(--bg-primary) rounded-lg hover:opacity-85 transition-opacity"
                      >
                        Live Demo <ExternalLinkIcon />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-bold border-2 border-(--border-color) text-(--text-primary) rounded-lg hover:bg-(--bg-tertiary) transition-colors"
                      >
                        <GitHubIcon /> Source
                      </a>
                    )}
                  </motion.div>
                </div>
              );
            })()}
          </motion.main>
        ) : (
          <motion.main
            key="home"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="max-w-5xl mx-auto px-6 pt-8 bento-scale"
          >
            <div className="grid grid-cols-12 gap-5 auto-rows-auto" id="home">
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                className="col-span-12 md:col-span-8 rounded-xl neo-brutal bg-(--bg-secondary) p-8 flex flex-col justify-between min-h-60"
              >
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
                    I'm Manu, a design engineer who likes making interfaces
                    feel good to use. I build with React, TypeScript and Framer
                    Motion. Right now I'm working on{" "}
                    <a
                      href="https://onchainui.quantapar.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-wavy decoration-blue-400 underline-offset-4 text-(--text-primary) hover:opacity-80 transition-opacity"
                      style={{ fontFamily: '"Geist Pixel Square"' }}
                    >
                      OnChain UI
                    </a>
                    .
                  </p>
                  <span className="inline-flex items-center gap-2 mt-2">
                    <button
                      onClick={copyEmail}
                      className="text-[15px] font-medium text-(--text-muted) hover:text-(--text-primary) transition-colors duration-200 cursor-pointer"
                    >
                      {authorEmail}
                    </button>
                    <button
                      onClick={copyEmail}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-bold text-(--text-muted) hover:text-(--text-primary) bg-(--bg-tertiary) border border-(--border-color) rounded-md hover:border-(--text-muted) transition-colors duration-200 ease-out cursor-pointer"
                      title="Copy email"
                    >
                      {copied ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
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
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 300, damping: 30 }
                      }
                      className="absolute inset-x-0 bottom-0 p-5 flex flex-col gap-3 z-10 backdrop-blur-xl"
                      style={{
                        background: "rgba(0,0,0,0.65)",
                        margin: -2,
                        paddingLeft: "calc(1.25rem + 2px)",
                        paddingRight: "calc(1.25rem + 2px)",
                        paddingBottom: "calc(1.25rem + 2px)",
                      }}
                    >
                      <p
                        className="text-xs font-bold tracking-[0.15em] uppercase text-white/60"
                        style={{ fontFamily: "'Press Start 2P', cursive" }}
                      >
                        Voyager Golden Record
                      </p>
                      <p className="text-sm leading-[1.7] text-white/85">
                        A gold-plated copper disc carrying sounds and images of
                        life on Earth — greetings in 55 languages, music from
                        Mozart to Chuck Berry, and 115 encoded photographs.
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
              </motion.div>

              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
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
              </motion.div>

              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                className="col-span-12 md:col-span-4 rounded-xl neo-brutal bg-(--bg-secondary) p-6 flex flex-col"
              >
                <p
                  className="text-xs font-bold tracking-[0.15em] uppercase text-(--text-muted) mb-4"
                  style={{ fontFamily: "'Press Start 2P', cursive" }}
                >
                  Experience
                </p>
                <div className="flex flex-col flex-1 gap-1">
                  <a
                    href="https://neatlogs.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 p-3 -mx-3 rounded-xl hover:bg-(--bg-tertiary) transition-colors duration-200 group"
                  >
                    <div className="w-11 h-11 rounded-xl shrink-0 overflow-hidden border border-(--border-color) group-hover:border-(--text-primary) transition-colors">
                      <img
                        src={neatlogsImage}
                        alt="Neatlogs"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-(--text-primary) leading-tight">
                        Design Engineer Intern
                      </p>
                      <p className="text-[12px] text-(--text-muted) mt-0.5">
                        Neatlogs (Apr 2026 — June 2026)
                      </p>
                    </div>
                  </a>
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
                        Design Engineer Intern
                      </p>
                      <p className="text-[12px] text-(--text-muted) mt-0.5">
                        Krane Apps (Oct 2025 — Apr 2026)
                      </p>
                    </div>
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                className="col-span-12 md:col-span-4 rounded-xl neo-brutal bg-(--bg-secondary) p-6"
              >
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
                      href: "https://www.linkedin.com/in/quantapar/",
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
                      className="flex items-center justify-center aspect-square rounded-xl neo-brutal bg-(--bg-tertiary) transition-all duration-200 ease-out [&_svg]:w-7 [&_svg]:h-7 [&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:ease-out hover:[&_svg]:scale-125"
                      style={{ color: isDark ? link.darkColor : link.color }}
                      title={link.label}
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </motion.div>

              <motion.a
                initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                href="/components"
                onClick={(e) => navigateTo("/components", e)}
                className="col-span-12 rounded-xl neo-brutal bg-(--bg-secondary) p-6 flex items-center justify-between hover:border-(--text-primary) transition-colors duration-200 ease-out cursor-pointer group"
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
                  className="text-(--text-muted) group-hover:text-(--accent) group-hover:translate-x-1 transition-[color,transform] duration-200 ease-out"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </motion.a>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
