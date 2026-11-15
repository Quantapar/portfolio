import { useCallback, useEffect, useMemo, useRef, type PointerEvent as ReactPointerEvent } from "react";
import type { Uniforms } from "./renderer";
import { ShaderCanvas, type ShaderCanvasProps } from "./shader-canvas";
import { GLOBE_R, GLOBE_Y, lerp, smooth, smoother, type Textures } from "./earth-globe";

/*
  A globe on a white page with a scrubbable ruler under it, shared by EarthTimeline and
  SolarTimeline. The globe is the caller's shader; this draws everything else: the stop under the
  playhead named beneath the globe, and a ruler of ticks that swell round the playhead like a
  magnifier, on a 2D canvas laid over the shader in the same frame callback, so a recording of both
  stays in step. Dragging the playhead spins the globe with the drag, motion-blurred, so the jump
  from one stop to the next happens inside the blur.

  Left alone it plays a scripted demo: a cursor grabs the playhead, sweeps back to the first stop
  and walks forward one at a time. The demo repeats every `loop` seconds, and the spin is tuned to
  land where it started, so a recording of exactly one loop plays seamlessly. Grabbing the ruler
  takes over from the demo.
*/

export interface Stop {
  when: string;
  name: string;
  detail: string;
  /** Longitude, in radians, turned to face the camera while the demo rests on this stop. */
  face: number;
}

// Minor ticks between stops.
const SUBDIVISIONS = 4;

// Layout, as fractions of the shorter side (`unit`) unless noted. GLOBE_Y and GLOBE_R live in earth-globe.ts.
const RULER_WIDTH = 0.46;

// Spin per stop scrubbed.
const SPIN_PER_STOP = 2.4;
// The shutter stays open for this many frames' worth of spin, at 60fps.
const SHUTTER = 1.3 / 60;

// The playhead rides a critically damped spring: stiff behind the pointer, softer settling onto a
// stop. With reduced motion it tracks the pointer and settles quickly instead of gliding, the globe
// cross-fades between stops without spinning, and the demo doesn't play.
const FOLLOW = 16;
const SETTLE = 6.5;
const FOLLOW_REDUCED = 60;
const SETTLE_REDUCED = 24;

// Dragged past either end, the playhead gives with rising resistance, never more than this many stops.
const OVERDRAG = 0.35;
const resist = (beyond: number) => (OVERDRAG * beyond) / (beyond + OVERDRAG);

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia(REDUCED_QUERY).matches;

/** Whether to tone the motion down: `"user"` follows the reduced-motion setting, `"never"` always plays it in full. */
export type TimelineReducedMotion = "user" | "never";

/** One step of a critically damped spring towards `target`, exact for any dt. */
function spring(x: number, v: number, target: number, omega: number, dt: number): [number, number] {
  const offset = x - target;
  const decay = Math.exp(-omega * dt);
  const j = (v + omega * offset) * dt;
  return [target + (offset + j) * decay, (v - omega * j) * decay];
}

/*
  The demo: rest on the last stop, grab the playhead, sweep back to the first, then walk forward a
  stop at a time and let go. Playhead keyframes are [seconds, stop]; moves between them ease in and out.
*/
const GRAB = 1.6;
const SWEEP_END = 3.35;
const STEP_FROM = 4.5;
const STEP_MOVE = 0.7;
const STEP_EVERY = 1.75;

// The cursor, in stops along the ruler and in units below it, from where it rests to the playhead and back.
const HOLD = -0.018;

