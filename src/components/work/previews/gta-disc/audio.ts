/* The soundtrack: the file at SOUNDTRACK in GtaDisc.tsx, looping. It fades in and out
   rather than cutting, and falls silent while the section is off screen. */

export type Soundtrack = {
  play(): Promise<void>;
  /** Call inside a tap or click: unlocks playback, silently, for a later play() that
   *  comes from no gesture of its own (the disc leaving the case mid-drag). */
  prime(): void;
  pause(): void;
  setVisible(visible: boolean): void;
  dispose(): void;
};

export async function soundtrackExists(src: string) {
  try {
    const res = await fetch(src, { method: "HEAD" });
    return res.ok && (res.headers.get("content-type") ?? "").startsWith("audio/");
  } catch {
    return false;
  }
}

export function createSoundtrack(src: string, volume = 0.85): Soundtrack {
  let ctx: AudioContext | null = null;
  let music: GainNode | null = null;
  let pauseTimer = 0;
  let wanted = false;
  let visible = true;
  const el = new Audio();
  el.src = src;
  el.loop = true;
  // Not a byte until it is wanted: 4 MB that would otherwise race the box's art.
  el.preload = "none";

  function ensure() {
    if (ctx) return ctx;
    ctx = new AudioContext();
    const master = ctx.createGain();
    master.connect(ctx.destination);

    music = ctx.createGain();
    music.gain.value = 0;
    ctx.createMediaElementSource(el).connect(music).connect(master);

    return ctx;
  }

  function fadeTo(target: number, seconds: number) {
    if (!ctx || !music) return;
    const now = ctx.currentTime;
    music.gain.cancelScheduledValues(now);
    music.gain.setValueAtTime(music.gain.value, now);
    music.gain.linearRampToValueAtTime(target, now + seconds);
  }

  async function start() {
    const c = ensure();
    window.clearTimeout(pauseTimer);
    if (c.state !== "running") await c.resume();
    await el.play();
    fadeTo(volume, 1.4);
  }

  function stop(seconds = 0.6) {
    fadeTo(0, seconds);
    window.clearTimeout(pauseTimer);
    pauseTimer = window.setTimeout(() => el.pause(), seconds * 1000 + 50);
  }

  let primed = false;

  return {
    prime() {
      if (primed) return;
      primed = true;
      const c = ensure();
      if (c.state !== "running") c.resume().catch(() => {});
      el.play()
        .then(() => {
          if (wanted) return;
          el.pause();
          el.currentTime = 0;
        })
        .catch(() => {
          primed = false;
        });
    },
    async play() {
      wanted = true;
      if (visible) await start();
    },
    pause() {
      wanted = false;
      stop();
    },
    setVisible(next) {
      if (next === visible) return;
      visible = next;
      if (!wanted) return;
      if (visible) start().catch(() => {});
      else stop(0.8);
    },
    dispose() {
      window.clearTimeout(pauseTimer);
      el.pause();
      el.removeAttribute("src");
      el.load();
      ctx?.close();
    },
  };
}
