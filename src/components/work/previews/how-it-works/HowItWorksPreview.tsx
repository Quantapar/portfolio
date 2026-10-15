import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import {
  Buildings,
  Check,
  CreditCard,
  User,
  UsersThree,
} from "@phosphor-icons/react";
import "./how-it-works.css";

function supportsHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

const howItWorksCards = [
  {
    id: "subscribe",
    title: "Pick a plan & subscribe",
    description: (
      <>
        Pick a plan and we’ll invite you to Slack
        <br />
        to kick off on the same day.
      </>
    ),
  },
  {
    id: "updates",
    title: "48-Hours Updates",
    description: (
      <>
        Hand us the to-dos, or let us run the
        <br />
        show and keep things moving.
      </>
    ),
  },
  {
    id: "approval",
    title: "Approval & Repeat",
    description: (
      <>
        We’re not done until you say,
        <br />
        “yep, that’s perfect.”
      </>
    ),
  },
] as const;

const approvalFolderTheme = {
  backFill: "black",
  backInsetShadow: "inset 0 0 6px 2px rgba(255,255,255,0.37)",
  flapFill: "#292929",
  flapFillOpacity: 0.25,
  flapStroke: "#979797",
  flapInsetColor: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0",
  cardFill: "#F1F1F1",
  cardStroke: "#E0E0E0",
  cardLineFill: "#D4D4D4",
  cardInsetColor: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0",
} as const;

const approvalFolderPath =
  "M0 25C0 11.1929 11.1929 0 25 0H136.084C143.044 0 149.689 2.90139 154.42 8.00608L178.08 33.5343C182.811 38.639 189.456 41.5404 196.416 41.5404H296C309.807 41.5404 321 52.7333 321 66.5404V216C321 229.807 309.807 241 296 241H25C11.1929 241 0 229.807 0 216V25Z";

const approvalFolderMask = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 321 241"><path fill="white" d="${approvalFolderPath}"/></svg>`,
)}")`;

function ApprovalFolderCard({ id }: { id: number }) {
  const filterId = `approval-folder-card-${id}`;

  return (
    <svg
      className="approval-folder__card"
      width="164"
      height="214"
      viewBox="0 0 164 214"
      fill="none"
      aria-hidden="true"
    >
      <g filter={`url(#${filterId})`}>
        <rect
          width="163.078"
          height="213.262"
          rx="20"
          fill={approvalFolderTheme.cardFill}
        />
      </g>
      <rect
        x="0.5"
        y="0.5"
        width="162.078"
        height="212.262"
        rx="19.5"
        stroke={approvalFolderTheme.cardStroke}
      />
      <rect
        x="14.1"
        y="31.2"
        width="134.8"
        height="11.9"
        rx="5.95"
        fill={approvalFolderTheme.cardLineFill}
      />
      {Array.from({ length: 9 }, (_, row) => (
        <g key={row}>
          <rect
            x="14.8"
            y={61 + row * 14.1}
            width="64.5"
            height="5.9"
            rx="2.95"
            fill={approvalFolderTheme.cardLineFill}
          />
          <rect
            x="84.4"
            y={61 + row * 14.1}
            width="64.5"
            height="5.9"
            rx="2.95"
            fill={approvalFolderTheme.cardLineFill}
          />
        </g>
      ))}
      <defs>
        <filter
          id={filterId}
          x="0"
          y="0"
          width="166.1"
          height="218.3"
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
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="2"
            operator="erode"
            in="SourceAlpha"
            result={`approval-folder-erode-${id}`}
          />
          <feOffset dx="3" dy="5" />
          <feGaussianBlur stdDeviation="3.05" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values={approvalFolderTheme.cardInsetColor}
          />
          <feBlend mode="normal" in2="shape" />
        </filter>
      </defs>
    </svg>
  );
}

