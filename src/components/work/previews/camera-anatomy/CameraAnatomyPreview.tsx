import { useEffect, useRef, useState } from "react";
import { TURN } from "../anatomy-kit/turn.mjs";
import "../anatomy-kit/iso.css";
import "../anatomy-kit/turn.css";
import "./camera-anatomy.css";
import figureUrl from "./figure.json?url";
import { SHOT_SECONDS, follow } from "./motion";

// Generated ahead of time: the stage markup is the camera at rest, and `turn` is
// what the Anatomy runtime re-projects every frame.
type Figure = {
  width: number;
  height: number;
  /** ViewBox units per millimetre. */
  scale: number;
  camera: {
    ox: number;
    oy: number;
    k: number;
    azimuth: number;
    elevation: number;
  };
  /** The base's outline on the ground, in millimetres, for the shadow. */
  shadow: [number, number][];
  stage: string;
  turn: unknown;
  systems: { id: string; label: string }[];
};

const RAD = Math.PI / 180;
const REST_HEADING = -62; // three-quarter view: front and wind side toward the viewer
const TOUR_SPEED = 9; // degrees a second
const IN_VIEW = 0.01; // the share of the stage on screen before anything animates
const TOUR_RESUME = 3600;
const SHOT_EVERY = 4.2; // seconds between exposures while the camera is left alone
const DRAG_SLOP = 4;
// How far the drawing reaches from the middle of its 640 x 520 frame once the
// camera is apart, over a full turn and a wind stroke (measured on the page).
const APART = { side: 416, above: 322, below: 279 };
const GRIP_RADIUS = 60; // mm: the body's skin under the pointer follows it at about this radius

/** Critically damped approach to a target, four sub-steps a frame. */
function settle(
  state: { x: number; v: number },
  target: number,
  dt: number,
  seconds: number,
  near = 1e-4,
) {
  const w = 1 / seconds;
  for (let step = 0; step < 4; step++) {
    const h = dt / 4;
    state.v += (w * w * (target - state.x) - 2 * w * state.v) * h;
    state.x += state.v * h;
  }
  if (Math.abs(target - state.x) < near && Math.abs(state.v) < near * 4) {
    state.x = target;
    state.v = 0;
    return false;
  }
  return true;
}

