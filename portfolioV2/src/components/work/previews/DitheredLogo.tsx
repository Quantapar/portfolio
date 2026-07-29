import { useCallback, useEffect, useRef } from "react";

interface ParticleSystem {
  count: number;
  baseX: Float32Array;
  baseY: Float32Array;
  offsetX: Float32Array;
  offsetY: Float32Array;
  size: number;
}

interface Ripple {
  x: number;
  y: number;
  startedAt: number;
}

type DitheredLogoProps = {
  imageSrc: string;
  className?: string;
  particleColor?: string;
  gridSize?: number;
  scale?: number;
  dotScale?: number;
  threshold?: number;
  diffusionStrength?: number;
};

const CURSOR_RADIUS = 110;
const CURSOR_FORCE = 46;
const RIPPLE_SPEED = 280;
const RIPPLE_WIDTH = 42;
const RIPPLE_FORCE = 28;
const RIPPLE_DURATION = 760;
const LERP_FACTOR = 0.13;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function ditherImage(
  image: HTMLImageElement,
  maxWidth: number,
  threshold: number,
  diffusionStrength: number,
) {
  const aspect = image.naturalWidth / image.naturalHeight;
  const width = maxWidth;
  const height = Math.max(1, Math.round(maxWidth / aspect));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) return { points: new Float32Array(), width, height };

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, width, height);

  const pixels = context.getImageData(0, 0, width, height).data;
  const values = new Float32Array(width * height);
  const alpha = new Uint8Array(width * height);

  for (let index = 0; index < values.length; index++) {
    const pixelIndex = index * 4;
    values[index] =
      pixels[pixelIndex]! * 0.299 +
      pixels[pixelIndex + 1]! * 0.587 +
      pixels[pixelIndex + 2]! * 0.114;
    alpha[index] = pixels[pixelIndex + 3]!;
  }

  const points: number[] = [];

  for (let y = 0; y < height; y++) {
    const leftToRight = y % 2 === 0;
    const start = leftToRight ? 0 : width - 1;
    const end = leftToRight ? width : -1;
    const step = leftToRight ? 1 : -1;

    for (let x = start; x !== end; x += step) {
      const index = y * width + x;
      if (alpha[index]! < 96) continue;

      const oldValue = values[index]!;
      const newValue = oldValue >= threshold ? 255 : 0;
      const error = (oldValue - newValue) * diffusionStrength;

      if (newValue === 255) points.push(x, y);

      const spread = (nextX: number, nextY: number, weight: number) => {
        if (nextX < 0 || nextX >= width || nextY >= height) return;
        const nextIndex = nextY * width + nextX;
        if (alpha[nextIndex]! < 96) return;
        values[nextIndex] = values[nextIndex]! + error * weight;
      };

      spread(x + step, y, 7 / 16);
      spread(x - step, y + 1, 3 / 16);
      spread(x, y + 1, 5 / 16);
      spread(x + step, y + 1, 1 / 16);
    }
  }

  return { points: new Float32Array(points), width, height };
}

function createParticleSystem(
  points: Float32Array,
  gridWidth: number,
  gridHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  scale: number,
  dotScale: number,
): ParticleSystem {
  const count = points.length / 2;
  const baseX = new Float32Array(count);
  const baseY = new Float32Array(count);
  const offsetX = new Float32Array(count);
  const offsetY = new Float32Array(count);
  const scaleFactor = Math.max(
    0.5,
    Math.min(
      (canvasWidth * scale) / gridWidth,
      (canvasHeight * scale) / gridHeight,
    ),
  );
  const originX = (canvasWidth - gridWidth * scaleFactor) / 2;
  const originY = (canvasHeight - gridHeight * scaleFactor) / 2;

  for (let index = 0; index < count; index++) {
    baseX[index] = originX + points[index * 2]! * scaleFactor;
    baseY[index] = originY + points[index * 2 + 1]! * scaleFactor;
  }

  return {
    count,
    baseX,
    baseY,
    offsetX,
    offsetY,
    size: Math.max(1, scaleFactor * dotScale),
  };
}

function drawParticles(
  context: CanvasRenderingContext2D,
  system: ParticleSystem,
  width: number,
  height: number,
  dpr: number,
  color: string,
) {
  context.clearRect(0, 0, width * dpr, height * dpr);
  context.fillStyle = color;
  const size = system.size * dpr;

  for (let index = 0; index < system.count; index++) {
    const x = (system.baseX[index]! + system.offsetX[index]!) * dpr;
    const y = (system.baseY[index]! + system.offsetY[index]!) * dpr;
    context.fillRect(x, y, size, size);
  }
}