function demoFor(last: number, loop: number) {
  const release = STEP_FROM + STEP_EVERY * last;
  const keys: [number, number][] = [
    [0, last],
    [GRAB + 0.15, last],
    [SWEEP_END, 0],
    [STEP_FROM, 0],
    ...Array.from({ length: last }, (_, i): [number, number][] => [
      [STEP_FROM + STEP_EVERY * i + STEP_MOVE, i + 1],
      [STEP_FROM + STEP_EVERY * (i + 1), i + 1],
    ]).flat(),
    [loop, last],
  ];

  const playheadAt = (t: number) => {
    for (let i = 1; i < keys.length; i++) {
      const [t1, p1] = keys[i]!;
      if (t <= t1) {
        const [t0, p0] = keys[i - 1]!;
        return lerp(p0, p1, smoother((t - t0) / (t1 - t0)));
      }
    }
    return last;
  };

  const rest = { x: last + 1.4, y: 0.16 };
  const cursorAt = (t: number) => {
    const press = smooth(GRAB, GRAB + 0.12, t) - smooth(release, release + 0.12, t);
    if (t < 0.8) return { ...rest, press };
    if (t < GRAB) {
      const k = smoother((t - 0.8) / (GRAB - 0.8));
      return { x: lerp(rest.x, last, k), y: lerp(rest.y, HOLD, k), press };
    }
    if (t < release + 0.2) return { x: playheadAt(t), y: HOLD, press };
    const k = smoother((t - release - 0.2) / 1);
    return { x: lerp(last, rest.x, k), y: lerp(HOLD, rest.y, k), press };
  };

  // Halfway through the demo's rest on each stop.
  const restingAt = (i: number) =>
    i === last ? 0 : i === 0 ? (SWEEP_END + STEP_FROM) / 2 : STEP_FROM + STEP_EVERY * (i - 1) + (STEP_MOVE + STEP_EVERY) / 2;

  return { playheadAt, cursorAt, restingAt };
}

interface Layout {
  unit: number;
  width: number;
  centre: number;
  when: number;
  name: number;
  ruler: number;
  left: number;
  right: number;
}

function layoutFor(width: number, height: number): Layout {
  const unit = Math.min(width, height);
  const globe = height * GLOBE_Y;
  return {
    unit,
    width,
    centre: width / 2,
    when: globe + unit * (GLOBE_R + 0.115),
    name: globe + unit * (GLOBE_R + 0.152),
    ruler: globe + unit * (GLOBE_R + 0.26),
    left: width / 2 - (unit * RULER_WIDTH) / 2,
    right: width / 2 + (unit * RULER_WIDTH) / 2,
  };
}

const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
// Seconds for a stop's text to come in, and the quicker exit of the one it replaces.
const TEXT_IN = 0.28;
const TEXT_OUT = 0.16;

const easeOut = (t: number) => 1 - (1 - Math.min(Math.max(t, 0), 1)) ** 4;

interface Overlay {
  stop: number;
  cursor: { x: number; y: number; press: number } | null;
  /** The stop whose text is coming in, and the one going out, with how visible each is. */
  shown: number;
  shownAlpha: number;
  previous: number;
  previousAlpha: number;
  /** Fade the text without moving it. */
  still: boolean;
}

function drawCursor(context: CanvasRenderingContext2D, x: number, y: number, size: number, press: number) {
  context.save();
  context.translate(x, y);
  context.scale(size * (1 - 0.12 * press), size * (1 - 0.12 * press));
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, 17);
  context.lineTo(4.2, 13.2);
  context.lineTo(6.9, 19.6);
  context.lineTo(9.6, 18.5);
  context.lineTo(6.9, 12.2);
  context.lineTo(12.3, 12.2);
  context.closePath();
  context.shadowColor = "rgba(0, 0, 0, 0.28)";
  context.shadowBlur = 3;
  context.shadowOffsetY = 1.2;
  context.lineJoin = "round";
  context.lineWidth = 1.6;
  context.strokeStyle = "#fff";
  context.stroke();
  context.shadowColor = "transparent";
  context.fillStyle = "#111";
  context.fill();
  context.restore();
}