function ApprovalFolder() {
  const reduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 120, damping: 13 };

  return (
    <button
      className="approval-folder"
      type="button"
      aria-label={isOpen ? "Close approval folder" : "Open approval folder"}
      aria-expanded={isOpen}
      onPointerEnter={() => {
        if (supportsHover()) setIsHovered(true);
      }}
      onPointerLeave={() => {
        setIsHovered(false);
        setIsOpen(false);
      }}
      onClick={() => setIsOpen((open) => !open)}
    >
      <span className="approval-folder__canvas">
        <span
          className="approval-folder__back"
          style={{
            backgroundColor: approvalFolderTheme.backFill,
            boxShadow: approvalFolderTheme.backInsetShadow,
          }}
        />

        <span className="approval-folder__cards">
          <motion.span
            className="approval-folder__card-wrap"
            animate={{
              transform: `translate3d(${isOpen ? 70 : 40}px, ${
                isOpen ? -160 : isHovered ? -30 : -10
              }px, 0) rotate(${isOpen ? 18 : isHovered ? 14 : 10}deg)`,
            }}
            transition={{
              ...spring,
              delay: isOpen ? 0.1 : isHovered ? 0.12 : 0,
            }}
          >
            <ApprovalFolderCard id={1} />
          </motion.span>
          <motion.span
            className="approval-folder__card-wrap"
            animate={{
              transform: `translate3d(${isOpen ? 0 : 3}px, ${
                isOpen ? -180 : isHovered ? -35 : -20
              }px, 0) rotate(${isOpen ? -3 : isHovered ? -1 : 2}deg)`,
            }}
            transition={{
              ...spring,
              delay: isOpen ? 0.05 : isHovered ? 0.06 : 0,
            }}
          >
            <ApprovalFolderCard id={2} />
          </motion.span>
          <motion.span
            className="approval-folder__card-wrap"
            animate={{
              transform: `translate3d(${isOpen ? -65 : -40}px, ${
                isOpen ? -170 : isHovered ? -44 : -22
              }px, 0) rotate(${isOpen ? -14 : isHovered ? -9 : -5}deg)`,
            }}
            transition={spring}
          >
            <ApprovalFolderCard id={3} />
          </motion.span>
        </span>

        <motion.span
          className="approval-folder__flap"
          animate={{
            transform: `translate3d(-50%, -50%, 0) rotateX(${
              isOpen ? -55 : isHovered ? -45 : -15
            }deg)`,
          }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 120, damping: 14 }
          }
        >
          <span
            className="approval-folder__blur-clip"
            style={{
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              backgroundColor: "rgba(41,41,41,0.01)",
              clipPath: `path('${approvalFolderPath}')`,
              WebkitClipPath: `path('${approvalFolderPath}')`,
              maskImage: approvalFolderMask,
              WebkitMaskImage: approvalFolderMask,
              maskPosition: "center",
              WebkitMaskPosition: "center",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              willChange: "transform",
            }}
          />
          <svg
            className="approval-folder__flap-art"
            width="321"
            height="241"
            viewBox="0 0 321 241"
            fill="none"
            aria-hidden="true"
          >
            <g filter="url(#approval-folder-flap-inset)">
              <path
                d={approvalFolderPath}
                fill={approvalFolderTheme.flapFill}
                fillOpacity={approvalFolderTheme.flapFillOpacity}
              />
              <path
                d="M25 0.5H136.084C142.905 0.5 149.417 3.3431 154.054 8.3457L177.713 33.874C182.539 39.0808 189.317 42.04 196.416 42.04H296C309.531 42.04 320.5 53.0092 320.5 66.54V216C320.5 229.531 309.531 240.5 296 240.5H25C11.469 240.5 0.5 229.531 0.5 216V25C0.5 11.469 11.469 0.5 25 0.5Z"
                stroke={approvalFolderTheme.flapStroke}
              />
            </g>
            <defs>
              <filter
                id="approval-folder-flap-inset"
                x="-25.4"
                y="-25.4"
                width="371.8"
                height="291.8"
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
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feGaussianBlur stdDeviation="2.65" />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                />
                <feColorMatrix
                  type="matrix"
                  values={approvalFolderTheme.flapInsetColor}
                />
                <feBlend mode="normal" in2="shape" />
              </filter>
            </defs>
          </svg>
        </motion.span>
      </span>
    </button>
  );
}

const planOptions = [
  { id: "A", label: "Individual plan", Icon: User },
  { id: "B", label: "Team plan", Icon: UsersThree },
  { id: "C", label: "Business plan", Icon: Buildings },
] as const;

type PlanOption = (typeof planOptions)[number]["id"];

