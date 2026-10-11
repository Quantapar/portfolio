import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import "@fontsource-variable/hanken-grotesk/wght.css";
import "@fontsource-variable/manrope/wght.css";
import "./torchbase-landing.css";

const NAV_LINKS = ["Product", "Docs", "Pricing", "FAQ"] as const;

/** On the real site these lead to sign-up, the docs and pricing. Here the page is the exhibit, so they go nowhere. */
function DemoLink({
  className,
  label,
  children,
  ...handlers
}: {
  className?: string;
  label?: string;
  children: ReactNode;
  onMouseEnter?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  return (
    <a
      href="#"
      aria-label={label}
      className={className}
      onClick={(event) => event.preventDefault()}
      {...handlers}
    >
      {children}
    </a>
  );
}

function TorchbaseLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2c1.8 3 .6 5-1 6.5-1.4 1.3-2.5 2.6-2.5 4.4 0 .8.2 1.5.6 2.1-1.4-.5-2.4-1.9-2.4-3.6 0-.4 0-.8.1-1.1C5.2 12 4.5 13.8 4.5 15.8 4.5 19.2 7.9 22 12 22s7.5-2.8 7.5-6.2c0-3.4-2.3-5.6-3.9-7.6C13.7 5.8 12.5 4.2 12 2Z"
        fill="#FE551A"
      />
      <path
        d="M12 22c2 0 3.6-1.5 3.6-3.4 0-1.9-1.4-3-2.4-4.3-.6 1-1.6 1.6-1.6 2.9 0 .6.2 1 .5 1.4-.8-.3-1.3-1.1-1.3-2 0 0-2 1.3-2 3 0 1.7 1.4 2.4 3.2 2.4Z"
        fill="#FFB088"
      />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
    </svg>
  );
}

