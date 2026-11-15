import { useEffect, useRef, useState } from "react";
import { AGENT_PRELUDE, ORB_GLSL } from "./glsl";
import type { ShaderCanvasProps } from "./shader-canvas";
import { drift, ERA_GLSL, ERAS, GLOBE_R, GLOBE_Y, loadMaps, type Textures } from "./earth-globe";
import { ScrubTimeline, type TimelineReducedMotion } from "./scrub-timeline";

/*
  The Earth through time, on a scrubbable timeline: a globe on a white page, the date and what was
  happening underneath, and a ruler of ticks that swell round the playhead like a magnifier.
  Dragging the playhead spins the globe with the drag, backwards into the past and forwards to
  today, motion-blurred, so the jump from one era to the next happens inside the blur.

  The globe is this file's shader; ScrubTimeline draws the rest and plays the demo, a cursor
  sweeping back to the Big Bang and walking forward one era at a time.
*/

/** Seconds per loop of the demo. */
const EARTH_TIMELINE_LOOP = 22;

const FRAGMENT = `${AGENT_PRELUDE}${ORB_GLSL}${ERA_GLSL}
// Spin in radians, and how far the globe turns while the shutter is open.
uniform vec2 u_spin;
// The eras either side of the playhead and how far it is from the first to the second.
uniform vec3 u_eras;
// Each of those eras' extra turn, so its best side faces the camera.
uniform vec2 u_turns;

const float CENTRE_Y = ${GLOBE_Y};
const float RADIUS = ${GLOBE_R};
// Studio light from the upper left, and the half vector for the highlight it makes.
const vec3 SUN = vec3(-0.4623, 0.5137, 0.7191);
const vec3 HALFWAY = vec3(-0.2493, 0.277, 0.9280);

// The globe lit in one era, turned to a given spin.
vec3 shade(float e, float spin, vec3 n) {
  // Into the globe's own frame: a tilt of the axis, then the spin about it.
  vec3 g = rotateY(spin) * rotateX(-0.22) * mat3(0.9553, 0.2955, 0.0, -0.2955, 0.9553, 0.0, 0.0, 0.0, 1.0) * n;
  vec3 albedo;
  vec3 glow;
  float wet;
  surface(e, g, n, albedo, glow, wet);
  // Soft studio light that never falls to black, and a glint off the water.
  float diffuse = clamp(dot(n, SUN), 0.0, 1.0) * 0.85 + 0.16;
  float sheen = max(dot(n, HALFWAY), 0.0);
  vec3 color = albedo * diffuse + glow + vec3(1.0, 0.95, 0.88) * (pow(sheen, 160.0) * 0.4 + pow(sheen, 12.0) * 0.03) * wet;
  vec4 air = haze(e);
  return color + pow(air.rgb, vec3(2.2)) * pow(1.0 - n.z, 2.0) * air.a;
}

void main() {
  float scale = min(u_resolution.x, u_resolution.y) * RADIUS;
  float pxq = 1.0 / scale;
  vec2 centre = vec2(0.5 * u_resolution.x, u_resolution.y * (1.0 - CENTRE_Y));
  vec2 q = (gl_FragCoord.xy - centre) / scale;
  float r = length(q);
  if (r > 2.4) {
    gl_FragColor = vec4(0.0);
    return;
  }

  /*
    No early-out on the globe's edge: texture lookups and fwidth need every pixel of a 2x2 quad to
    take the same path. Motion blur: the shutter stays open while the globe turns through
    u_spin.y, sampled evenly, and stops after one sample when it's barely moving.
  */
  vec3 n = sphereNormal(q / max(r, 1.0));
  vec3 color = vec3(0.0);
  float count = 0.0;
  // Each pixel starts the shutter at a slightly different moment, so the samples smear rather than ghost.
  float jitter = hash21(gl_FragCoord.xy) - 0.5;
  for (int i = 0; i < 24; i++) {
    float spin = u_spin.x - u_spin.y * clamp((float(i) + jitter) / 23.0, 0.0, 1.0);
    vec3 c = shade(u_eras.x, spin + u_turns.x, n);
    if (u_eras.z > 0.001) c = mix(c, shade(u_eras.y, spin + u_turns.y, n), u_eras.z);
    color += c;
    count += 1.0;
    if (u_spin.y < 0.01) break;
  }
  color = pow(aces(color / count * 1.15), vec3(1.0 / 2.2));

  // A soft contact shadow under it, and a glow round it while it's still plasma.
  vec2 s = (q - vec2(0.0, -1.2)) / vec2(0.85, 0.1);
  float shadow = 0.16 * exp(-dot(s, s) * 1.4);
  float plasma = mix(step(u_eras.x, 0.5), step(u_eras.y, 0.5), u_eras.z);
  float halo = plasma * 0.7 * exp(-max(r - 1.0, 0.0) * 5.0) * step(1.0, r);
  vec4 back = vec4(vec3(1.0, 0.62, 0.3) * halo, halo) + vec4(0.0, 0.0, 0.0, shadow) * (1.0 - halo);

  float cover = orbCover(r, pxq);
  gl_FragColor = vec4(color * cover, cover) + back * (1.0 - cover);
}
`;

const EXTENSIONS = ["OES_standard_derivatives"];
const ENDS: [string, string] = ["13.8B years ago", "Today"];

export interface EarthTimelineProps
  extends Omit<ShaderCanvasProps, "fragment" | "vertex" | "geometry" | "uniforms" | "textures" | "extensions" | "onFrame"> {
  /** Play the scripted demo, with a cursor, until someone grabs the ruler. */
  autoplay?: boolean;
  /**
   * `"user"` (the default) follows the reduced-motion setting: no spin, no idle motion, no demo.
   * `"never"` always plays the full motion.
   */
  reducedMotion?: TimelineReducedMotion;
}

/**
 * The Earth from the Big Bang to today on a scrubbable timeline. Drag the ruler to travel through
 * time; the globe spins with the drag. With `autoplay` it runs a demo that loops every
 * `EARTH_TIMELINE_LOOP` seconds. The page behind should be white. Renders nothing until its maps
 * have decoded.
 */
export function EarthTimeline({ autoplay = true, ...rest }: EarthTimelineProps) {
  const [textures, setTextures] = useState<Textures | null>(null);
  const clouds = useRef(0);

  useEffect(() => {
    let live = true;
    void loadMaps().then((loaded) => {
      if (live) setTextures(loaded);
    });
    return () => {
      live = false;
    };
  }, []);

  return (
    <ScrubTimeline
      stops={ERAS}
      ends={ENDS}
      loop={EARTH_TIMELINE_LOOP}
      autoplay={autoplay}
      textures={textures}
      fragment={FRAGMENT}
      extensions={EXTENSIONS}
      uniforms={(frame, dt) => {
        clouds.current = drift(clouds.current, dt, frame.demo ? EARTH_TIMELINE_LOOP : null, frame.clock);
        return {
          u_spin: frame.spin,
          u_eras: [frame.from, frame.to, frame.mix],
          u_turns: frame.turns,
          u_clock: frame.elapsed,
          u_drift: clouds.current,
        };
      }}
      {...rest}
    />
  );
}
