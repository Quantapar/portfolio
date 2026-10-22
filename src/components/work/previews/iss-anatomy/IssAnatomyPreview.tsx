import { useEffect, useRef, useState } from "react";
import { TURN } from "../anatomy-kit/turn.mjs";
import "../anatomy-kit/iso.css";
import "../anatomy-kit/turn.css";
import "./iss-anatomy.css";
import { VISIT_SECONDS, follow } from "./motion";

// Fetched when the piece opens, so the large drawing stays out of the script.
const figureUrl = new URL("./figure.json", import.meta.url).href;

// Generated ahead of time: the stage markup is the station at rest, and `turn` is
// what the Anatomy runtime re-projects every frame.
type Figure = {
  width: number;
  height: number;
  /** ViewBox units per decimetre. */
  scale: number;
  /** How far the drawing reaches from the middle of its frame once the station is apart, over a full turn. */
  apart: { side: number; above: number; below: number };
  stage: string;
  turn: unknown;
  systems: { id: string; label: string }[];
};

const RAD = Math.PI / 180;
const REST_HEADING = 28; // from ahead and above: the truss across the frame, the laboratories and the crew ship in front
const TOUR_SPEED = 5; // degrees a second
const IN_VIEW = 0.01; // the share of the stage on screen before anything animates
const TOUR_RESUME = 3600;
const VISIT_EVERY = 22; // seconds from one fly-around's start to the next while the station is left alone
const DRAG_SLOP = 4;
const GRIP_RADIUS = 300; // decimetres: the truss under the pointer follows it at about this radius
// A turn redraws every part. Where that takes longer than a frame, an even
// thirty frames a second reads better than sixty with every third one dropped.
const LATE_MS = 20; // a frame that took longer than this missed its slot
const LATE_SHARE = 0.3; // this share of late frames is a machine that can't keep up
const RETRY_MS = 4000; // how long to hold the slower pace before trying the full one again

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