function drawOverlay(context: CanvasRenderingContext2D, l: Layout, o: Overlay, stops: Stop[], ends: [string, string]) {
  const { unit } = l;
  const last = stops.length - 1;
  const rulerX = (stop: number) => l.left + (stop / last) * (l.right - l.left);
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.textAlign = "left";
  context.textBaseline = "alphabetic";

  // The headline and what's there, the old text blurring out upward as the new one comes in from below.
  const lines = (index: number, shift: number, alpha: number) => {
    if (index < 0 || alpha <= 0.001) return;
    const stop = stops[index]!;
    context.globalAlpha = alpha;
    context.filter = alpha < 0.999 ? `blur(${((1 - alpha) * unit * 0.004).toFixed(2)}px)` : "none";
    context.font = `600 ${unit * 0.024}px ${FONT}`;
    context.fillStyle = "#151515";
    context.fillText(stop.when, l.centre - context.measureText(stop.when).width / 2, l.when + shift);
    context.font = `500 ${unit * 0.019}px ${FONT}`;
    const name = `${stop.name}  `;
    const nameWidth = context.measureText(name).width;
    context.font = `400 ${unit * 0.019}px ${FONT}`;
    const start = l.centre - (nameWidth + context.measureText(stop.detail).width) / 2;
    context.fillStyle = "#9a9a9a";
    context.fillText(stop.detail, start + nameWidth, l.name + shift);
    context.font = `500 ${unit * 0.019}px ${FONT}`;
    context.fillStyle = "#151515";
    context.fillText(name, start, l.name + shift);
  };
  const rise = o.still ? 0 : unit * 0.012;
  lines(o.previous, -(1 - o.previousAlpha) * rise, o.previousAlpha);
  lines(o.shown, (1 - o.shownAlpha) * rise, o.shownAlpha);
  context.globalAlpha = 1;
  context.filter = "none";

  // Ticks that swell round the playhead, darker the closer they are.
  const playhead = rulerX(o.stop);
  const ticks = last * SUBDIVISIONS;
  for (let i = 0; i <= ticks; i++) {
    const x = rulerX(i / SUBDIVISIONS);
    const near = Math.exp(-(((x - playhead) / (unit * 0.03)) ** 2));
    const major = i % SUBDIVISIONS === 0;
    const height = unit * ((major ? 0.016 : 0.011) + 0.034 * near);
    const shade = Math.round(lerp(major ? 178 : 208, 120, near));
    context.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
    context.fillRect(Math.round(x - unit * 0.0007), l.ruler - height, Math.max(1, unit * 0.0014), height);
  }
  context.fillStyle = "#111";
  const head = unit * 0.05;
  context.fillRect(playhead - unit * 0.001, l.ruler - head, unit * 0.002, head);

  // The two ends, the near one darkening as the playhead reaches it.
  const label = (text: string, x: number, align: "left" | "right", reached: number) => {
    context.font = `${Math.round(lerp(400, 600, reached))} ${unit * 0.016}px ${FONT}`;
    const tone = Math.round(lerp(165, 21, reached));
    context.fillStyle = `rgb(${tone}, ${tone}, ${tone})`;
    const width = context.measureText(text).width;
    context.fillText(text, align === "left" ? x - unit * 0.004 : x - width + unit * 0.004, l.ruler + unit * 0.034);
  };
  label(ends[0], l.left, "left", 1 - smooth(0, 0.5, o.stop));
  label(ends[1], l.right, "right", smooth(last - 0.5, last, o.stop));

  if (o.cursor) {
    drawCursor(context, rulerX(o.cursor.x), l.ruler + o.cursor.y * unit, unit * 0.00125, o.cursor.press);
  }
}

/** Where the timeline is this frame, for the globe's uniforms. */
export interface TimelineFrame {
  /** Seconds of ambient motion (boiling, drifting clouds) since mount; holds still with reduced motion. */
  elapsed: number;
  /** Seconds into the demo's loop, or since it stopped. */
  clock: number;
  /** Whether the demo is playing. */
  demo: boolean;
  /** The playhead, in stops. */
  position: number;
  /** Spin in radians, and how far the globe turns while the shutter is open. */
  spin: [number, number];
  /** The stops either side of the playhead, how far the globe has changed from the first to the second, and each one's extra turn. */
  from: number;
  to: number;
  mix: number;
  turns: [number, number];
}

