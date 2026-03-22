import { OtpVerifyPreview } from "../../components/showcase/OtpVerifyPreview";
import type { ComponentEntry } from "./types";

export const otpVerify: ComponentEntry = {
  id: "otp-verify",
  name: "OTP Verify",
  description:
    "A verification code input with animated number sphere, auto-advance between digits, paste support, and a verified success state.",
  preview: <OtpVerifyPreview />,
  code: `import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OtpVerifyProps {
  length?: number;
  invalidCode?: string;
  heroImage?: string;
  verifiedImage?: string;
  onComplete?: (code: string) => void;
  onError?: () => void;
  onResend?: () => void;
}

export default function OtpVerify({
  length = 5,
  invalidCode = "00000",
  heroImage,
  verifiedImage,
  onComplete,
  onError,
  onResend,
}: OtpVerifyProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const [verified, setVerified] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const submitCode = (code: string) => {
    if (code === invalidCode) {
      setTimeout(() => {
        setShaking(true);
        onError?.();
        setTimeout(() => {
          setShaking(false);
          setValues(Array(length).fill(""));
          inputRefs.current[0]?.focus();
        }, 500);
      }, 200);
    } else {
      onComplete?.(code);
      setTimeout(() => setVerified(true), 300);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\\d*$/.test(value)) return;
    const next = [...values];
    next[index] = value.slice(-1);
    setValues(next);
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (next.every((v) => v !== "")) {
      submitCode(next.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\\D/g, "").slice(0, length);
    if (!pasted) return;
    const next = [...values];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setValues(next);
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
    if (next.every((v) => v !== "")) {
      submitCode(next.join(""));
    }
  };

  const reset = () => {
    setValues(Array(length).fill(""));
    setVerified(false);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  return (
    <div style={{ maxWidth: 320, margin: "0 auto" }}>
      <div style={{ borderRadius: 16, background: "#000", border: "1px solid #1a1a1a", padding: "32px 24px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24, height: 460 }}>
        {(heroImage || verifiedImage) && (
          <div style={{ position: "relative", width: 180, height: 180, borderRadius: "50%" }}>
            {heroImage && (
              <img
                src={heroImage}
                alt=""
                style={{ position: "absolute", inset: 0, width: 180, height: 180, borderRadius: "50%", objectFit: "cover", pointerEvents: "none", userSelect: "none" }}
              />
            )}
            {verifiedImage && (
              <img
                src={verifiedImage}
                alt=""
                style={{
                  position: "absolute", inset: 0, width: 180, height: 180, borderRadius: "50%", objectFit: "cover", pointerEvents: "none", userSelect: "none",
                  opacity: verified ? 1 : 0,
                  transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            )}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!verified ? (
            <motion.div
              key="input"
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%" }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: 24, fontWeight: 500, color: "#fff", margin: "0 0 4px", fontFamily: "Georgia, 'Times New Roman', serif" }}>Enter the code</h3>
                <p style={{ fontSize: 12, color: "#888", lineHeight: 1.5, margin: 0 }}>
                  We sent you a code to your email, please<br />enter to verify your address.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <motion.div
                  style={{ display: "flex", gap: 8 }}
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
                      style={{
                        width: 44, height: 52, borderRadius: 8, textAlign: "center",
                        fontSize: 18, fontWeight: 600, color: "#fff", background: "transparent",
                        border: \`1.5px solid \${shaking ? "#ef4444" : "#444"}\`,
                        outline: "none", caretColor: "#fff",
                        transition: "border-color 0.2s ease",
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.2 }}
                    />
                  ))}
                </motion.div>
                <div style={{ display: "flex", gap: 8 }}>
                  {values.map((val, i) => (
                    <div
                      key={i}
                      style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: val ? "#fff" : "#333",
                        transition: "background 0.15s ease",
                      }}
                    />
                  ))}
                </div>
              </div>

              <p style={{ fontSize: 12, color: "#888", margin: 0 }}>
                Need Help?{" "}
                <span style={{ textDecoration: "underline", color: "#fff", cursor: "pointer" }} onClick={onResend}>Contact us</span>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, width: "100%", minHeight: 148 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 24, fontWeight: 500, color: "#fff", margin: 0, fontFamily: "Georgia, 'Times New Roman', serif" }}>Verified</p>
                <p style={{ fontSize: 14, color: "#555", marginTop: 8 }}>Your email has been confirmed</p>
              </div>
              <p style={{ fontSize: 12, color: "#888", marginTop: 16 }}>
                Not working?{" "}
                <span style={{ textDecoration: "underline", color: "#fff", cursor: "pointer" }} onClick={reset}>Try again</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}`,
  npmCommand: "npm install framer-motion",
  props: [
    { name: "length", type: "number", required: false, description: "Number of OTP digits (default: 5)" },
    { name: "invalidCode", type: "string", required: false, description: "Code that triggers shake error (default: '00000')" },
    { name: "heroImage", type: "string", required: false, description: "Image URL for the top sphere/hero area" },
    { name: "verifiedImage", type: "string", required: false, description: "Image URL to crossfade to on verification" },
    { name: "onComplete", type: "(code: string) => void", required: false, description: "Callback when a valid code is entered" },
    { name: "onError", type: "() => void", required: false, description: "Callback when invalid code is entered" },
    { name: "onResend", type: "() => void", required: false, description: "Callback for contact/resend action" },
  ],
};