function AnimatedPlanPicker() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const [activePlan, setActivePlan] = useState<PlanOption | null>("B");
  const activePlanRef = useRef<PlanOption | null>("B");
  const pointerRef = useRef<HTMLSpanElement>(null);
  const optionRefs = useRef<Record<PlanOption, HTMLSpanElement | null>>({
    A: null,
    B: null,
    C: null,
  });

  useEffect(() => {
    if (reduceMotion) return;

    let cancelled = false;
    let timerId: number | undefined;
    let hoverFrameId: number | undefined;
    let pointerAnimation: ReturnType<typeof animate> | undefined;
    let pointerArcAnimation: ReturnType<typeof animate> | undefined;

    const wait = (duration: number) =>
      new Promise<void>((resolve) => {
        timerId = window.setTimeout(resolve, duration);
      });

    const movePointer = (
      target: number,
      duration: number,
      avoidMiddle = false,
    ) =>
      new Promise<void>((resolve) => {
        const requiredCompletions = avoidMiddle ? 2 : 1;
        let completedAnimations = 0;
        const finishMovement = () => {
          completedAnimations += 1;
          if (completedAnimations === requiredCompletions) resolve();
        };

        if (avoidMiddle) {
          pointerArcAnimation = animate(pointerY, [0, 20, 0], {
            type: "tween",
            duration,
            ease: [0.645, 0.045, 0.355, 1],
            times: [0, 0.5, 1],
            onComplete: finishMovement,
          });

          const watchForAHit = () => {
            if (cancelled) return;

            const pointerSvg = pointerRef.current?.querySelector("svg");
            const pointerMatrix = pointerSvg?.getScreenCTM();
            const optionBounds = optionRefs.current.A?.getBoundingClientRect();
            const pointerTip = pointerMatrix
              ? new DOMPoint(1.75, 1.7).matrixTransform(pointerMatrix)
              : null;
            const isOverA =
              pointerTip &&
              optionBounds &&
              pointerTip.x >= optionBounds.left &&
              pointerTip.x <= optionBounds.right &&
              pointerTip.y >= optionBounds.top &&
              pointerTip.y <= optionBounds.bottom;

            if (isOverA) {
              if (activePlanRef.current !== "A") {
                activePlanRef.current = "A";
                flushSync(() => setActivePlan("A"));
              }
              return;
            }

            hoverFrameId = window.requestAnimationFrame(watchForAHit);
          };

          hoverFrameId = window.requestAnimationFrame(watchForAHit);
        }

        pointerAnimation = animate(pointerX, target, {
          type: "tween",
          duration,
          ease: [0.645, 0.045, 0.355, 1],
          onUpdate: (position) => {
            if (avoidMiddle && activePlanRef.current === "A") return;

            const isOverPlanRow = Math.abs(pointerY.get()) <= 10;
            const nextPlan = avoidMiddle
              ? position <= -82 && Math.abs(pointerY.get()) <= 8
                ? "A"
                : isOverPlanRow && Math.abs(position - 90) <= 24
                  ? "C"
                  : null
              : isOverPlanRow && Math.abs(position + 90) <= 24
                ? "A"
                : isOverPlanRow && Math.abs(position) <= 24
                  ? "B"
                  : isOverPlanRow && Math.abs(position - 90) <= 24
                    ? "C"
                    : null;

            if (nextPlan !== activePlanRef.current) {
              activePlanRef.current = nextPlan;
              if (nextPlan === "A") {
                flushSync(() => setActivePlan("A"));
              } else {
                setActivePlan(nextPlan);
              }
            }
          },
          onComplete: finishMovement,
        });
      });

    const runLoop = async () => {
      while (!cancelled) {
        await wait(1100);
        if (cancelled) return;
        await movePointer(90, 0.9);
        if (cancelled) return;

        await wait(950);
        if (cancelled) return;
        await movePointer(-90, 1.4, true);
        if (cancelled) return;
        while (!cancelled && activePlanRef.current !== "A") {
          await wait(16);
        }
        if (cancelled) return;

        await wait(950);
        if (cancelled) return;
        await movePointer(0, 0.9);
        if (cancelled) return;
      }
    };

    void runLoop();

    return () => {
      cancelled = true;
      if (timerId !== undefined) window.clearTimeout(timerId);
      if (hoverFrameId !== undefined) {
        window.cancelAnimationFrame(hoverFrameId);
      }
      pointerAnimation?.stop();
      pointerArcAnimation?.stop();
    };
  }, [pointerX, pointerY, reduceMotion]);

  return (
    <div className="how-plan-picker" aria-hidden="true">
      <svg
        className="how-plan-picker__connector"
        viewBox="0 0 220 54"
        preserveAspectRatio="none"
      >
        <path d="M110 0v17" />
        <path d="M110 17C110 29 20 22 20 40v14" />
        <path d="M110 17v37" />
        <path d="M110 17c0 12 90 5 90 23v14" />
      </svg>
      {planOptions.map(({ id, label, Icon }) => {
        const isActive = id === activePlan;

        return (
          <motion.span
            className="how-plan-picker__option"
            data-active={isActive}
            aria-label={label}
            ref={(element) => {
              optionRefs.current[id] = element;
            }}
            animate={{
              transform: isActive
                ? "translate3d(0, -2px, 0)"
                : "translate3d(0, 0, 0)",
            }}
            transition={{
              duration: 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            key={id}
          >
            <motion.span
              className="how-plan-picker__active"
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                transform: isActive
                  ? "scale3d(1, 1, 1)"
                  : "scale3d(0.92, 0.92, 1)",
              }}
              transition={{
                duration: 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
            <span className="how-plan-picker__label">
              <Icon weight="bold" />
            </span>
          </motion.span>
        );
      })}
      <motion.span
        className="how-plan-picker__pointer"
        ref={pointerRef}
        style={{ x: pointerX, y: pointerY, rotate: -8 }}
      >
        <svg viewBox="0 0 18 20" fill="none">
          <path
            d="M1.75 1.7 16.1 10.45 9.35 11.72 5.2 17.9 1.75 1.7Z"
            fill="currentColor"
            stroke="#fff"
            strokeLinejoin="round"
            strokeWidth="1.35"
          />
        </svg>
      </motion.span>
    </div>
  );
}

function HowItWorksIllustration({
  card,
}: {
  card: (typeof howItWorksCards)[number]["id"];
}) {
  if (card === "subscribe") {
    return (
      <div className="how-card__illustration how-card__illustration--subscribe">
        <div className="how-subscribe">
          <div className="how-subscribe__brand">
            <span className="how-subscribe__mark" aria-hidden="true">
              <CreditCard weight="duotone" />
            </span>
            <span className="how-subscribe__copy" aria-hidden="true">
              <span />
              <span />
            </span>
          </div>
          <span className="how-subscribe__button">Subscribe</span>
        </div>

        <AnimatedPlanPicker />
      </div>
    );
  }

  if (card === "updates") {
    return (
      <div className="how-card__illustration how-card__illustration--updates">
        <div className="how-update-row how-update-row--top">
          <span className="how-update-row__message how-update-row__message--short" />
          <span className="how-avatar how-avatar--one" />
        </div>
        <div className="how-update-row how-update-row--first">
          <span className="how-avatar how-avatar--three" aria-hidden="true" />
          <span className="how-update-row__message" />
        </div>
        <div className="how-update-row how-update-row--second">
          <span className="how-update-row__status">😍</span>
          <span className="how-avatar how-avatar--two" />
        </div>
        <div className="how-update-row how-update-row--third">
          <span className="how-avatar how-avatar--three" aria-hidden="true" />
          <span className="how-update-row__message" />
        </div>
        <span className="how-update-button">48-Hours Update</span>
      </div>
    );
  }

  return (
    <div className="how-card__illustration how-card__illustration--approval">
      <ApprovalFolder />
      <span className="how-approval__complete" aria-hidden="true">
        <Check weight="bold" />
      </span>
    </div>
  );
}

function StepCallout({ step, className }: { step: number; className: string }) {
  return (
    <div className={`how-it-works__step ${className}`} aria-hidden="true">
      <span>Step {step}</span>
      <svg viewBox="0 0 52 50">
        <path d="M3 5C28 3 40 17 39 39" />
        <path d="m31 32 8 8 7-9" />
      </svg>
    </div>
  );
}

export function HowItWorksPreview() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="how-it-works-demo"
      className="how-it-works-stage"
      aria-labelledby="how-it-works-title"
    >
      <header className="how-it-works__header">
        <h2 id="how-it-works-title">Fast &amp; Easy</h2>
      </header>

      <div className="how-it-works__cards">
        <StepCallout step={1} className="how-it-works__step--one" />
        <StepCallout step={2} className="how-it-works__step--two" />
        <StepCallout step={3} className="how-it-works__step--three" />

        {howItWorksCards.map((card, index) => (
          <motion.article
            className={`how-card how-card--${card.id}`}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    transform: "translate3d(0, 22px, 0) scale(0.98)",
                  }
            }
            whileInView={{
              opacity: 1,
              transform: "translate3d(0, 0, 0) scale(1)",
            }}
            viewport={{ once: true, amount: 0.45 }}
            transition={
              reduceMotion
                ? { duration: 0.16, delay: index * 0.04 }
                : {
                    type: "spring",
                    duration: 0.52,
                    bounce: 0.14,
                    delay: index * 0.08,
                  }
            }
            key={card.id}
          >
            <h3>{card.title}</h3>
            <HowItWorksIllustration card={card.id} />
            <p>{card.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

