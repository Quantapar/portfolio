import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowCounterClockwise, CheckFat, PencilSimple, X } from "@phosphor-icons/react";
import "./signature.css";

const signatureLabelTransition = {
  duration: 0.18,
  ease: [0.23, 1, 0.32, 1] as const,
};


type ReferenceSignatureState = "idle" | "signing" | "complete";

const referenceSignatureSpring = {
  type: "spring",
  duration: 0.42,
  bounce: 0.22,
} as const;

const referenceBorderSpring = {
  type: "spring",
  duration: 0.5,
  bounce: 0.28,
} as const;

const referenceSignatureExit = {
  duration: 0.36,
  ease: [0.32, 0.72, 0, 1] as const,
};

function SignatureGlyph() {
  return (
    <img
      alt=""
      className="reference-signature__glyph"
      draggable={false}
      src="https://img.icons8.com/fluency-systems-filled/48/sign-up.png"
    />
  );
}

export function SignaturePreview() {
  const reduceMotion = useReducedMotion();
  const [state, setState] = useState<ReferenceSignatureState>("idle");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pencilRef = useRef<HTMLSpanElement>(null);
  const drawingRef = useRef(false);
  const hasInkRef = useRef(false);
  const previousPointRef = useRef<{ x: number; y: number } | null>(null);
  const savedSignatureRef = useRef<string | null>(null);

  const isSigning = state === "signing";

  const movePencil = (x: number, y: number) => {
    const pencil = pencilRef.current;
    if (!pencil) return;
    pencil.style.opacity = "1";
    pencil.style.transform = `translate3d(${x - 2}px, ${y - 16}px, 0)`;
  };

  const hidePencil = () => {
    if (pencilRef.current) pencilRef.current.style.opacity = "0";
  };

  useLayoutEffect(() => {
    if (!isSigning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const frame = window.requestAnimationFrame(() => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * pixelRatio);
      canvas.height = Math.round(rect.height * pixelRatio);

      const context = canvas.getContext("2d");
      if (!context) return;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = 2.65;
      context.strokeStyle = "#111111";
      context.fillStyle = "#111111";
      if (pencilRef.current) {
        pencilRef.current.style.opacity = "0";
        pencilRef.current.style.transform = `translate3d(${rect.width * 0.58 - 2}px, ${rect.height * 0.48 - 16}px, 0)`;
      }

      if (savedSignatureRef.current) {
        const image = new Image();
        image.onload = () => {
          context.drawImage(image, 0, 0, rect.width, rect.height);
        };
        image.src = savedSignatureRef.current;
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isSigning]);

  const pointFromEvent = (
    canvas: HTMLCanvasElement,
    event: { clientX: number; clientY: number },
  ) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const canvas = event.currentTarget;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.setPointerCapture(event.pointerId);
    const point = pointFromEvent(canvas, event);
    drawingRef.current = true;
    previousPointRef.current = point;
    movePencil(point.x, point.y);

    context.beginPath();
    context.arc(point.x, point.y, 1.08, 0, Math.PI * 2);
    context.fill();
    hasInkRef.current = true;
  };

  const continueDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const point = pointFromEvent(canvas, event);
    movePencil(point.x, point.y);
    if (!drawingRef.current) return;

    const context = canvas.getContext("2d");
    const previousPoint = previousPointRef.current;
    if (!context || !previousPoint) return;

    const samples = event.nativeEvent.getCoalescedEvents?.() ?? [
      event.nativeEvent,
    ];
    let previous = previousPoint;

    for (const sample of samples) {
      const current = pointFromEvent(canvas, sample);
      context.beginPath();
      context.moveTo(previous.x, previous.y);
      context.quadraticCurveTo(previous.x, previous.y, current.x, current.y);
      context.stroke();
      previous = current;
    }

    previousPointRef.current = previous;
  };

  const stopDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = false;
    previousPointRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const clearSignature = () => {
    savedSignatureRef.current = null;
    hasInkRef.current = false;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
    if (pencilRef.current) pencilRef.current.style.opacity = "0";
  };

  const startSigning = () => {
    savedSignatureRef.current = null;
    hasInkRef.current = false;
    setState("signing");
  };

  const finishSigning = () => {
    if (!hasInkRef.current) {
      savedSignatureRef.current = null;
      setState("idle");
      return;
    }

    savedSignatureRef.current =
      canvasRef.current?.toDataURL("image/png") ?? null;
    setState("complete");
  };

  const closeSigning = () => {
    savedSignatureRef.current = null;
    hasInkRef.current = false;
    setState("idle");
  };

  return (
    <section
      id="signature-animation-reference"
      className="reference-signature-stage"
      aria-label="Interactive signature animation"
    >
      <div className="reference-signature">
        <AnimatePresence initial={false}>
          {isSigning && (
            <motion.div
              id="reference-signature-panel"
              className="reference-signature__panel"
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      transform:
                        "translate3d(-50%, -35%, 0) scale3d(0.96, 0.86, 1)",
                    }
              }
              animate={{
                opacity: 1,
                transform: "translate3d(-50%, -50%, 0) scale3d(1, 1, 1)",
              }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      transform:
                        "translate3d(-50%, -38%, 0) scale3d(0.97, 0.92, 1)",
                      transition: referenceSignatureExit,
                    }
              }
              transition={
                reduceMotion ? { duration: 0.16 } : referenceSignatureSpring
              }
            >
              <motion.svg
                className="reference-signature__spring-border"
                viewBox="0 0 272 340"
                preserveAspectRatio="none"
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        transform:
                          "translate3d(0, 13%, 0) scale3d(0.94, 0.72, 1)",
                      }
                }
                animate={{
                  opacity: 1,
                  transform: "translate3d(0, 0%, 0) scale3d(1, 1, 1)",
                }}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        transform:
                          "translate3d(0, 10%, 0) scale3d(0.97, 0.82, 1)",
                        transition: referenceSignatureExit,
                      }
                }
                transition={
                  reduceMotion ? { duration: 0.16 } : referenceBorderSpring
                }
                aria-hidden="true"
              >
                <motion.rect
                  x="1.5"
                  y="1.5"
                  width="269"
                  height="337"
                  rx="36"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="7 7"
                  vectorEffect="non-scaling-stroke"
                  initial={{ strokeDashoffset: 30 }}
                  animate={{ strokeDashoffset: 0 }}
                  exit={{ strokeDashoffset: -24 }}
                  transition={
                    reduceMotion
                      ? { duration: 0.16 }
                      : {
                          duration: 0.42,
                          ease: [0.32, 0.72, 0, 1],
                        }
                  }
                />
              </motion.svg>

              <div className="reference-signature__header">
                <button
                  className="reference-signature__header-button"
                  type="button"
                  aria-label="Reset signature"
                  onClick={clearSignature}
                >
                  <ArrowCounterClockwise weight="bold" aria-hidden="true" />
                </button>
                <span>Sign</span>
                <button
                  className="reference-signature__close"
                  type="button"
                  aria-label="Close signature panel"
                  onClick={closeSigning}
                >
                  <X weight="bold" aria-hidden="true" />
                </button>
              </div>

              <div className="reference-signature__draw-area">
                <canvas
                  ref={canvasRef}
                  className="reference-signature__canvas"
                  aria-label="Draw your signature"
                  onPointerDown={startDrawing}
                  onPointerMove={continueDrawing}
                  onPointerUp={stopDrawing}
                  onPointerCancel={stopDrawing}
                  onPointerLeave={hidePencil}
                />
                <span ref={pencilRef} className="reference-signature__pencil">
                  <PencilSimple weight="fill" aria-hidden="true" />
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {state !== "complete" && (
            <motion.button
              key="signing-action"
              className={`reference-signature__action ${
                isSigning ? "is-signing" : ""
              }`}
              type="button"
              aria-expanded={isSigning}
              aria-controls="reference-signature-panel"
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 1,
                      transform: "translate3d(-50%, -50%, 0) scale(0.97)",
                    }
              }
              animate={{
                transform: isSigning
                  ? "translate3d(-50%, 106px, 0) scale(1)"
                  : "translate3d(-50%, -50%, 0) scale(1)",
              }}
              exit={{
                opacity: 0,
                transform: "translate3d(-50%, -50%, 0) scale(0.97)",
                transition: reduceMotion
                  ? { duration: 0.12 }
                  : {
                      opacity: {
                        duration: 0.1,
                        ease: [0.23, 1, 0.32, 1],
                      },
                      transform: referenceSignatureExit,
                    },
              }}
              transition={
                reduceMotion ? { duration: 0 } : referenceSignatureSpring
              }
              onClick={isSigning ? finishSigning : startSigning}
            >
              <span className="reference-signature__press">
                <SignatureGlyph />
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={isSigning ? "finish" : "start"}
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={signatureLabelTransition}
                  >
                    {isSigning ? "Finish Signing" : "Start Signing"}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {state === "complete" && (
            <motion.div
              className="reference-signature__complete"
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      transform: "translate3d(-50%, 106px, 0) scale(0.96)",
                    }
              }
              animate={{
                opacity: 1,
                transform: "translate3d(-50%, -50%, 0) scale(1)",
                transition: reduceMotion
                  ? { duration: 0.16 }
                  : { ...referenceSignatureSpring, delay: 0.08 },
              }}
              exit={{
                opacity: 0,
                transform: "translate3d(-50%, -50%, 0) scale(0.97)",
                transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] },
              }}
            >
              <motion.div
                className="reference-signature__done"
                initial={
                  reduceMotion ? { opacity: 0 } : { transform: "scale(0.98)" }
                }
                animate={{ transform: "scale(1)" }}
                transition={
                  reduceMotion
                    ? { duration: 0.16 }
                    : { ...referenceSignatureSpring, delay: 0.08 }
                }
              >
                <span className="reference-signature__check">
                  <CheckFat weight="fill" aria-hidden="true" />
                </span>
                Signing Done
              </motion.div>
              <motion.button
                className="reference-signature__edit"
                type="button"
                aria-label="Edit signature"
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        transform: "translate3d(-8px, 0, 0) scale(0.9)",
                      }
                }
                animate={{
                  opacity: 1,
                  transform: "translate3d(0, 0, 0) scale(1)",
                }}
                transition={
                  reduceMotion
                    ? { duration: 0.16 }
                    : { ...referenceSignatureSpring, delay: 0.14 }
                }
                onClick={() => setState("signing")}
              >
                <PencilSimple weight="fill" aria-hidden="true" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