function mountStation(stage: HTMLDivElement, figure: Figure) {
  stage.innerHTML = figure.stage;
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const controller = TURN.mount(stage, figure.turn, { follow });
  const parts = [
    ...stage.querySelectorAll<SVGGElement>("svg[data-live] [data-name]"),
  ];
  const systemOf = (node: Element | null) =>
    node?.closest("[data-name]")?.getAttribute("data-name")?.split(".")[0] ??
    null;

  let heading = REST_HEADING;
  let target = REST_HEADING;
  const open = { x: 0, v: 0 };
  let opened = false; // what the reader asked for; `open` eases toward it
  let visit = VISIT_SECONDS; // seconds into the crew ship's fly-around; at the end, it is docked again
  let sinceVisit = 0;
  let drawn: { heading: number; open: number; visit: number } | null = null;
  let selected: string | null = null;
  let frame = 0;
  let last = 0;
  let visible = false;
  let touring = !still.matches;
  let idle = 0;
  let halved = false; // painting every other frame
  let skip = false;
  let late = 0; // the running share of frames that missed their slot at the full pace
  let retryAt = 0;
  let retryAfter = RETRY_MS;
  // Apart, the station steps back just far enough to stay inside its section.
  const room = stage.closest("section") ?? stage;
  let apart = { scale: 1, drop: 0 };

  const paint = () => {
    // At the end of the fly-around the ship is back on its port: draw it as time 0.
    controller.set({
      iss: heading,
      open: open.x,
      visit: visit >= VISIT_SECONDS ? 0 : visit,
    });
    // The stage is drawn mirrored (see iss.css), so every transform set here keeps the flip.
    const scale = 1 + (apart.scale - 1) * open.x;
    stage.style.transform =
      open.x > 0
        ? `translateY(${(apart.drop * open.x).toFixed(2)}px) scale(${(-scale).toFixed(4)}, ${scale.toFixed(4)})`
        : "";
    drawn = { heading, open: open.x, visit };
  };

  const describe = () => {
    const turned = Math.round((((target - REST_HEADING) % 360) + 360) % 360);
    const system = figure.systems.find((entry) => entry.id === selected);
    stage.setAttribute("aria-valuenow", String(turned));
    stage.setAttribute(
      "aria-valuetext",
      `Station ${opened ? "pulled apart into its elements" : "assembled"}, turned ${turned} degrees${system ? `, ${system.label} highlighted` : ""}`,
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
    if (halved) {
      if (now > retryAt) {
        halved = false;
        late = 0;
      }
    } else if (last && drawn) {
      late += ((now - last > LATE_MS ? 1 : 0) - late) * 0.05;
      if (late > LATE_SHARE) {
        halved = true;
        retryAt = now + retryAfter;
        retryAfter = Math.min(retryAfter * 2, 32000); // each failed try waits longer before the next
      }
    }
    last = now;
    const calm = still.matches;
    const onTour = touring && !calm;
    if (onTour) {
      target += TOUR_SPEED * dt;
      // Left alone and whole, the crew ship backs off for a look round every so often.
      sinceVisit += dt;
      if (sinceVisit > VISIT_EVERY && visit >= VISIT_SECONDS && !opened)
        depart();
    }
    heading = calm
      ? target
      : heading + (target - heading) * (1 - Math.exp(-dt / 0.12));
    if (Math.abs(target - heading) < 1e-3) heading = target;
    let opening = false;
    if (calm) open.x = opened ? 1 : 0;
    else opening = settle(open, opened ? 1 : 0, dt, 0.5, 2e-3);
    const away = visit < VISIT_SECONDS;
    if (away)
      visit = calm ? VISIT_SECONDS : Math.min(VISIT_SECONDS, visit + dt);
    const changed =
      !drawn ||
      Math.abs(heading - drawn.heading) > 1e-4 ||
      open.x !== drawn.open ||
      visit !== drawn.visit;
    const settled =
      !onTour && heading === target && !opening && visit >= VISIT_SECONDS;
    // At the slower pace every other frame is skipped; the motion keeps its own time.
    skip = halved && !skip && !settled;
    if (changed && !skip) paint();
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
  function depart() {
    if (visit < VISIT_SECONDS) return; // one fly-around at a time
    visit = 0;
    sinceVisit = 0;
    run();
  }

  const watcher = new IntersectionObserver(
    (entries) => {
      const entry = entries[entries.length - 1];
      // A section lying exactly against the viewport's edge counts as
      // intersecting with nothing showing: ask for a sliver actually in view.
      visible = entry.intersectionRatio >= IN_VIEW;
      if (visible) run();
      else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    { threshold: [IN_VIEW] },
  );
  watcher.observe(stage);

  const fit = () => {
    const unit = stage.clientWidth / figure.width;
    if (!unit) return;
    const { side, above, below } = figure.apart;
    const tall = (above + below) / 2;
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
      wide / 2 / (side * unit),
      high / 2 / (tall * unit),
    );
    // The parts reach further one way than the other: shift the drawing by half the difference.
    const drop = ((above - below) / 2) * unit * scale;
    if (scale === apart.scale && drop === apart.drop) return;
    apart = { scale, drop };
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
      target = drag.base + dx * degreesPerPixel();
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
    // A tap on the crew ship sends it round; anywhere else pulls the station apart or closes it up.
    if (on?.startsWith("dragon.") && !opened) depart();
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
        (event.key === "ArrowLeft" ? -step : step);
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
    } else if (event.key === " ") {
      opened = !opened;
    } else if (
      event.key === "Enter" ||
      event.key === "d" ||
      event.key === "D"
    ) {
      depart();
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

export function IssAnatomyPreview() {
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
          console.error("Station figure failed to load", error);
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
      return mountStation(stage, figure);
    } catch (error) {
      console.error("Station figure failed to mount", error);
      stage.innerHTML = "";
    }
  }, [figure]);

  return (
    <section
      className="iss-stage"
      aria-label="Interactive International Space Station anatomy"
    >
      <div
        className="iso iss"
        data-theme="light"
        data-ready={figure ? "" : undefined}
      >
        <div
          ref={stageRef}
          className="iso-stage iso-turn iss__stage"
          tabIndex={0}
          role="slider"
          aria-label="International Space Station. Drag or use the left and right arrow keys to turn it, press Space to pull it apart into its elements or close it up, press Enter to send the crew ship on a fly-around, and use the up and down arrow keys to step through its elements."
          aria-valuemin={0}
          aria-valuemax={359}
          aria-valuenow={0}
        />
      </div>
    </section>
  );
}
