import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import caseBackUrl from "./art/case-back.webp";
import caseBackSmallUrl from "./art/case-back-m.webp";
import caseFrontUrl from "./art/case-front.webp";
import caseFrontSmallUrl from "./art/case-front-m.webp";
import caseInsideUrl from "./art/case-inside.webp";
import caseInsideSmallUrl from "./art/case-inside-m.webp";
import caseSpineUrl from "./art/case-spine.webp";
import caseSpineSmallUrl from "./art/case-spine-m.webp";
import textUrl from "./art/logo-text.webp";
import viUrl from "./art/logo-vi.webp";
import panelsUrl from "./art/panels.webp";
import panelsSmallUrl from "./art/panels-m.webp";
import posterAUrl from "./art/poster-a.webp";
import posterASmallUrl from "./art/poster-a-m.webp";
import posterBUrl from "./art/poster-b.webp";
import posterBSmallUrl from "./art/poster-b-m.webp";
import { createSoundtrack, soundtrackExists, type Soundtrack } from "./audio.ts";
import { createDisc, preloadDisc, type DiscController } from "./scene.ts";
import { SunsetButton } from "./SunsetButton.tsx";
import "./gta.css";

/* A Grand Theft Auto VI game disc, as a retail pressing would look: Rockstar's
   official cover art on the label, the read side's rainbow, a clear hub you can
   see through. It starts shut in its case: swing the cover open, pull the disc off
   the hub, and the soundtrack comes in as it leaves. Then it tumbles slowly in a
   light room, as on desktop.fm; drag to throw it, press and hold to make it turn
   faster. Fan art: the artwork is Rockstar's, from rockstargames.com/VI.

   The soundtrack lives at public/work/gta-disc/soundtrack.m4a and loops; without that file the
   sound button says so. */

const SOUNDTRACK = "/work/gta-disc/soundtrack.m4a";

type Sound = "checking" | "missing" | "off" | "on";

// The box's print is drawn large (the back at 3200 × 4000) for close looks on a desktop. A
// phone's screen can't show that much, and its graphics memory won't hold it all, so it
// gets its own files, 2048 on the long side.
const SMALL_SCREEN = window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;
// Images imported here arrive as objects that carry their URL.
const pick = (big: { src: string }, small: { src: string }) => (SMALL_SCREEN ? small : big).src;

function loadImage(src: string, priority: "high" | "low") {
  const img = new Image();
  img.decoding = "async";
  img.fetchPriority = priority;
  img.src = src;
  return img.decode().then(() => img);
}

// Everything starts downloading as soon as this script runs. The page waits only for
// what the shut box shows (its outside and the room's light); the inside, the poster
// and the disc's label come in behind it, before anyone has the case open.
const art = {
  front: loadImage(pick(caseFrontUrl, caseFrontSmallUrl), "high"),
  back: loadImage(pick(caseBackUrl, caseBackSmallUrl), "high"),
  spine: loadImage(pick(caseSpineUrl, caseSpineSmallUrl), "high"),
  scene: preloadDisc(),
  inside: loadImage(pick(caseInsideUrl, caseInsideSmallUrl), "low"),
  posterA: loadImage(pick(posterAUrl, posterASmallUrl), "low"),
  posterB: loadImage(pick(posterBUrl, posterBSmallUrl), "low"),
  label: Promise.all([
    loadImage(pick(panelsUrl, panelsSmallUrl), "low"),
    loadImage(viUrl.src, "low"),
    loadImage(textUrl.src, "low"),
  ]).then(([panels, vi, text]) => ({ panels, vi, text })),
};
const CRITICAL = [art.front, art.back, art.spine, art.scene];

