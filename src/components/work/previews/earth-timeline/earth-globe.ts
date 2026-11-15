import type { TextureData } from "./renderer";
import cloudsUrl from "./clouds.jpg";
import dayUrl from "./day.jpg";
import { landTexture } from "./land-texture";

/*
  The Earth through time, shared by the components that show it: the eras, the GLSL that paints
  each one on a globe, and the maps it reads. The GLSL expects AGENT_PRELUDE and ORB_GLSL before it.
*/

export interface Era {
  when: string;
  name: string;
  detail: string;
  /** Longitude, in radians, turned to face the camera while the demo rests on this era. */
  face: number;
}

export const ERAS: Era[] = [
  { when: "13.8 billion years ago", name: "Big Bang", detail: "The universe begins", face: 0 },
  { when: "4.6 billion years ago", name: "Protoplanet", detail: "Dust and rock collide", face: 0 },
  { when: "4.5 billion years ago", name: "Magma ocean", detail: "The surface is molten", face: 0 },
  { when: "4.4 billion years ago", name: "First oceans", detail: "Steam falls as rain", face: 0 },
  { when: "3.7 billion years ago", name: "First life", detail: "Microbes under a hazy sky", face: 0 },
  { when: "2.4 billion years ago", name: "Great Oxidation", detail: "Oxygen fills the air", face: 0 },
  { when: "650 million years ago", name: "Snowball Earth", detail: "Ice reaches the equator", face: 0 },
  { when: "250 million years ago", name: "Pangaea", detail: "One supercontinent", face: 0 },
  { when: "66 million years ago", name: "Chicxulub", detail: "An asteroid ends the dinosaurs", face: -1.35 },
  { when: "Today", name: "Earth", detail: "8 billion people", face: 0.3 },
];
export const LAST = ERAS.length - 1;

// Where the globe sits, as fractions of the shorter side. The ruler and labels are laid out round it.
export const GLOBE_Y = 0.37; // of the height, from the top
export const GLOBE_R = 0.17;

