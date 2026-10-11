// How the station moves, as pure functions of three numbers. The page drives
// the live parts with this, and the script that generated figure.json sampled
// the same functions to prove nothing collides, so the two can't drift.

export type Values = Record<string, number>;

const RAD = Math.PI / 180;
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => {
  const t = clamp(x);
  return t * t * (3 - 2 * t);
};

/** The drawing's camera azimuth; the kit's light sits a quarter turn round from it. */
export const VIEW_AZIMUTH = 45;
/**
 * How high the sun the arrays follow stands above the station's deck, in
 * degrees. It lies over the drawing's own light, so as the station is turned
 * the arrays lean toward the lit side: the alpha joints roll the outboard
 * truss, and each wing's beta gimbal feathers it.
 */
export const SUN_LIFT = 68;

/**
 * The elements the station comes apart into, outermost first, with how far
 * each backs off the port that carries it (decimetres). Most ride on another
 * element, so the gaps add up along a chain.
 */
export const ELEMENTS = [
  ["progress", 30],
  ["dragon", 26],
  ["soyuz.poisk", 24],
  ["soyuz.rassvet", 24],
  ["cygnus", 28],
  ["p6", 22],
  ["s6", 22],
  ["prichal", 20],
  ["p5", 22],
  ["s5", 22],
  ["pma2", 18],
  ["kibo.ef", 22],
  ["kibo.elm", 24],
  ["bishop", 16],
  ["beam", 22],
  ["leonardo", 22],
  ["cupola", 20],
  ["poisk", 24],
  ["nauka", 26],
  ["rassvet", 24],
  ["p34", 28],
  ["s34", 28],
  ["pma3", 20],
  ["columbus", 28],
  ["kibo", 28],
  ["quest", 28],
  ["tranquility", 28],
  ["z1", 28],
  ["zvezda", 28],
  ["p1", 28],
  ["s1", 28],
  ["zarya", 24],
  ["pma1", 18],
  ["harmony", 28],
  ["unity", 28],
  ["s0", 30],
] as const;

/** Each element leaves a little after the one before it; this much of the stroke is the stagger. */
const STAGGER = 1.4;

/** Share of its travel each element has made when the station is `open` (0 assembled, 1 apart). */
export function shareOf(index: number, open: number) {
  const last = ELEMENTS.length - 1;
  return ease(clamp(open) * (1 + STAGGER) - (STAGGER * index) / last);
}

/** How far the crew ship backs away from its port on a fly-around (decimetres). */
export const RETREAT = 150;
/** One undocking, station-keeping hold and docking, in seconds. */
export const VISIT_SECONDS = 9;

/**
 * The crew ship's distance from its docking port at time `t` of a visit, as a
 * share of `RETREAT`: it backs straight out along the station's forward axis,
 * holds, and comes back in, slowing all the way to contact.
 */
export function visitAt(t: number) {
  const out = ease((t - 0.2) / 3);
  // The approach brakes as it closes: it eases off the hold, and crawls into contact.
  return out * (1 - ease((t - 4.2) / 4.6)) ** 1.6;
}

/** The alpha and beta angles (degrees) that face the arrays to the sun when the station is turned to `heading`. */
export function sunAt(heading: number) {
  const around = (VIEW_AZIMUTH + 90 - heading) * RAD;
  const lift = SUN_LIFT * RAD;
  const s = [
    Math.cos(lift) * Math.cos(around),
    Math.cos(lift) * Math.sin(around),
    Math.sin(lift),
  ];
  return { alpha: Math.atan2(s[0], s[2]) / RAD, beta: -Math.asin(s[1]) / RAD };
}

/** The wings, one beta gimbal each. */
export const WINGS = [
  "p4.fore",
  "p4.aft",
  "p6.fore",
  "p6.aft",
  "s4.fore",
  "s4.aft",
  "s6.fore",
  "s6.aft",
] as const;

/** Group values for the figure's three numbers: `iss`, the heading (degrees); `open` (0..1); and `visit` time (seconds). */
export function follow(values: Values): Values {
  const heading = values.iss ?? 0;
  const out: Values = { iss: heading };
  ELEMENTS.forEach(([name, travel], index) => {
    out[name] = travel * shareOf(index, values.open ?? 0);
  });
  out.dragon += RETREAT * visitAt(values.visit ?? 0);
  const sun = sunAt(heading);
  out["sarj.p"] = sun.alpha;
  out["sarj.s"] = sun.alpha;
  for (const wing of WINGS) out[`bga.${wing}`] = sun.beta;
  return out;
}
