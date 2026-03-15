import { motion } from "framer-motion";

export const SpaceOrbit = () => (
  <div className="w-full h-full bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center">
    {/* Stars */}
    {[...Array(40)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white"
        style={{
          width: Math.random() * 2 + 0.5,
          height: Math.random() * 2 + 0.5,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.6 + 0.2,
        }}
      />
    ))}

    {/* Nebula glow */}
    <div
      className="absolute w-[300px] h-[300px] rounded-full opacity-20 blur-3xl"
      style={{
        background: "radial-gradient(circle, #c8a24e 0%, #1a0f3a 40%, transparent 70%)",
        top: "30%",
        left: "30%",
      }}
    />

    {/* Central disk — satellite/station */}
    <div className="relative w-24 h-24">
      {/* Core sphere */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#2a2a3a] to-[#0e0e1a] border border-[#3a3a5a] shadow-[0_0_30px_rgba(200,162,78,0.15)]" />

      {/* Inner detail ring */}
      <div className="absolute inset-4 rounded-full border border-[#c8a24e]/30" />

      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-[#c8a24e]/60 shadow-[0_0_12px_rgba(200,162,78,0.5)]" />
      </div>

      {/* Solar panels — left */}
      <div className="absolute top-1/2 -left-10 -translate-y-1/2 w-9 h-5 bg-gradient-to-l from-[#1a2a4a] to-[#0a1a3a] border border-[#2a3a5a] rounded-sm opacity-80">
        <div className="w-full h-px bg-[#3a5a8a]/40 absolute top-1/2" />
        <div className="h-full w-px bg-[#3a5a8a]/40 absolute left-1/3" />
        <div className="h-full w-px bg-[#3a5a8a]/40 absolute left-2/3" />
      </div>

      {/* Solar panels — right */}
      <div className="absolute top-1/2 -right-10 -translate-y-1/2 w-9 h-5 bg-gradient-to-r from-[#1a2a4a] to-[#0a1a3a] border border-[#2a3a5a] rounded-sm opacity-80">
        <div className="w-full h-px bg-[#3a5a8a]/40 absolute top-1/2" />
        <div className="h-full w-px bg-[#3a5a8a]/40 absolute left-1/3" />
        <div className="h-full w-px bg-[#3a5a8a]/40 absolute left-2/3" />
      </div>
    </div>

    {/* Orbiting ring */}
    <motion.div
      className="absolute"
      style={{
        width: 220,
        height: 220,
        top: "50%",
        left: "50%",
        x: "-50%",
        y: "-50%",
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      <svg viewBox="0 0 220 220" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="220" y2="220" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c8a24e" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#e8c86e" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#c8a24e" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#c8a24e" stopOpacity="0" />
          </linearGradient>
        </defs>
        <ellipse
          cx="110"
          cy="110"
          rx="105"
          ry="40"
          stroke="url(#ring-grad)"
          strokeWidth="1.5"
          fill="none"
          transform="rotate(-25 110 110)"
        />
      </svg>
    </motion.div>

    {/* Second ring — counter rotation, thinner */}
    <motion.div
      className="absolute"
      style={{
        width: 260,
        height: 260,
        top: "50%",
        left: "50%",
        x: "-50%",
        y: "-50%",
      }}
      animate={{ rotate: -360 }}
      transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
    >
      <svg viewBox="0 0 260 260" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="ring-grad-2" x1="0" y1="0" x2="260" y2="260" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c8a24e" stopOpacity="0" />
            <stop offset="40%" stopColor="#c8a24e" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#e8c86e" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#c8a24e" stopOpacity="0" />
          </linearGradient>
        </defs>
        <ellipse
          cx="130"
          cy="130"
          rx="125"
          ry="35"
          stroke="url(#ring-grad-2)"
          strokeWidth="0.8"
          fill="none"
          transform="rotate(15 130 130)"
        />
      </svg>
    </motion.div>

    {/* Orbiting particle on the ring */}
    <motion.div
      className="absolute"
      style={{
        width: 220,
        height: 220,
        top: "50%",
        left: "50%",
        x: "-50%",
        y: "-50%",
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      <motion.div
        className="absolute w-1.5 h-1.5 rounded-full bg-[#e8c86e] shadow-[0_0_8px_rgba(232,200,110,0.8)]"
        style={{
          top: "15%",
          left: "85%",
        }}
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  </div>
);