/** Each era painted on a unit globe: `surface` (albedo, glow and wetness), `haze` (air at the limb), and an ACES curve. */
export const ERA_GLSL = `
uniform sampler2D u_day;
uniform sampler2D u_clouds;
uniform sampler2D u_land;
// Seconds, for the plasma and lava to churn.
uniform float u_clock;
// How far today's clouds have drifted east, as a fraction of the map.
uniform float u_drift;

// Points facing Pangaea's heart, its Tethys bite, and the Chicxulub crater (21.3N, 89.5W).
const vec3 PANGAEA = vec3(0.0, -0.05, 0.9987);
const vec3 TETHYS = vec3(0.7526, 0.1003, 0.6511);
const vec3 IMPACT = vec3(-0.9315, 0.3633, 0.0081);

float ridge(vec3 p) {
  return 1.0 - abs(noise3(p) * 2.0 - 1.0);
}

// Black to red to orange to white, for anything hot.
vec3 fire(float heat) {
  vec3 c = mix(vec3(0.5, 0.06, 0.02), vec3(1.0, 0.42, 0.07), smoothstep(0.0, 0.45, heat));
  return mix(c, vec3(1.0, 0.93, 0.76), smoothstep(0.45, 0.9, heat));
}

// Map coordinates for a point on the globe. The longitude wraps at the date line, which mip
// selection reads as a huge derivative; a second coordinate wraps on the opposite meridian, and
// each pixel uses whichever is continuous there (Tarini's method).
vec2 mapUv(vec3 g) {
  float u = atan(g.x, g.z) / TAU + 0.5;
  float uAlt = fract(u + 0.5) - 0.5;
  return vec2(fwidth(u) <= fwidth(uAlt) + 1e-5 ? u : uAlt, 0.5 - asin(clamp(g.y, -1.0, 1.0)) / PI);
}

// Era e at point g on the globe (n is the view normal there): its colour, the light it gives off,
// and how wet it is, for the glint. Colours are picked in sRGB and returned linear.
void surface(float e, vec3 g, vec3 n, out vec3 albedo, out vec3 glow, out float wet) {
  glow = vec3(0.0);
  wet = 0.0;
  if (e < 0.5) {
    // Big Bang: churning plasma, white-hot at the heart.
    vec3 flow = vec3(0.0, u_clock * 0.5, u_clock * 0.2);
    float f = fbm3(g * 2.5 + flow) * 0.6 + fbm3(g * 6.0 - flow * 1.7) * 0.4;
    float heat = 0.35 + 0.55 * n.z + 0.7 * (f - 0.5);
    albedo = vec3(0.0);
    glow = pow(fire(heat), vec3(2.2)) * (1.0 + 0.8 * smoothstep(0.7, 1.0, heat));
    return;
  } else if (e < 1.5) {
    // Protoplanet: dark cratered rock, still glowing where something just hit.
    albedo = mix(vec3(0.17, 0.15, 0.14), vec3(0.42, 0.37, 0.32), fbm3(g * 3.0 + 7.0));
    float c = noise3(g * 8.0 + 3.0);
    c += 0.15 * (noise3(g * 22.0) - 0.5);
    albedo *= 1.0 - 0.3 * smoothstep(0.64, 0.7, c);
    albedo += 0.08 * smoothstep(0.56, 0.62, c) * (1.0 - smoothstep(0.62, 0.68, c));
    albedo *= 0.85 + 0.3 * noise3(g * 30.0);
    float hot = smoothstep(0.86, 0.9, noise3(g * 5.0 + 31.0));
    glow = pow(fire(0.25 + 0.4 * hot), vec3(2.2)) * hot;
  } else if (e < 2.5) {
    // Magma ocean: a thin black crust, cracked, with lava welling up through it.
    vec3 drift = vec3(u_clock * 0.05, 0.0, 0.0);
    float crust = fbm3(g * 4.0 + drift + 2.0);
    float lava = max(smoothstep(0.92, 0.985, ridge(g * 7.0 + drift)), smoothstep(0.34, 0.27, crust));
    lava = clamp(lava + 0.6 * smoothstep(0.93, 0.99, ridge(g * 15.0 + drift * 2.0)), 0.0, 1.0);
    albedo = mix(vec3(0.1, 0.08, 0.08), vec3(0.24, 0.15, 0.12), crust) * (1.0 - lava) * (0.8 + 0.4 * noise3(g * 26.0));
    glow = pow(fire(0.2 + 0.45 * lava), vec3(2.2)) * lava * 1.1 + vec3(0.03, 0.004, 0.0);
  } else if (e < 3.5) {
    // First oceans: a dark sea dotted with volcanoes, under heavy storm cloud.
    float rise = fbm3(g * 5.0 + 13.0) + 0.08 * (noise3(g * 24.0) - 0.5);
    float island = smoothstep(0.63, 0.65, rise);
    albedo = mix(vec3(0.05, 0.15, 0.19), vec3(0.3, 0.26, 0.22), island);
    glow = pow(fire(0.4), vec3(2.2)) * smoothstep(0.71, 0.73, rise) * 1.2;
    wet = 1.0 - island;
    float cloud = smoothstep(0.45, 0.75, fbm3(g * 3.0 + vec3(0.0, u_clock * 0.03, 40.0)));
    albedo = mix(albedo, vec3(0.72, 0.72, 0.7), cloud * 0.85);
    wet *= 1.0 - cloud;
  } else if (e < 4.5) {
    // First life: a green-tinged sea, bare little continents, mats of microbes in the shallows.
    float rise = fbm3(g * 3.5 + 21.0) + 0.08 * (noise3(g * 20.0) - 0.5);
    float land = smoothstep(0.66, 0.69, rise);
    float shallows = smoothstep(0.58, 0.66, rise) * (1.0 - land);
    albedo = mix(vec3(0.1, 0.31, 0.29), vec3(0.24, 0.46, 0.34), shallows * 0.85);
    albedo = mix(albedo, vec3(0.4, 0.29, 0.2), land);
    wet = 1.0 - land;
    float cloud = smoothstep(0.55, 0.8, fbm3(g * 3.0 + 40.0));
    albedo = mix(albedo, vec3(0.88, 0.75, 0.62), cloud * 0.7);
  } else if (e < 5.5) {
    // Great Oxidation: bluer seas, and rust-red land.
    float land = smoothstep(0.56, 0.58, fbm3(g * 3.0 + 51.0) + 0.08 * (noise3(g * 20.0) - 0.5));
    vec3 rust = mix(vec3(0.5, 0.22, 0.1), vec3(0.74, 0.43, 0.24), fbm3(g * 9.0));
    albedo = mix(vec3(0.07, 0.21, 0.42), rust, land);
    wet = 1.0 - land;
    float cloud = smoothstep(0.55, 0.8, fbm3(g * 3.2 + 60.0));
    albedo = mix(albedo, vec3(0.95), cloud * 0.9);
    wet *= 1.0 - cloud;
  } else if (e < 6.5) {
    // Snowball Earth: cracked ice from pole to pole, with a band of slush at the equator.
    vec3 ice = mix(vec3(0.78, 0.86, 0.93), vec3(0.96, 0.97, 0.99), fbm3(g * 5.0 + 71.0));
    ice = mix(ice, vec3(0.62, 0.76, 0.88), smoothstep(0.95, 0.99, ridge(g * 9.0 + 3.0)) * 0.4);
    float slush = (1.0 - smoothstep(0.05, 0.22, abs(g.y))) * smoothstep(0.5, 0.65, noise3(g * 6.0));
    albedo = mix(ice, vec3(0.2, 0.38, 0.52), slush * 0.7);
    wet = 0.25 + 0.5 * slush;
  } else if (e < 7.5) {
    // Pangaea: one continent, dry at the heart and green round the edges, with the Tethys sea
    // biting into its eastern side.
    float d = dot(g, PANGAEA) + 0.45 * (fbm3(g * 2.2 + 81.0) - 0.5) + 0.12 * (fbm3(g * 7.0) - 0.5) + 0.05 * (noise3(g * 24.0) - 0.5);
    d -= 0.5 * smoothstep(0.75, 0.95, dot(g, TETHYS));
    float land = smoothstep(0.42, 0.45, d);
    vec3 ground = mix(vec3(0.23, 0.41, 0.18), vec3(0.76, 0.61, 0.42), smoothstep(0.55, 0.8, d + 0.15 * (fbm3(g * 9.0) - 0.5)));
    ground *= 0.85 + 0.3 * noise3(g * 28.0);
    albedo = mix(vec3(0.05, 0.19, 0.4), ground, land);
    wet = 1.0 - land;
    float cloud = smoothstep(0.6, 0.85, fbm3(g * 3.3 + 90.0));
    albedo = mix(albedo, vec3(0.96), cloud * 0.9);
    wet *= 1.0 - cloud;
  } else if (e < 8.5) {
    // 66 million years ago: today's continents, lush and lower, with shallow seas over their
    // coasts, and the impact still glowing under a spreading cloud of dust.
    vec2 coast = texture2D(u_land, mapUv(g)).ra;
    float land = smoothstep(0.55, 0.8, coast.y);
    float shallows = smoothstep(0.2, 0.55, coast.y) * (1.0 - land);
    albedo = mix(vec3(0.05, 0.2, 0.4), vec3(0.15, 0.45, 0.5), shallows);
    albedo = mix(albedo, mix(vec3(0.14, 0.3, 0.1), vec3(0.34, 0.44, 0.2), fbm3(g * 8.0)) * (0.85 + 0.3 * noise3(g * 28.0)), land);
    wet = 1.0 - land;
    float cloud = smoothstep(0.6, 0.85, fbm3(g * 3.3 + 95.0));
    albedo = mix(albedo, vec3(0.96), cloud * 0.85);
    float away = 1.0 - dot(g, IMPACT);
    float dust = smoothstep(0.09, 0.0, away + 0.04 * (fbm3(g * 6.0) - 0.5));
    albedo = mix(albedo, vec3(0.32, 0.27, 0.22), dust * 0.85);
    wet *= (1.0 - cloud) * (1.0 - dust);
    glow = pow(fire(0.55 + 0.4 * smoothstep(0.004, 0.0, away)), vec3(2.2)) * smoothstep(0.014, 0.002, away) * 2.0;
  } else {
    // Today, from NASA's Blue Marble and cloud maps.
    vec2 uv = mapUv(g);
    vec3 day = pow(texture2D(u_day, uv).rgb, vec3(2.2));
    float water = 1.0 - texture2D(u_land, uv).r;
    day = mix(day, day * vec3(0.35, 0.5, 0.75), water * 0.75);
    float cloud = smoothstep(0.18, 0.85, texture2D(u_clouds, uv + vec2(u_drift, 0.0)).r);
    albedo = mix(day, vec3(1.0), cloud * 0.9);
    wet = water * (1.0 - cloud);
    return;
  }
  albedo = pow(albedo, vec3(2.2));
}

// The colour (sRGB) and thickness of each era's air, seen at the limb.
vec4 haze(float e) {
  if (e < 0.5) return vec4(1.0, 0.8, 0.5, 0.0);
  if (e < 1.5) return vec4(0.6, 0.5, 0.4, 0.1);
  if (e < 2.5) return vec4(1.0, 0.4, 0.15, 0.4);
  if (e < 3.5) return vec4(0.78, 0.75, 0.68, 0.4);
  if (e < 4.5) return vec4(0.98, 0.62, 0.3, 0.6);
  if (e < 6.5) return vec4(0.72, 0.84, 1.0, 0.35);
  return vec4(0.45, 0.66, 1.0, 0.5);
}

// ACES filmic curve (Narkowicz's fit).
vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}
`;

export type Textures = Record<string, TextureData | TexImageSource>;
let maps: Promise<Textures> | null = null;

async function loadImage(src: string) {
  const image = new Image();
  image.src = src;
  await image.decode();
  return image;
}

export function loadMaps() {
  maps ??= Promise.all([loadImage(dayUrl.src), loadImage(cloudsUrl.src)]).then(([day, clouds]) => ({
    u_day: day,
    u_clouds: clouds,
    u_land: landTexture(),
  }));
  return maps;
}

export const smooth = (from: number, to: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - from) / (to - from)));
  return t * t * (3 - 2 * t);
};
// Eases in and out with no jerk at either end, the way a hand drags.
export const smoother = (t: number) => {
  t = Math.min(1, Math.max(0, t));
  return t * t * t * (t * (6 * t - 15) + 10);
};
/**
 * Today's cloud drift: during a looping demo it sways and comes back, so the loop has no seam;
 * otherwise it creeps east from wherever it was.
 */
export function drift(previous: number, dt: number, loop: number | null, clock: number) {
  return loop === null ? previous + dt * 0.002 : 0.012 * Math.sin((clock / loop) * Math.PI * 2);
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