export interface ScrubTimelineProps
  extends Omit<ShaderCanvasProps, "vertex" | "geometry" | "uniforms" | "textures" | "onFrame"> {
  stops: Stop[];
  /** Labels under the ruler's two ends. */
  ends: [string, string];
  /** Seconds per loop of the demo. */
  loop: number;
  /** Play the scripted demo, with a cursor, until someone grabs the ruler. */
  autoplay: boolean;
  reducedMotion?: TimelineReducedMotion;
  /** The globe's textures; renders no globe while null. */
  textures: Textures | null;
  /** The globe's uniforms for a frame, with the seconds of ambient motion it covers. */
  uniforms: (frame: TimelineFrame, dt: number) => Uniforms;
}

export function ScrubTimeline({
  stops,
  ends,
  loop,
  autoplay,
  reducedMotion = "user",
  textures,
  uniforms,
  maxPixelRatio = 2,
  style,
  className,
  ...rest
}: ScrubTimelineProps) {
  const last = stops.length - 1;
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const uniformsRef = useRef(uniforms);
  const demo = useMemo(() => demoFor(last, loop), [last, loop]);
  const reducedAtMount = reducedMotion === "user" && prefersReducedMotion();
  const state = useRef({
    clock: 0,
    elapsed: 0,
    ambient: 0,
    demo: autoplay && !reducedAtMount,
    stop: last,
    previousStop: last,
    target: last,
    speed: 0,
    velocity: 0,
    dragging: false,
    pointer: -1,
    reduced: reducedAtMount,
    shown: last,
    shownFrom: 1,
    previousShown: -1,
    previousFrom: 0,
    since: -1,
  });

  useEffect(() => {
    const query = window.matchMedia(REDUCED_QUERY);
    const update = () => {
      const s = state.current;
      s.reduced = reducedMotion === "user" && query.matches;
      if (s.reduced && s.demo) {
        s.demo = false;
        s.target = Math.round(s.stop);
        s.speed = 0;
      }
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [reducedMotion]);

  useEffect(() => {
    state.current.demo = autoplay && !state.current.reduced;
  }, [autoplay]);

  useEffect(() => {
    uniformsRef.current = uniforms;
  }, [uniforms]);

  const onFrame = useCallback(
    (dt: number): Uniforms => {
      const { playheadAt, cursorAt, restingAt } = demo;
      const s = state.current;
      s.elapsed += dt;
      // With reduced motion the globe holds still between scrubs: no idle turn, no boiling or drifting.
      const ambientDt = s.reduced ? 0 : dt;
      s.ambient += ambientDt;
      if (s.demo) {
        s.clock = (s.clock + dt) % loop;
        s.stop = playheadAt(s.clock);
        // Measured over a fixed step, so the blur doesn't depend on the frame rate.
        s.velocity = (playheadAt(s.clock + 0.004) - playheadAt(s.clock - 0.004)) / 0.008;
      } else {
        const omega = s.reduced ? (s.dragging ? FOLLOW_REDUCED : SETTLE_REDUCED) : s.dragging ? FOLLOW : SETTLE;
        [s.stop, s.speed] = spring(s.stop, s.speed, s.target, omega, dt);
        const step = dt > 0 ? (s.stop - s.previousStop) / dt : 0;
        s.velocity += (step - s.velocity) * (1 - Math.exp(-dt * 20));
        s.clock += ambientDt;
      }
      s.previousStop = s.stop;

      // Each line fades from wherever it was, so passing several stops in a row never pops.
      const alphas = () => {
        const age = s.elapsed - s.since;
        return [lerp(s.shownFrom, 1, easeOut(age / TEXT_IN)), s.previousFrom * (1 - easeOut(age / TEXT_OUT))] as const;
      };
      const shown = Math.min(last, Math.max(0, Math.round(s.stop)));
      if (shown !== s.shown) {
        const [shownAlpha, previousAlpha] = alphas();
        s.shownFrom = shown === s.previousShown ? previousAlpha : 0;
        s.previousFrom = shownAlpha;
        s.previousShown = s.shown;
        s.shown = shown;
        s.since = s.elapsed;
      }
      const [shownAlpha, previousAlpha] = alphas();

      const canvas = overlayRef.current;
      const context = canvas?.getContext("2d");
      if (canvas && context) {
        const ratio = Math.min(window.devicePixelRatio || 1, maxPixelRatio);
        const width = Math.round(canvas.clientWidth * ratio);
        const height = Math.round(canvas.clientHeight * ratio);
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        drawOverlay(
          context,
          layoutFor(width, height),
          {
            stop: s.stop,
            cursor: s.demo ? cursorAt(s.clock) : null,
            shown: s.shown,
            shownAlpha,
            previous: s.previousShown,
            previousAlpha,
            still: s.reduced,
          },
          stops,
          ends,
        );
      }

      // Between two stops, both are drawn and mixed; once the mix is all one way, only that one is.
      let from = Math.min(Math.max(Math.floor(s.stop), 0), last - 1);
      let mix = smooth(0.3, 0.7, s.stop - from);
      if (mix > 0.999) {
        from += 1;
        mix = 0;
      }
      const to = Math.min(from + 1, last);

      // At rest a whole turn per loop, so the demo lands where it started; plus a turn per stop
      // scrubbed, and each stop's extra turn so its `face` points at the camera while the demo rests on it.
      const spinRest = (Math.PI * 2) / loop;
      const perStop = s.reduced ? 0 : SPIN_PER_STOP;
      const turn = (i: number) => stops[i]!.face - (spinRest * restingAt(i) + perStop * (i - last));
      return uniformsRef.current(
        {
          elapsed: s.ambient,
          clock: s.clock,
          demo: s.demo,
          position: s.stop,
          spin: [spinRest * s.clock + perStop * (s.stop - last), Math.abs(spinRest + perStop * s.velocity) * SHUTTER],
          from,
          to,
          mix,
          turns: [turn(from), turn(to)],
        },
        ambientDt,
      );
    },
    [demo, last, loop, stops, ends, maxPixelRatio],
  );

  // Grabbing the ruler stops the demo; the playhead glides after the pointer and, on release, on
  // into the stop nearest where the pointer let go, springing back if it was pulled past an end.
  const toStop = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const l = layoutFor(rect.width, rect.height);
    const at = ((event.clientX - rect.left - l.left) / (l.right - l.left)) * last;
    return at < 0 ? -resist(-at) : at > last ? last + resist(at - last) : at;
  };
  const overRuler = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const l = layoutFor(rect.width, rect.height);
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return x >= l.left - l.unit * 0.03 && x <= l.right + l.unit * 0.03 && Math.abs(y - (l.ruler - l.unit * 0.02)) <= l.unit * 0.06;
  };
  const onPointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const s = state.current;
    // One pointer at a time, so a second finger can't yank the playhead.
    if (s.dragging || !overRuler(event)) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.style.cursor = "grabbing";
    if (s.demo) s.speed = s.velocity;
    s.demo = false;
    s.dragging = true;
    s.pointer = event.pointerId;
    s.target = toStop(event);
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const s = state.current;
    if (s.dragging) {
      if (event.pointerId === s.pointer) s.target = toStop(event);
    } else if (event.pointerType === "mouse") {
      event.currentTarget.style.cursor = overRuler(event) ? "grab" : "";
    }
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const s = state.current;
    if (!s.dragging || event.pointerId !== s.pointer) return;
    s.dragging = false;
    s.target = Math.min(last, Math.max(0, Math.round(s.target)));
    event.currentTarget.style.cursor = overRuler(event) ? "grab" : "";
  };

  return (
    <div className={className} style={{ position: "relative", width: "100%", height: "100%", ...style }}>
      {/* Never paused for reduced motion by default: the ruler needs frames to respond, and onFrame tones the motion down itself. */}
      {textures && <ShaderCanvas textures={textures} onFrame={onFrame} maxPixelRatio={maxPixelRatio} paused={false} {...rest} />}
      <canvas
        ref={overlayRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", touchAction: "none" }}
      />
    </div>
  );
}