export function GtaDiscPreview() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const disc = useRef<DiscController | null>(null);
  const track = useRef<Soundtrack | null>(null);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const [out, setOut] = useState(false);
  const [sound, setSound] = useState<Sound>("checking");
  // The disc leaving the case starts the music; read from the scene's callback.
  const onRelease = useRef(() => {});
  // And back into its case, the music with it, and the button until it comes out again.
  const onReturn = useRef(() => {});
  // Kept current after every render, so the scene's callbacks always see the latest sound state.
  useLayoutEffect(() => {
    onRelease.current = () => {
      setOut(true);
      if (sound === "off") void startSound();
    };
    onReturn.current = () => {
      setOut(false);
      if (sound === "on") {
        track.current?.pause();
        setSound("off");
      }
    };
  });

  useEffect(() => {
    let cancelled = false;
    let resize: ResizeObserver | undefined;
    let seen: IntersectionObserver | undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    for (const p of CRITICAL) p.then(() => !cancelled && setLoaded((n) => n + 1), () => {});

    Promise.all([art.front, art.back, art.spine])
      .then(async ([front, back, spine]) => {
        const el = canvas.current;
        if (cancelled || !el || !section.current) return;
        const c = await createDisc(
          el,
          art.label,
          { front, back, spine, inside: art.inside },
          { a: art.posterA, b: art.posterB },
          { reducedMotion, onRelease: () => onRelease.current(), onReturn: () => onReturn.current() },
        );
        if (cancelled || !section.current) {
          c.dispose();
          return;
        }
        disc.current = c;
        c.setSize(el.clientWidth, el.clientHeight);
        resize = new ResizeObserver(() => c.setSize(el.clientWidth, el.clientHeight));
        resize.observe(el);
        // Two full-height sections touching at the viewport edge both report
        // "intersecting" at ratio 0; only a visible sliver counts.
        seen = new IntersectionObserver(
          ([entry]) => {
            const visible = entry.intersectionRatio >= 0.01;
            c.setActive(visible);
            track.current?.setVisible(visible);
          },
          { threshold: [0, 0.01, 0.2] },
        );
        seen.observe(section.current);
        setReady(true);
      })
      .catch((error) => console.error("GTA VI disc failed to load", error));

    return () => {
      cancelled = true;
      resize?.disconnect();
      seen?.disconnect();
      disc.current?.dispose();
      disc.current = null;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    soundtrackExists(SOUNDTRACK).then((ok) => {
      if (!alive) return;
      if (ok) track.current = createSoundtrack(SOUNDTRACK);
      setSound(ok ? "off" : "missing");
    });
    return () => {
      alive = false;
      track.current?.dispose();
      track.current = null;
    };
  }, []);

  async function startSound() {
    const t = track.current;
    if (!t) return;
    setSound("on");
    try {
      await t.play();
    } catch {
      setSound("off");
    }
  }

  function toggleSound() {
    if (sound === "on") {
      track.current?.pause();
      setSound("off");
    } else {
      void startSound();
    }
  }

  function onPointerDown(e: PointerEvent<HTMLCanvasElement>) {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    // The music starts when the disc leaves the case, mid-drag maybe, with no gesture of
    // its own; unlock it now, on this one.
    if (!out) track.current?.prime();
    disc.current?.pointerDown(e.clientX, e.clientY);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      if (disc.current?.back()) e.preventDefault();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      disc.current?.nudge(e.key === "ArrowLeft" ? -1 : 1);
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (e.repeat) return;
      if (!out) track.current?.prime();
      if (!disc.current?.advance()) disc.current?.hold(true);
    }
  }

  function onKeyUp(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === " " || e.key === "Enter") disc.current?.hold(false);
  }

  const showSound = out && (sound === "off" || sound === "on" || (sound === "missing" && process.env.NODE_ENV === "development"));

  return (
    <section ref={section} className="gd" aria-label="Grand Theft Auto VI disc">
      <div
        className="gd-stage"
        tabIndex={0}
        role="group"
        aria-roledescription="3D disc"
        aria-label={
          out
            ? "Grand Theft Auto VI disc. Arrow keys turn it; hold Space to turn it faster; Escape puts it back in its case."
            : "Grand Theft Auto VI, in its case. Drag the cover open, then pull the disc out; or press Space."
        }
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onBlur={() => disc.current?.hold(false)}
      >
        <canvas
          ref={canvas}
          className="gd-canvas"
          data-ready={ready || undefined}
          onPointerDown={onPointerDown}
          onPointerMove={(e) => disc.current?.pointerMove(e.clientX, e.clientY)}
          onPointerUp={() => disc.current?.pointerUp()}
          onPointerCancel={() => disc.current?.pointerUp()}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>

      <div
        className="gd-loading"
        role="progressbar"
        aria-label="Loading"
        aria-valuemin={0}
        aria-valuemax={CRITICAL.length}
        aria-valuenow={loaded}
        data-done={ready || undefined}
      >
        <span style={{ transform: `scaleX(${(loaded + 1) / (CRITICAL.length + 2)})` }} />
      </div>

      <div className="gd-foot">
        {showSound && (
          <SunsetButton
            className="gd-sound"
            playing={sound === "on"}
            disabled={sound === "missing"}
            title={sound === "missing" ? "Put an audio file at public/work/gta-disc/soundtrack.m4a" : undefined}
            onClick={toggleSound}
          >
            {sound === "missing" ? "No soundtrack file" : sound === "on" ? "Now playing" : "Play"}
          </SunsetButton>
        )}
      </div>
    </section>
  );
}
