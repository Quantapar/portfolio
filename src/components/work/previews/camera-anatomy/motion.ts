// How the camera moves, as pure functions of three numbers. The page drives
// the live parts with this, and the script that generated figure.json sampled
// the same functions to prove nothing collides, so the two can't drift.

export type Values = Record<string, number>;

/**
 * The assemblies the camera comes apart into, outermost first, with how far
 * each moves away from the one that carries it (mm). The lens assemblies ride
 * on each other and on the front panel, and the top cover on the viewfinder
 * head, so each number is a gap that opens, and the gaps add up: the front of
 * the lens ends 51 mm out, the cover 34 mm up.
 */
export const ASSEMBLIES = [
  ["lens.front", 9],
  ["lens.focus", 9],
  ["lens.iris", 9],
  ["lens.rear", 10],
  ["front", 14],
  ["cover", 18],
  ["head", 16],
  ["back", 44],
] as const;

/** Each assembly leaves a little after the one before it; this much of the stroke is the stagger. */
const STAGGER = 0.6;

/** The six shutter blades: [group, travel]. The first curtain drops to open the gate, the second drops to close it. */
export const BLADES = [
  ["blade.a0", 9],
  ["blade.a1", 16.8],
  ["blade.a2", 24.6],
  ["blade.b0", 25.2],
  ["blade.b1", 17.4],
  ["blade.b2", 9.6],
] as const;

export const MIRROR_SWING = 45; // degrees, from the viewing position up against the screen
export const LEVER_STROKE = 130; // degrees
/** One exposure and the wind after it, in seconds (slowed far below the real 1/60 s so it can be followed). */
export const SHOT_SECONDS = 2.4;

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => {
  const t = clamp(x);
  return t * t * (3 - 2 * t);
};

/** Share of its travel each assembly has made when the camera is `open` (0 shut, 1 apart). */
export function shareOf(index: number, open: number) {
  const last = ASSEMBLIES.length - 1;
  return ease(clamp(open) * (1 + STAGGER) - (STAGGER * index) / last);
}

/**
 * The exposure cycle at time `t` seconds: the mirror swings up out of the
 * light path, the first curtain opens the gate, the second closes it, the
 * mirror comes back down, and the lever winds the film on and recocks both
 * curtains, the first before the second so the gate stays covered.
 */
export function shotAt(t: number) {
  const mirror = ease((t - 0.05) / 0.16) * (1 - ease((t - 0.82) / 0.2));
  const first = ease((t - 0.28) / 0.14) * (1 - ease((t - 1.15) / 0.25));
  const second = ease((t - 0.62) / 0.14) * (1 - ease((t - 1.42) / 0.25));
  const lever = ease((t - 1.15) / 0.45) * (1 - ease((t - 1.75) / 0.45));
  return { mirror, first, second, lever };
}

/** Group values for the figure's three numbers: heading (degrees), open (0..1) and shot time (seconds). */
export function follow(values: Values): Values {
  const out: Values = { cam: values.cam ?? 0 };
  ASSEMBLIES.forEach(([name, travel], index) => {
    out[name] = travel * shareOf(index, values.open ?? 0);
  });
  const shot = shotAt(values.shot ?? 0);
  out.mirror = MIRROR_SWING * shot.mirror;
  BLADES.forEach(([name, travel], index) => {
    out[name] = travel * (index < 3 ? shot.first : shot.second);
  });
  out.lever = -LEVER_STROKE * shot.lever;
  return out;
}
