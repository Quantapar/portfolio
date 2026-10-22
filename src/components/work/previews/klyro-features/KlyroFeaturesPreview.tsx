import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  lazy,
  Suspense,
  useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./klyro-features.css";

// The chart pulls in a charting library, so it loads only when this piece is opened.
const KlyroFocusAreaChart = lazy(() => import("./KlyroFocusAreaChart"));

function CompanyLogo({
  domain,
  name,
  fallback,
}: {
  domain: string;
  name: string;
  fallback: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const token = process.env.NEXT_PUBLIC_LOGO_DEV_KEY?.trim();

  if (!token || failed) return fallback;

  const src = `https://img.logo.dev/${domain}?token=${encodeURIComponent(token)}&size=64&retina=true&format=png&theme=light&fallback=404`;

  return (
    <img
      className="klyro-logo"
      src={src}
      alt=""
      title={name}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export function KlyroFeaturesPreview() {
  const reduceMotion = useReducedMotion();
  const handleCardPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = x - centerX;
    const deltaY = y - centerY;
    const scaleX = deltaX === 0 ? Infinity : centerX / Math.abs(deltaX);
    const scaleY = deltaY === 0 ? Infinity : centerY / Math.abs(deltaY);
    const edgeProximity = Math.min(
      Math.max(1 / Math.min(scaleX, scaleY), 0),
      1,
    );
    const glowOpacity = Math.max(0, (edgeProximity - 0.3) / 0.7);
    const cursorAngle =
      ((Math.atan2(deltaY, deltaX) * 180) / Math.PI + 450) % 360;

    card.style.setProperty(
      "--edge-proximity",
      (edgeProximity * 100).toFixed(3),
    );
    card.style.setProperty("--glow-opacity", glowOpacity.toFixed(3));
    card.style.setProperty("--cursor-angle", `${cursorAngle.toFixed(3)}deg`);
  };

  const clearCardGlow = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--edge-proximity", "0");
    event.currentTarget.style.setProperty("--glow-opacity", "0");
  };

  const glowHandlers = {
    onPointerMove: handleCardPointerMove,
    onPointerLeave: clearCardGlow,
  };

  return (
    <section
      id="klyro-features-demo"
      className="klyro-features"
      aria-labelledby="klyro-features-title"
    >
      <header className="klyro-features__header">
        <h2 id="klyro-features-title">Product Features</h2>
        <p>
          Klyro keeps focused work, connected tools, and every project moving
          <br />
          inside one calm workspace.
        </p>
      </header>

      <motion.div
        className="klyro-bento-shell"
        initial={
          reduceMotion
            ? { opacity: 0 }
            : {
                opacity: 0,
                transform: "translate3d(0, 24px, 0) scale(0.985)",
              }
        }
        whileInView={{
          opacity: 1,
          transform: "translate3d(0, 0, 0) scale(1)",
        }}
        // On a phone the cards stack into a column taller than the screen, and a short screen never
        // shows a third of it at once. A smaller share lets it appear on load there too.
        viewport={{ once: true, amount: 0.15 }}
        transition={
          reduceMotion
            ? { duration: 0.16 }
            : { type: "spring", duration: 0.62, bounce: 0.12 }
        }
      >
        <article
          className="klyro-feature klyro-feature--automation"
          {...glowHandlers}
        >
          <span className="klyro-feature__mark" aria-hidden="true">
            <svg
              className="klyro-feature__brand-mark"
              viewBox="0 0 220 188"
              fill="none"
            >
              <path
                d="M0 0h80v66.5c0 6.8 8.7 9.6 12.7 4.1L142 0h78c-14.6 52.2-58.1 86-110 86S14.6 52.2 0 0Z"
                fill="currentColor"
              />
              <path
                d="M0 188c14.6-52.2 58.1-86 110-86s95.4 33.8 110 86h-78l-49.3-70.6c-4-5.5-12.7-2.7-12.7 4.1V188H0Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <div className="klyro-feature__copy">
            <h3>Flow Automations</h3>
            <p>
              Turn repeatable work into reliable flows that assign owners,
              update timelines, and clear the busywork automatically.
            </p>
          </div>
          <button className="klyro-feature__cta" type="button">
            Explore workflows
            <span aria-hidden="true">→</span>
          </button>
        </article>

        <article
          className="klyro-feature klyro-feature--integrations"
          {...glowHandlers}
        >
          <div>
            <h3>Tools Connected</h3>
            <p>08 live integrations</p>
          </div>
          <div className="klyro-integrations">
            <span role="img" aria-label="Slack logo">
              <CompanyLogo
                domain="slack.com"
                name="Slack"
                fallback={
                  <svg
                    className="klyro-logo klyro-logo--slack"
                    viewBox="0 0 127 127"
                    aria-hidden="true"
                  >
                    <path
                      d="M27.2 80c0 7.3-5.9 13.2-13.2 13.2C6.7 93.2.8 87.3.8 80c0-7.3 5.9-13.2 13.2-13.2h13.2V80zm6.6 0c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2v33c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V80z"
                      fill="#e01e5a"
                    />
                    <path
                      d="M47 27c-7.3 0-13.2-5.9-13.2-13.2C33.8 6.5 39.7.6 47 .6c7.3 0 13.2 5.9 13.2 13.2V27H47zm0 6.7c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H13.9C6.6 60.1.7 54.2.7 46.9c0-7.3 5.9-13.2 13.2-13.2H47z"
                      fill="#36c5f0"
                    />
                    <path
                      d="M99.9 46.9c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H99.9V46.9zm-6.6 0c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V13.8C66.9 6.5 72.8.6 80.1.6c7.3 0 13.2 5.9 13.2 13.2v33.1z"
                      fill="#2eb67d"
                    />
                    <path
                      d="M80.1 99.8c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V99.8h13.2zm0-6.6c-7.3 0-13.2-5.9-13.2-13.2 0-7.3 5.9-13.2 13.2-13.2h33.1c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H80.1z"
                      fill="#ecb22e"
                    />
                  </svg>
                }
              />
            </span>
            <span role="img" aria-label="Figma logo">
              <svg
                className="klyro-logo klyro-logo--figma"
                viewBox="0 0 38 57"
                aria-hidden="true"
              >
                <path fill="#f24e1e" d="M9.5 0H19v19H9.5a9.5 9.5 0 1 1 0-19Z" />
                <path fill="#ff7262" d="M19 0h9.5a9.5 9.5 0 1 1 0 19H19V0Z" />
                <path
                  fill="#a259ff"
                  d="M9.5 19H19v19H9.5a9.5 9.5 0 1 1 0-19Z"
                />
                <path
                  fill="#1abcfe"
                  d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z"
                />
                <path fill="#0acf83" d="M9.5 38H19v9.5A9.5 9.5 0 1 1 9.5 38Z" />
              </svg>
            </span>
            <span role="img" aria-label="Notion logo">
              <CompanyLogo
                domain="notion.so"
                name="Notion"
                fallback={
                  <svg
                    className="klyro-logo klyro-logo--notion"
                    viewBox="0 0 100 100"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6.017 4.313 61.35.226c6.797-.583 8.543-.19 12.817 2.917L91.83 15.586c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277-1.553 6.807-6.99 7.193l-64.256 3.892c-4.08.193-6.023-.39-8.16-3.113L3.3 79.94C.967 76.827 0 74.497 0 71.773v-60.66c0-3.497 1.553-6.413 6.017-6.8Z"
                      fill="#fff"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="m61.35.227-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257-3.89c5.433-.387 6.99-2.917 6.99-7.193V20.64c0-2.21-.873-2.847-3.443-4.733L74.167 3.143C69.894.036 68.147-.357 61.35.227ZM25.92 19.523c-5.247.353-6.437.433-9.417-1.99l-7.576-6.026c-.77-.78-.383-1.753 1.557-1.947l53.193-3.887c4.467-.39 6.793 1.167 8.54 2.527l9.123 6.61c.39.197 1.36 1.36.193 1.36L26.6 19.477l-.68.047ZM19.803 88.3V30.367c0-2.53.777-3.697 3.103-3.893L86 22.78c2.14-.193 3.107 1.167 3.107 3.693V84.02c0 2.53-.39 4.67-3.883 4.863l-60.377 3.5c-3.493.193-5.043-.97-5.043-4.083Zm59.6-54.827c.387 1.75 0 3.5-1.75 3.7l-2.91.577v42.773c-2.527 1.36-4.853 2.137-6.797 2.137-3.107 0-3.883-.973-6.21-3.887l-19.03-29.94V77.8l6.02 1.363s0 3.5-4.857 3.5l-13.39.777c-.39-.78 0-2.723 1.357-3.11l3.497-.97v-38.3l-4.853-.393c-.39-1.75.58-4.277 3.3-4.473l14.367-.967 19.8 30.327v-26.83l-5.047-.58c-.39-2.143 1.163-3.7 3.103-3.89l13.4-.78Z"
                      fill="#000"
                    />
                  </svg>
                }
              />
            </span>
          </div>
        </article>

        <article
          className="klyro-feature klyro-feature--focus"
          {...glowHandlers}
        >
          <div className="klyro-focus__heading">
            <div>
              <h3>Deep Focus</h3>
              <p>Attention analytics</p>
            </div>
            <span>Weekly signal</span>
          </div>
          <strong>64%</strong>
          <div className="klyro-focus__chart" aria-hidden="true">
            <Suspense fallback={null}>
              <KlyroFocusAreaChart reduceMotion={Boolean(reduceMotion)} />
            </Suspense>
          </div>
        </article>

        <article
          className="klyro-feature klyro-feature--shortcut"
          {...glowHandlers}
        >
          <span className="klyro-shortcut__key" aria-hidden="true">
            <b>⌘</b>
            <i>+</i>
            <b>⌥</b>
          </span>
          <div>
            <h3>Quick Capture</h3>
            <p>Turn any thought into an organized task.</p>
          </div>
        </article>

        <article
          className="klyro-feature klyro-feature--velocity"
          {...glowHandlers}
        >
          <div className="klyro-velocity__dots" aria-hidden="true" />
          <strong>3.4×</strong>
          <div className="klyro-velocity__copy">
            <h3>Faster shipping</h3>
            <p>
              Keep decisions, priorities, and progress visible so teams spend
              less time coordinating and more time finishing.
            </p>
          </div>
        </article>
      </motion.div>
    </section>
  );
}