function mountCamera(stage: HTMLDivElement, figure: Figure) {
  stage.innerHTML = figure.stage;
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const controller = TURN.mount(stage, figure.turn, { follow });
  const parts = [
    ...stage.querySelectorAll<SVGGElement>("svg[data-live] [data-name]"),
  ];
  const systemOf = (node: Element | null) =>
    node?.closest("[data-name]")?.getAttribute("data-name")?.split(".")[0] ??
    null;
  const ground = stage.querySelector<SVGPathElement>("[data-ground]")!;

  let heading = REST_HEADING;
  let target = REST_HEADING;
  const open = { x: 0, v: 0 };
  let opened = false; // what the reader asked for; `open` eases toward it
  let shot = SHOT_SECONDS; // seconds into the exposure cycle; at the end, the camera is at rest
  let sinceShot = 0;
  let drawn: { heading: number; open: number; shot: number } | null = null;
  let selected: string | null = null;
  let frame = 0;
  let last = 0;
  let visible = false;
  let revealed = false;
  let touring = !still.matches;
  let idle = 0;
  // Apart, the camera steps back just far enough to stay inside its section.
  const room = stage.closest("section") ?? stage;
  let apart = { scale: 1, drop: 0 };

  const paint = () => {
    // At the end of the cycle everything is back where it began: draw it as time 0.
    controller.set({
      cam: heading,
      open: open.x,
      shot: shot >= SHOT_SECONDS ? 0 : shot,
    });
    // The shadow lies under the base and turns with it. It belongs to the
    // closed camera; the parts that leave take theirs with them.
    const turn = heading * RAD;
    const { ox, oy, k, azimuth, elevation } = figure.camera;
    ground.setAttribute(
      "d",
      figure.shadow
        .map(([x, y], index) => {
          const [wx, wy] = [
            x * Math.cos(turn) - y * Math.sin(turn),
            x * Math.sin(turn) + y * Math.cos(turn),
          ];
          const sx = ox + (wx * Math.sin(azimuth) - wy * Math.cos(azimuth)) * k;
          const sy =
            oy +
            ((wx * Math.cos(azimuth) + wy * Math.sin(azimuth)) *
              Math.sin(elevation) +
              Math.cos(elevation)) *
              k;
          return `${index ? "L" : "M"}${sx.toFixed(1)} ${sy.toFixed(1)}`;
        })
        .join("") + "Z",
    );
    ground.style.opacity = String(1 - 0.45 * open.x);
    const scale = 1 + (apart.scale - 1) * open.x;
    stage.style.transform =
      open.x > 0
        ? `translateY(${(apart.drop * open.x).toFixed(2)}px) scale(${scale.toFixed(4)})`
        : "";
    drawn = { heading, open: open.x, shot };
  };

  const describe = () => {
    const turned = Math.round((((target - REST_HEADING) % 360) + 360) % 360);
    const system = figure.systems.find((entry) => entry.id === selected);
    stage.setAttribute("aria-valuenow", String(turned));
    stage.setAttribute(
      "aria-valuetext",
      `Camera ${opened ? "taken apart" : "assembled"}, turned ${turned} degrees${system ? `, ${system.label} highlighted` : ""}`,
    );
  };

  const select = (id: string | null) => {
    if (id === selected) return;
    selected = id;
    for (const part of parts)
      part.toggleAttribute("data-on", id !== null && systemOf(part) === id);
    describe();
  };

  function tick(now: number) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    const calm = still.matches;
    const onTour = touring && !calm;
    if (onTour) {
      target += TOUR_SPEED * dt;
      // Left alone, the camera takes a picture every few seconds.
      sinceShot += dt;
      if (sinceShot > SHOT_EVERY && shot >= SHOT_SECONDS) fire();
    }
    heading = calm
      ? target
      : heading + (target - heading) * (1 - Math.exp(-dt / 0.12));
    if (Math.abs(target - heading) < 1e-3) heading = target;
    let opening = false;
    if (calm) open.x = opened ? 1 : 0;
    else opening = settle(open, opened ? 1 : 0, dt, 0.34, 2e-3);
    const firing = shot < SHOT_SECONDS;
    if (firing) shot = calm ? SHOT_SECONDS : Math.min(SHOT_SECONDS, shot + dt);
    if (
      !drawn ||
      Math.abs(heading - drawn.heading) > 1e-4 ||
      open.x !== drawn.open ||
      shot !== drawn.shot
    )
      paint();
    const settled =
      !onTour && heading === target && !opening && shot >= SHOT_SECONDS;
    frame = visible && !settled ? requestAnimationFrame(tick) : 0;
  }
  const run = () => {
    if (!frame && visible) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  };
  const hold = () => {
    touring = false;
    clearTimeout(idle);
    idle = window.setTimeout(() => {
      touring = !still.matches;
      run();
    }, TOUR_RESUME);
  };
  const setOpen = (next: boolean) => {
    opened = next;
    describe();
    run();
  };
  function fire() {
    if (shot < SHOT_SECONDS) return; // one exposure at a time, as the real interlock insists
    shot = 0;
    sinceShot = 0;
    run();
  }

  const watcher = new IntersectionObserver(
    (entries) => {
      const entry = entries[entries.length - 1];
      // A section lying exactly against the viewport's edge counts as
      // intersecting with nothing showing: ask for a sliver actually in view.
      visible = entry.intersectionRatio >= IN_VIEW;
      // The camera comes apart the first time it is properly in view.
      if (!revealed && entry.intersectionRatio > 0.45) {
        revealed = true;
        setOpen(true);
      }
      if (visible) run();
      else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    { threshold: [IN_VIEW, 0.45] },
  );
  watcher.observe(stage);

  const fit = () => {
    const unit = stage.clientWidth / figure.width;
    if (!unit) return;
    const tall = (APART.above + APART.below) / 2;
    // The section's padding stays clear of the drawing: the link back to the site sits in the bottom of it.
    const pad = getComputedStyle(room);
    const wide =
      room.clientWidth -
      parseFloat(pad.paddingLeft) -
      parseFloat(pad.paddingRight);
    const high =
      Math.min(room.clientHeight, window.innerHeight) -
      parseFloat(pad.paddingTop) -
      parseFloat(pad.paddingBottom);
    const scale = Math.min(
      1,
      wide / 2 / (APART.side * unit),
      high / 2 / (tall * unit),
    );
    // The parts reach further up than down: lower the drawing by half the difference.
    apart = { scale, drop: ((APART.above - APART.below) / 2) * unit * scale };
    drawn = null;
    if (frame) return;
    paint();
  };
  const sizes = new ResizeObserver(fit);
  sizes.observe(room);

  const degreesPerPixel = () => {
    const box = stage.getBoundingClientRect();
    const unit =
      Math.min(box.width / figure.width, box.height / figure.height) || 1;
    return 1 / (GRIP_RADIUS * figure.scale * unit * RAD);
  };
  let drag: {
    id: number;
    x: number;
    y: number;
    base: number;
    captured: boolean;
    on: string | null;
  } | null = null;
  const onDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    hold();
    const under = event.target instanceof Element ? event.target : null;
    drag = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      base: target,
      captured: false,
      on: under?.closest("[data-name]")?.getAttribute("data-name") ?? null,
    };
  };
  const onMove = (event: PointerEvent) => {
    if (drag && event.pointerId === drag.id) {
      const dx = event.clientX - drag.x;
      if (
        !drag.captured &&
        Math.abs(dx) > DRAG_SLOP &&
        Math.abs(dx) > Math.abs(event.clientY - drag.y)
      ) {
        drag.captured = true;
        stage.setPointerCapture(event.pointerId);
        stage.setAttribute("data-drag", "");
      }
      if (!drag.captured) return;
      hold();
      target = drag.base - dx * degreesPerPixel();
      describe();
      run();
      return;
    }
    if (event.pointerType === "mouse") {
      const under = event.target instanceof Element ? event.target : null;
      const system = under?.closest("svg[data-live]") ? systemOf(under) : null;
      if (system !== selected) hold();
      select(system);
    }
  };
  const onUp = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.id) return;
    const { captured, on } = drag;
    const tapped =
      !captured &&
      Math.hypot(event.clientX - drag.x, event.clientY - drag.y) <= DRAG_SLOP;
    drag = null;
    stage.removeAttribute("data-drag");
    if (stage.hasPointerCapture(event.pointerId))
      stage.releasePointerCapture(event.pointerId);
    if (!tapped || event.type !== "pointerup") return;
    // A tap on the shutter release takes a picture; anywhere else opens or closes the camera.
    if (on?.startsWith("shut.release")) fire();
    else setOpen(!opened);
  };
  const onLeave = (event: PointerEvent) => {
    if (event.pointerType === "mouse" && !drag) select(null);
  };
  const onKey = (event: KeyboardEvent) => {
    const step = event.shiftKey ? 45 : 15;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      target =
        Math.round(target / 15) * 15 +
        (event.key === "ArrowLeft" ? step : -step);
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      const ids = figure.systems.map((entry) => entry.id);
      const at = selected ? ids.indexOf(selected) : -1;
      select(
        ids[
          event.key === "ArrowUp"
            ? (at + 1) % ids.length
            : (at <= 0 ? ids.length : at) - 1
        ],
      );
      // Most of every system is inside: take the camera apart so what is highlighted can be seen.
      opened = true;
    } else if (event.key === " ") {
      opened = !opened;
    } else if (
      event.key === "Enter" ||
      event.key === "f" ||
      event.key === "F"
    ) {
      fire();
    } else if (event.key === "Escape") {
      select(null);
    } else if (event.key === "Home") {
      target = REST_HEADING + 360 * Math.round((target - REST_HEADING) / 360);
    } else return;
    event.preventDefault();
    hold();
    describe();
    run();
  };
  const onMotionChange = () => {
    touring = !still.matches;
    run();
  };

  stage.addEventListener("pointerdown", onDown);
  stage.addEventListener("pointermove", onMove);
  stage.addEventListener("pointerup", onUp);
  stage.addEventListener("pointercancel", onUp);
  stage.addEventListener("pointerleave", onLeave);
  stage.addEventListener("keydown", onKey);
  still.addEventListener("change", onMotionChange);
  paint();
  describe();

  return () => {
    cancelAnimationFrame(frame);
    clearTimeout(idle);
    watcher.disconnect();
    sizes.disconnect();
    stage.style.transform = "";
    stage.removeEventListener("pointerdown", onDown);
    stage.removeEventListener("pointermove", onMove);
    stage.removeEventListener("pointerup", onUp);
    stage.removeEventListener("pointercancel", onUp);
    stage.removeEventListener("pointerleave", onLeave);
    stage.removeEventListener("keydown", onKey);
    still.removeEventListener("change", onMotionChange);
    controller.destroy();
    stage.innerHTML = "";
  };
}

