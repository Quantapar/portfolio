import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NUM_DIGITS = 5;
const SPHERE_GIF = "https://i.pinimg.com/originals/62/12/48/6212485181ca055f760855d98d3ee4bc.gif";
const VERIFIED_IMG = "https://i.pinimg.com/originals/ff/29/33/ff2933ea7339aa7a9bd633b200876ff2.gif";

export const OtpVerifyPreview = () => {
  const [values, setValues] = useState<string[]>(Array(NUM_DIGITS).fill(""));
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el && getComputedStyle(el).pointerEvents !== "none" && !el.closest("[style*='pointer-events: none']") && !el.closest(".pointer-events-none")) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...values];
    next[index] = value.slice(-1);
    setValues(next);
    if (value && index < NUM_DIGITS - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (next.every((v) => v !== "") && next.join("").length === NUM_DIGITS) {
      if (next.join("") === "00000") {
        setTimeout(() => {
          setShaking(true);
          setTimeout(() => {
            setShaking(false);
            setValues(Array(NUM_DIGITS).fill(""));
            inputRefs.current[0]?.focus();
          }, 500);
        }, 200);
      } else {
        setTimeout(() => {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            setVerified(true);
          }, 3500);
        }, 300);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, NUM_DIGITS);
    if (!pasted) return;
    const next = [...values];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i]!;
    }
    setValues(next);
    const focusIndex = Math.min(pasted.length, NUM_DIGITS - 1);
    inputRefs.current[focusIndex]?.focus();
    if (next.every((v) => v !== "")) {
      if (next.join("") === "00000") {
        setTimeout(() => {
          setShaking(true);
          setTimeout(() => {
            setShaking(false);
            setValues(Array(NUM_DIGITS).fill(""));
            inputRefs.current[0]?.focus();
          }, 500);
        }, 200);
      } else {
        setTimeout(() => {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            setVerified(true);
          }, 3500);
        }, 300);
      }
    }
  };

  const reset = () => {
    setValues(Array(NUM_DIGITS).fill(""));
    setLoading(false);
    setVerified(false);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-xs min-w-0">
      <div
        className="flex min-h-[420px] flex-col items-center gap-5 rounded-2xl px-4 pb-8 pt-6 sm:min-h-[460px] sm:gap-6 sm:px-6 sm:pb-10 sm:pt-8"
        style={{ background: "#000000", border: "1px solid #1a1a1a" }}
      >
        <div className="relative aspect-square w-[min(100%,180px)] shrink-0 rounded-full">
          <img
            src={SPHERE_GIF}
            alt=""
            className="absolute inset-0 h-full w-full rounded-full object-cover pointer-events-none select-none"
            style={{
              opacity: (loading || verified) ? 0 : 1,
              transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
          <img
            src={VERIFIED_IMG}
            alt=""
            className="absolute inset-0 h-full w-full rounded-full object-cover pointer-events-none select-none"
            style={{
              opacity: (loading || verified) ? 1 : 0,
              transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center rounded-full"
            style={{
              opacity: verified ? 1 : 0,
              transition: "opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", boxShadow: "0 0 40px 12px rgba(255,255,255,0.4)" }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="flex w-full flex-col items-center justify-center"
              style={{ minHeight: 148 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-lg font-medium" style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#888" }}>Verifying...</p>
            </motion.div>
          ) : !verified ? (
            <motion.div
              key="input"
              className="flex w-full min-w-0 flex-col items-center gap-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center">
                <h3 className="mb-1 text-xl font-medium sm:text-2xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#fff" }}>Enter the code</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#888" }}>
                  We sent you a code to your email, please<br />enter to verify your address.
                </p>
              </div>

              <motion.div
                className="flex w-full max-w-[280px] gap-1.5 sm:gap-2"
                onPaste={handlePaste}
                animate={shaking ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              >
                {values.map((val, i) => (
                  <motion.input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="h-11 min-w-0 flex-1 rounded-lg text-center text-base font-semibold outline-none sm:h-[52px] sm:text-lg"
                    style={{
                      background: "transparent",
                      color: "#fff",
                      border: `1.5px solid ${shaking ? "#ef4444" : "#444"}`,
                      caretColor: "#fff",
                      transition: "border-color 0.2s ease",
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                  />
                ))}
              </motion.div>

              <p className="text-xs" style={{ color: "#888" }}>
                Need Help?{" "}
                <span className="underline cursor-pointer" style={{ color: "#fff" }}>Contact us</span>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              className="flex w-full flex-col items-center justify-center gap-5"
              style={{ minHeight: 148 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="text-center">
                <p className="text-2xl font-medium" style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#fff" }}>Verified</p>
                <p className="mt-2 text-sm" style={{ color: "#888" }}>Your email has been confirmed</p>
              </div>
              <p className="mt-4 text-xs" style={{ color: "#888" }}>
                Not working?{" "}
                <span className="underline cursor-pointer" style={{ color: "#fff" }} onClick={reset}>Try again</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
