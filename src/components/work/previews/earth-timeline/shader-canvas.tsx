import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createRenderer, type Renderer, type RendererOptions, type Uniforms } from "./renderer";
import { useReducedMotion } from "./use-reduced-motion";

export interface ShaderCanvasProps {
  /** GLSL ES 1.0 fragment shader. `u_time`, `u_resolution`, `u_mouse` and `u_hover` are declared for you. */
  fragment: string;
  /** Vertex shader for `geometry`. Keep it, `geometry` and `passes` stable: a change rebuilds the renderer. */
  vertex?: RendererOptions["vertex"];
  geometry?: RendererOptions["geometry"];
  passes?: RendererOptions["passes"];
  antialias?: boolean;
  uniforms?: Uniforms;
  /** Textures for `sampler2D` uniforms. Keep the object stable: a new one rebuilds the renderer. */
  textures?: RendererOptions["textures"];
  /** WebGL extensions the shader needs. Keep the array stable, like `textures`. */
  extensions?: RendererOptions["extensions"];
  /** Per-frame uniforms; see `RendererOptions.onFrame`. */
  onFrame?: RendererOptions["onFrame"];
  /** Stop animating. Defaults to the user's reduced-motion preference. */
  paused?: boolean;
  maxPixelRatio?: number;
  className?: string;
  style?: CSSProperties;
}

/*
  Browsers keep only about 16 WebGL contexts alive per page and silently kill the oldest past that,
  so a page of many shaders would lose its first ones. Each canvas holds a context only while it's
  within a screen of the viewport, and hands it back as soon as it's done with it rather than
  whenever it's garbage collected. A canvas whose context was handed back can never get another,
  so it's marked spent and swapped for a fresh element.
*/
const spent = new WeakSet<HTMLCanvasElement>();
const NEAR = "100% 0px";

/** Low-level building block: renders any fragment shader into a canvas that fills its parent. */
export function ShaderCanvas({
  fragment,
  vertex,
  geometry,
  passes,
  antialias,
  uniforms,
  textures,
  extensions,
  onFrame,
  paused,
  maxPixelRatio,
  className,
  style,
}: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const onFrameRef = useRef(onFrame);
  const reducedMotion = useReducedMotion();
  const isPaused = paused ?? reducedMotion;
  const [near, setNear] = useState(false);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new IntersectionObserver(([entry]) => setNear(entry?.isIntersecting ?? true), { rootMargin: NEAR });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [generation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !near || spent.has(canvas)) return;
    const renderer = createRenderer(canvas, {
      fragment,
      vertex,
      geometry,
      passes,
      antialias,
      uniforms,
      textures,
      extensions,
      paused: isPaused,
      maxPixelRatio,
      onFrame: (dt) => onFrameRef.current?.(dt),
    });
    rendererRef.current = renderer;
    return () => {
      renderer.destroy();
      rendererRef.current = null;
      canvas.getContext("webgl")?.getExtension("WEBGL_lose_context")?.loseContext();
      spent.add(canvas);
      setGeneration((count) => count + 1);
    };
    // Uniforms and pause state are pushed in the effects below without rebuilding the program.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [near, generation, fragment, vertex, geometry, passes, antialias, textures, extensions, maxPixelRatio]);

  useEffect(() => {
    onFrameRef.current = onFrame;
  }, [onFrame]);

  useEffect(() => {
    if (uniforms) rendererRef.current?.setUniforms(uniforms);
  }, [uniforms]);

  useEffect(() => {
    rendererRef.current?.setPaused(isPaused);
  }, [isPaused]);

  return (
    <canvas
      key={generation}
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}