export function CameraAnatomyPreview() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [figure, setFigure] = useState<Figure | null>(null);

  useEffect(() => {
    const request = new AbortController();
    fetch(figureUrl, { signal: request.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(setFigure)
      .catch((error: unknown) => {
        if (!request.signal.aborted)
          console.error("Camera figure failed to load", error);
      });
    return () => request.abort();
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!figure || !stage) return;
    // The figure is decoration for the page around it: if its data and this
    // code ever disagree, leave the section empty rather than throw from an
    // effect, which would unmount the whole app.
    try {
      return mountCamera(stage, figure);
    } catch (error) {
      console.error("Camera figure failed to mount", error);
      stage.innerHTML = "";
    }
  }, [figure]);

  return (
    <section className="camera-stage" aria-label="Interactive camera anatomy">
      <div
        className="iso camera"
        data-theme="light"
        data-ready={figure ? "" : undefined}
      >
        <div
          ref={stageRef}
          className="iso-stage iso-turn camera__stage"
          tabIndex={0}
          role="slider"
          aria-label="Single-lens reflex camera. Drag or use the left and right arrow keys to turn it, press Space to take it apart or put it back together, press Enter to fire the shutter, and use the up and down arrow keys to step through its systems."
          aria-valuemin={0}
          aria-valuemax={359}
          aria-valuenow={0}
        />
      </div>
    </section>
  );
}