function NavbarLinks() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav aria-label="Main" className="hidden justify-self-center md:block">
      <ul
        className="flex items-center gap-1"
        onMouseLeave={() => setHovered(null)}
      >
        {NAV_LINKS.map((label) => (
          <li key={label}>
            <DemoLink
              onMouseEnter={() => setHovered(label)}
              onFocus={() => setHovered(label)}
              onBlur={() => setHovered(null)}
              className="relative block rounded-xl px-4 py-2 text-[15px] font-medium whitespace-nowrap text-neutral-700 transition-[scale,color] duration-150 ease-out hover:text-neutral-900 motion-safe:active:scale-[0.98]"
            >
              <AnimatePresence>
                {hovered === label && (
                  <motion.span
                    // One pill shared by all four links, so it slides from one to the next.
                    layoutId="torchbase-nav-pill"
                    className="absolute inset-0 rounded-xl bg-neutral-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      layout: { type: "spring", stiffness: 450, damping: 35 },
                      opacity: { duration: 0.12 },
                    }}
                  />
                )}
              </AnimatePresence>
              <span className="relative z-10">{label}</span>
            </DemoLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Navbar() {
  return (
    // Fixed to the window on the real site. Here the page is exactly one screen tall, so pinning
    // it to the page looks the same and lets it travel with the page when the piece opens.
    <header className="absolute inset-x-0 top-0 z-50 w-full pt-3 text-[rgba(10,16,30,0.95)] backdrop-blur">
      <div className="mx-auto grid h-14 w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 md:px-8">
        <DemoLink className="flex items-center gap-2 justify-self-start">
          <TorchbaseLogo className="size-7" />
          <span className="text-lg font-bold tracking-tight text-neutral-900">
            Torchbase
          </span>
        </DemoLink>

        <NavbarLinks />

        <div className="flex items-center gap-3 justify-self-end">
          <DemoLink
            label="Torchbase on GitHub"
            className="text-neutral-700 transition-colors duration-150 hover:text-neutral-900"
          >
            <GithubIcon className="size-5" />
          </DemoLink>
          <DemoLink className="inline-flex h-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#ff7e47] to-[#f04d0d] px-4 text-sm font-medium whitespace-nowrap text-[#fffefa] shadow-[0_2px_10px_rgba(254,85,26,0.28)] transition-[scale,box-shadow] duration-150 ease-out hover:from-[#fa6c31] hover:to-[#dd4309] hover:shadow-[0_3px_14px_rgba(254,85,26,0.4)] motion-safe:active:scale-[0.98]">
            Sign up
          </DemoLink>
        </div>
      </div>
    </header>
  );
}

function HeroWaitlistTag() {
  return (
    <DemoLink className="group inline-flex items-center gap-2 rounded-full bg-white/30 py-1 pr-1 pl-3.5 text-xs font-medium text-neutral-900">
      <span>20% off for the first month</span>
      <span className="relative flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#fffefa] text-neutral-900 transition-[width,background-color,color] duration-300 ease-out group-hover:w-10 group-hover:bg-[#fe551a] group-hover:text-[#fffefa]">
        <ChevronRight
          aria-hidden
          className="absolute size-3 transition-[scale,opacity] duration-300 ease-out group-hover:scale-75 group-hover:opacity-0"
        />
        <ArrowRight
          aria-hidden
          className="absolute size-3 scale-75 opacity-0 transition-[scale,opacity] duration-300 ease-out group-hover:scale-100 group-hover:opacity-100"
        />
      </span>
    </DemoLink>
  );
}

function Hero() {
  return (
    // The real page keeps 64–80px under the button. Here the link back to the portfolio sits
    // in that strip, so the content stands a little higher to stay clear of it.
    <div className="relative flex h-dvh flex-col items-center justify-end overflow-hidden bg-white px-4 pb-28 text-center md:pb-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <svg
          className="h-full w-full"
          viewBox="0 0 1512 982"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <g clipPath="url(#torchbase-hero-clip)">
            <rect width="1512" height="982" fill="#fff" />
            <g filter="url(#torchbase-hero-glow)">
              <path
                d="M1382.36 626.132C1301.34 596.778 1163.08 531.52 767 504C767 504 320.634 564.977 232.616 626.132C144.597 687.288 -140.963 946.588 -140.963 946.588L-318 1419.63L-82.9506 2168.18L1364.85 2227.5L2059 1346.86C2059 1346.86 1463.37 655.487 1382.36 626.132Z"
                fill="#FE551A"
              />
            </g>
          </g>
          <defs>
            <filter
              id="torchbase-hero-glow"
              x="-849.2"
              y="-27.2"
              width="3439.4"
              height="2785.9"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="265.6"
                result="effect1_foregroundBlur"
              />
            </filter>
            <clipPath id="torchbase-hero-clip">
              <rect width="1512" height="982" />
            </clipPath>
          </defs>
        </svg>
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.55)_0,rgba(255,255,255,0.55)_1px,transparent_1px,transparent_10px)] opacity-[0.14] mix-blend-overlay"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-5 md:gap-6">
        <HeroWaitlistTag />

        {/* An h1 on the real site. Here the page around the piece already has one. */}
        <h2 className="text-4xl leading-tight font-medium tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl">
          God&apos;s blessing to your AI
        </h2>

        <p className="torchbase-secondary max-w-xl text-base leading-snug font-medium text-white/80 sm:text-lg">
          one workspace for teams to find issues, align on failures, and ship
          <br className="hidden sm:block" />
          fixes together. get agents to production faster
        </p>

        <DemoLink className="mt-1 inline-flex h-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#fffefa] to-[#f0ebe3] px-8 text-base font-medium text-neutral-900 transition-transform duration-150 hover:from-[#fffffd] hover:to-[#e8e2d8] active:scale-[0.97]">
          Get Started
        </DemoLink>
      </div>
    </div>
  );
}

export function TorchbaseLandingPreview() {
  return (
    <section
      className="torchbase-landing relative text-base antialiased"
      aria-label="Torchbase landing page"
    >
      <Navbar />
      <Hero />
    </section>
  );
}