function moveParticles(
  system: ParticleSystem,
  cursor: { x: number; y: number; active: boolean },
  ripples: Ripple[],
  now: number,
) {
  for (let index = ripples.length - 1; index >= 0; index--) {
    if (now - ripples[index]!.startedAt > RIPPLE_DURATION) {
      ripples.splice(index, 1);
    }
  }

  let isMoving = false;

  for (let index = 0; index < system.count; index++) {
    let forceX = 0;
    let forceY = 0;
    const currentX = system.baseX[index]! + system.offsetX[index]!;
    const currentY = system.baseY[index]! + system.offsetY[index]!;

    if (cursor.active) {
      const deltaX = currentX - cursor.x;
      const deltaY = currentY - cursor.y;
      const distanceSquared = deltaX * deltaX + deltaY * deltaY;

      if (
        distanceSquared > 0.1 &&
        distanceSquared < CURSOR_RADIUS * CURSOR_RADIUS
      ) {
        const distance = Math.sqrt(distanceSquared);
        const force =
          Math.pow(1 - distance / CURSOR_RADIUS, 3) * CURSOR_FORCE;
        forceX += (deltaX / distance) * force;
        forceY += (deltaY / distance) * force;
      }
    }

    for (const ripple of ripples) {
      const elapsed = now - ripple.startedAt;
      const radius = (elapsed / 1000) * RIPPLE_SPEED;
      const deltaX = system.baseX[index]! - ripple.x;
      const deltaY = system.baseY[index]! - ripple.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const bandDistance = Math.abs(distance - radius);

      if (distance > 0.1 && bandDistance < RIPPLE_WIDTH) {
        const life = 1 - elapsed / RIPPLE_DURATION;
        const force =
          (1 - bandDistance / RIPPLE_WIDTH) * life * RIPPLE_FORCE;
        forceX += (deltaX / distance) * force;
        forceY += (deltaY / distance) * force;
      }
    }

    system.offsetX[index] =
      system.offsetX[index]! +
      (forceX - system.offsetX[index]!) * LERP_FACTOR;
    system.offsetY[index] =
      system.offsetY[index]! +
      (forceY - system.offsetY[index]!) * LERP_FACTOR;

    if (
      Math.abs(system.offsetX[index]!) < 0.01 &&
      Math.abs(system.offsetY[index]!) < 0.01
    ) {
      system.offsetX[index] = 0;
      system.offsetY[index] = 0;
    } else {
      isMoving = true;
    }
  }

  return isMoving || cursor.active || ripples.length > 0;
}

export function DitheredLogo({
  imageSrc,
  className = "",
  particleColor = "#FE551A",
  gridSize = 230,
  scale = 0.88,
  dotScale = 0.78,
  threshold = 152,
  diffusionStrength = 1,
}: DitheredLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ParticleSystem | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const cursorRef = useRef({ x: 0, y: 0, active: false });
  const ripplesRef = useRef<Ripple[]>([]);
  const frameRef = useRef(0);
  const runningRef = useRef(false);
  const reducedMotionRef = useRef(false);

  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const particles = particlesRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !particles || !context) {
      runningRef.current = false;
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const needsAnotherFrame = reducedMotionRef.current
      ? false
      : moveParticles(
          particles,
          cursorRef.current,
          ripplesRef.current,
          performance.now(),
        );

    drawParticles(
      context,
      particles,
      rect.width,
      rect.height,
      dpr,
      particleColor,
    );

    if (needsAnotherFrame) {
      frameRef.current = requestAnimationFrame(renderFrame);
    } else {
      runningRef.current = false;
    }
  }, [particleColor]);

  const startLoop = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    frameRef.current = requestAnimationFrame(renderFrame);
  }, [renderFrame]);

  const rebuild = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));

    const dithered = ditherImage(
      image,
      gridSize,
      threshold,
      diffusionStrength,
    );
    particlesRef.current = createParticleSystem(
      dithered.points,
      dithered.width,
      dithered.height,
      rect.width,
      rect.height,
      scale,
      dotScale,
    );
    startLoop();
  }, [diffusionStrength, dotScale, gridSize, scale, startLoop, threshold]);

  useEffect(() => {
    let cancelled = false;

    loadImage(imageSrc)
      .then((image) => {
        if (cancelled) return;
        imageRef.current = image;
        rebuild();
      })
      .catch((error: unknown) => {
        console.error("DitheredLogo: failed to load image", error);
      });

    return () => {
      cancelled = true;
    };
  }, [imageSrc, rebuild]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      reducedMotionRef.current = motionQuery.matches;
    };
    const resizeObserver = new ResizeObserver(rebuild);

    const updateCursor = (event: PointerEvent) => {
      if (reducedMotionRef.current) return;
      const rect = canvas.getBoundingClientRect();
      cursorRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      };
      startLoop();
    };

    const releaseCursor = () => {
      cursorRef.current.active = false;
      startLoop();
    };

    const createRipple = (event: PointerEvent) => {
      if (reducedMotionRef.current) return;
      const rect = canvas.getBoundingClientRect();
      ripplesRef.current.push({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        startedAt: performance.now(),
      });
      startLoop();
    };

    updateMotionPreference();
    resizeObserver.observe(canvas);
    motionQuery.addEventListener("change", updateMotionPreference);
    canvas.addEventListener("pointermove", updateCursor);
    canvas.addEventListener("pointerleave", releaseCursor);
    canvas.addEventListener("pointercancel", releaseCursor);
    canvas.addEventListener("pointerup", createRipple);

    return () => {
      cancelAnimationFrame(frameRef.current);
      runningRef.current = false;
      resizeObserver.disconnect();
      motionQuery.removeEventListener("change", updateMotionPreference);
      canvas.removeEventListener("pointermove", updateCursor);
      canvas.removeEventListener("pointerleave", releaseCursor);
      canvas.removeEventListener("pointercancel", releaseCursor);
      canvas.removeEventListener("pointerup", createRipple);
    };
  }, [rebuild, startLoop]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block size-full touch-none ${className}`.trim()}
    />
  );
}
