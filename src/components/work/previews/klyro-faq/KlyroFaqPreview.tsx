import { type FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import faqIllustration from "./faq-illustration-transparent.png";
import "./klyro-faq.css";

const klyroFaqs = [
  {
    id: "workspace",
    question: "What is Klyro designed to replace?",
    answer:
      "Klyro brings project updates, focused work, lightweight planning, and team coordination into one calm workspace instead of scattering them across disconnected tools.",
  },
  {
    id: "integrations",
    question: "Can I connect the tools my team already uses?",
    answer:
      "Yes. Klyro connects with the tools your team already relies on, so updates can move between systems without creating another manual handoff.",
  },
  {
    id: "automations",
    question: "How do Flow Automations work?",
    answer:
      "Choose a trigger, define the next action, and assign an owner. Klyro then moves routine work forward while keeping every step visible.",
  },
  {
    id: "focus",
    question: "How does Klyro protect focused work?",
    answer:
      "Deep Focus groups updates, reduces unnecessary interruptions, and makes priorities clear before your team starts a focused session.",
  },
  {
    id: "teams",
    question: "Is Klyro useful for smaller teams?",
    answer:
      "Yes. Klyro is designed to stay lightweight for small teams while giving growing teams enough structure to keep work clear and accountable.",
  },
] as const;

type KlyroAiPhase = "idle" | "thinking" | "streaming" | "done";

function getKlyroAiAnswer(question: string) {
  const normalizedQuestion = question.toLowerCase();

  if (
    normalizedQuestion.includes("connect") ||
    normalizedQuestion.includes("integration") ||
    normalizedQuestion.includes("tool")
  ) {
    return "Klyro connects with the tools your team already uses, bringing their updates into one calm workspace without adding another manual handoff.";
  }

  if (
    normalizedQuestion.includes("automation") ||
    normalizedQuestion.includes("flow") ||
    normalizedQuestion.includes("routine")
  ) {
    return "Flow Automations move routine work forward from a trigger to the right action and owner, while every step stays visible to the team.";
  }

  if (
    normalizedQuestion.includes("focus") ||
    normalizedQuestion.includes("notification") ||
    normalizedQuestion.includes("interrupt")
  ) {
    return "Deep Focus groups updates and quiets unnecessary interruptions, so priorities stay clear while your team works through its most important tasks.";
  }

  if (
    normalizedQuestion.includes("small") ||
    normalizedQuestion.includes("team") ||
    normalizedQuestion.includes("scale")
  ) {
    return "Klyro stays lightweight for small teams and adds structure as they grow, keeping ownership, priorities, and project updates clear in one place.";
  }

  return "Klyro brings planning, project updates, automations, and focused work into one shared workspace, turning scattered activity into clear priorities and next steps.";
}

export function KlyroFaqPreview() {
  const reduceMotion = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<string | null>("workspace");
  const [faqQuestion, setFaqQuestion] = useState("");
  const [aiPhase, setAiPhase] = useState<KlyroAiPhase>("idle");
  const [aiAnswer, setAiAnswer] = useState("");
  const [streamedAnswer, setStreamedAnswer] = useState("");
  const aiIsActive = aiPhase === "thinking" || aiPhase === "streaming";

  useEffect(() => {
    if (aiPhase !== "thinking") return;

    const thinkingTimer = window.setTimeout(() => {
      if (reduceMotion) {
        setStreamedAnswer(aiAnswer);
        setAiPhase("done");
        return;
      }

      setStreamedAnswer(aiAnswer.split(/\s+/)[0] ?? "");
      setAiPhase("streaming");
    }, 450);

    return () => window.clearTimeout(thinkingTimer);
  }, [aiAnswer, aiPhase, reduceMotion]);

  useEffect(() => {
    if (aiPhase !== "streaming") return;

    const words = aiAnswer.split(/\s+/);
    const startedAt = performance.now();
    let shownWordCount = 1;
    let animationFrame = 0;

    const streamNextWords = (now: number) => {
      const nextWordCount = Math.min(
        words.length,
        Math.floor((now - startedAt) / 48) + 1,
      );

      if (nextWordCount !== shownWordCount) {
        shownWordCount = nextWordCount;
        setStreamedAnswer(words.slice(0, shownWordCount).join(" "));
      }

      if (shownWordCount >= words.length) {
        setAiPhase("done");
        return;
      }

      animationFrame = window.requestAnimationFrame(streamNextWords);
    };

    animationFrame = window.requestAnimationFrame(streamNextWords);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [aiAnswer, aiPhase]);

  const stopAiResponse = () => {
    setAiPhase(streamedAnswer.trim() ? "done" : "idle");
  };

  const handleAiSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (aiIsActive) {
      stopAiResponse();
      return;
    }

    const question = faqQuestion.trim();
    if (!question) return;

    setFaqQuestion(question);
    setOpenFaq(null);
    setAiAnswer(getKlyroAiAnswer(question));
    setStreamedAnswer("");
    setAiPhase("thinking");
  };

  const handleFaqToggle = (id: string) => {
    setAiPhase("idle");
    setStreamedAnswer("");
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section
      id="klyro-faq-demo"
      className="klyro-faq"
      aria-labelledby="klyro-faq-title"
    >
      <div className="klyro-faq__shell">
        <aside className="klyro-faq__intro">
          <h2 id="klyro-faq-title">FAQ’s</h2>
          <img
            src={faqIllustration.src}
            alt="Illustration of a puzzled person reading a document"
          />
        </aside>

        <div className="klyro-faq__list">
          {klyroFaqs.map((item) => {
            const isOpen = openFaq === item.id;
            const answerId = `klyro-faq-answer-${item.id}`;

            return (
              <div className="klyro-faq__item" key={item.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => handleFaqToggle(item.id)}
                >
                  <span>{item.question}</span>
                  <motion.span
                    className="klyro-faq__toggle"
                    aria-hidden="true"
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 500,
                            damping: 38,
                            mass: 0.6,
                          }
                    }
                  >
                    <motion.span
                      className="klyro-faq__toggle-line"
                      animate={{
                        opacity: isOpen ? 0 : 1,
                        scaleX: isOpen ? 0.25 : 1,
                      }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : {
                              duration: 0.18,
                              ease: [0.16, 1, 0.3, 1],
                          }
                      }
                    />
                    <span className="klyro-faq__toggle-line klyro-faq__toggle-line--vertical" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={answerId}
                      className="klyro-faq__answer"
                      initial={
                        reduceMotion
                          ? { opacity: 1 }
                          : { height: 0, opacity: 0 }
                      }
                      animate={{ height: "auto", opacity: 1 }}
                      exit={
                        reduceMotion
                          ? { opacity: 0 }
                          : { height: 0, opacity: 0 }
                      }
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : {
                              height: {
                                duration: 0.28,
                                ease: [0.32, 0.72, 0, 1],
                              },
                              opacity: { duration: 0.18, ease: "easeOut" },
                            }
                      }
                    >
                      <p>{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          <form
            className="klyro-faq__ask"
            data-state={aiPhase}
            aria-busy={aiIsActive}
            onSubmit={handleAiSubmit}
          >
            <input
              type="text"
              value={faqQuestion}
              onChange={(event) => setFaqQuestion(event.target.value)}
              readOnly={aiIsActive}
              placeholder="Ask Klyro AI a question..."
              aria-label="Ask Klyro AI a question"
              aria-describedby={
                aiPhase === "idle" ? undefined : "klyro-ai-response"
              }
            />
            <motion.button
              type="submit"
              aria-label={aiIsActive ? "Stop response" : "Send question"}
              disabled={!aiIsActive && !faqQuestion.trim()}
              whileTap={
                reduceMotion || (!aiIsActive && !faqQuestion.trim())
                  ? undefined
                  : { scale: 0.97 }
              }
              transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            >
              <AnimatePresence initial={false} mode="wait">
                {aiIsActive ? (
                  <motion.svg
                    key="stop"
                    className="klyro-faq__stop-icon"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <rect
                      x="5.75"
                      y="5.75"
                      width="8.5"
                      height="8.5"
                      rx="1.6"
                    />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="send"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <path d="m5.5 14.5 9-9m-6.25 0h6.25v6.25" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>

            <AnimatePresence initial={false}>
              {aiPhase !== "idle" && (
                <motion.div
                  id="klyro-ai-response"
                  className="klyro-faq__ai-response"
                  initial={
                    reduceMotion ? false : { height: 0, opacity: 0 }
                  }
                  animate={{ height: "auto", opacity: 1 }}
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { height: 0, opacity: 0 }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : {
                          height: {
                            duration: 0.28,
                            ease: [0.32, 0.72, 0, 1],
                          },
                          opacity: { duration: 0.18, ease: "easeOut" },
                        }
                  }
                >
                  <div className="klyro-faq__ai-response-inner">
                    <p
                      className="klyro-faq__streamed-answer klyro-faq__answer-sizer"
                      aria-hidden="true"
                    >
                      {aiAnswer}
                    </p>

                    <AnimatePresence initial={false} mode="wait">
                      {aiPhase === "thinking" ? (
                        <motion.span
                          key="thinking"
                          className="klyro-faq__thinking"
                          role="status"
                          initial={reduceMotion ? false : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: reduceMotion ? 0 : 0.16,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          Thinking…
                        </motion.span>
                      ) : (
                        <motion.p
                          key="answer"
                          className="klyro-faq__streamed-answer"
                          initial={reduceMotion ? false : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: reduceMotion ? 0 : 0.18,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          {streamedAnswer}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {aiPhase === "done" && (
                      <span
                        className="klyro-faq__response-status"
                        role="status"
                      >
                        Answer complete.
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </section>
  );
}

