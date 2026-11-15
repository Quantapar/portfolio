export type UniformValue = number | [number, number] | [number, number, number] | [number, number, number, number];
export type Uniforms = Record<string, UniformValue>;

/** Raw 8-bit texture data. 1 channel reads as `.r`, 2 as `.r` and `.a`, 4 as `.rgba`. */
export interface TextureData {
  width: number;
  height: number;
  channels: 1 | 2 | 4;
  data: Uint8Array;
}

/** Float data for one vertex attribute; `size` is its component count. */
export interface Attribute {
  data: Float32Array;
  size: 1 | 2 | 3 | 4;
}

/**
 * A mesh drawn with `RendererOptions.vertex`. With `instanced` attributes it's drawn `instances`
 * times in one call, each copy reading the next element of every instanced attribute.
 */
export interface Geometry {
  attributes: Record<string, Attribute>;
  /** Vertices per copy. */
  count: number;
  instanced?: Record<string, Attribute>;
  instances?: number;
}

/** One draw of `geometry` per frame. */
export interface Pass {
  /** Applied before this pass draws, on top of the shared uniforms. */
  uniforms?: Uniforms;
  /**
   * Blend premultiplied colour over what's drawn so far, depth-tested but without writing depth,
   * so translucent lines or glows don't hide each other. Put blended passes last. `"screen"`
   * lightens instead, 1 - (1 - src)(1 - dst) per channel, so overlapping light piles up softly
   * towards white and never clips. Meant for drawing light over an opaque backdrop.
   */
  blend?: boolean | "screen";
}

export interface RendererOptions {
  /** GLSL ES 1.0 fragment shader. Receives `u_time`, `u_resolution`, `u_mouse` and `u_hover` automatically. */
  fragment: string;
  /**
   * GLSL ES 1.0 vertex shader for `geometry`, with the same uniforms as the fragment shader.
   * Without it the fragment shader fills the canvas.
   */
  vertex?: string;
  /** Mesh to draw instead of the fullscreen triangle. Drawing it depth-tests and clears every frame. */
  geometry?: Geometry;
  /** Draw `geometry` once per pass, e.g. solid faces then blended outlines. Defaults to a single plain pass. */
  passes?: Pass[];
  /** Multisampling. Worth it for geometry edges; fullscreen shaders antialias themselves. */
  antialias?: boolean;
  uniforms?: Uniforms;
  /**
   * Textures bound to the named `sampler2D` uniforms. Power-of-two sizes are mipmapped and repeat
   * horizontally; anything else is clamped, since WebGL 1 can't mipmap or repeat it. Videos are
   * re-uploaded every frame they have new data.
   */
  textures?: Record<string, TextureData | TexImageSource>;
  /** WebGL extensions the shader needs, e.g. `OES_standard_derivatives`; each is enabled and declared for it. */
  extensions?: string[];
  /**
   * Called before every frame with the seconds since the last one (0 for a still frame).
   * Returned uniforms override `uniforms`; use it for values that change too often for React state.
   */
  onFrame?: (dt: number) => Uniforms | void;
  /** Caps devicePixelRatio to keep fill-rate in check on high-density screens. */
  maxPixelRatio?: number;
  /** Render a single frame instead of animating. */
  paused?: boolean;
}

export interface Renderer {
  setUniforms(uniforms: Uniforms): void;
  setPaused(paused: boolean): void;
  destroy(): void;
}

const FULLSCREEN = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const PRELUDE = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_hover;
`;

/** Seconds for `u_hover` to ease in or out as the pointer enters or leaves. */
const HOVER_EASE = 0.25;

/**
 * Adaptive resolution thresholds, as smoothed frame times. The slow one sits just past 30fps so
 * browsers that cap rAF at 30 (Safari in Low Power Mode) aren't mistaken for an overloaded GPU;
 * the gap between the two stops the resolution hunting up and down.
 */
const SLOW_FRAME = 1 / 28;
const FAST_FRAME = 1 / 55;
const MIN_RESOLUTION = 0.5;
const WARMUP_SECONDS = 1.5;

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("shaders-lab: failed to create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`shaders-lab: shader compile error\n${log}`);
  }
  return shader;
}

function link(gl: WebGLRenderingContext, vertex: string | undefined, fragment: string, header: string): WebGLProgram {
  const program = gl.createProgram();
  if (!program) throw new Error("shaders-lab: failed to create program");
  const vs = compile(gl, gl.VERTEX_SHADER, vertex ? PRELUDE + vertex : FULLSCREEN);
  const fs = compile(gl, gl.FRAGMENT_SHADER, header + PRELUDE + fragment);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`shaders-lab: program link error\n${gl.getProgramInfoLog(program)}`);
  }
  return program;
}

function isTextureData(source: TextureData | TexImageSource): source is TextureData {
  return "channels" in source;
}

function sourceSize(source: TexImageSource): [number, number] {
  if (source instanceof HTMLVideoElement) return [source.videoWidth, source.videoHeight];
  if ("displayWidth" in source) return [source.displayWidth, source.displayHeight];
  return [source.width, source.height];
}

const isPowerOfTwo = (n: number) => n > 0 && (n & (n - 1)) === 0;

function setUniform(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: UniformValue) {
  if (typeof value === "number") gl.uniform1f(location, value);
  else if (value.length === 2) gl.uniform2fv(location, value);
  else if (value.length === 3) gl.uniform3fv(location, value);
  else gl.uniform4fv(location, value);
}

/**
 * Draws a fragment shader across the whole canvas with a single fullscreen triangle, or over
 * an (optionally instanced) mesh placed by a vertex shader. Handles resizing, pixel ratio, pointer tracking and the animation loop, which stops
 * while the canvas is off-screen. Output is premultiplied alpha, so shaders can be transparent.
 *
 * These shaders are pure fill cost, so when frames run slow the backing resolution steps
 * down (and back up once there is headroom). A lost WebGL context is rebuilt on restore.
 */
export function createRenderer(canvas: HTMLCanvasElement, options: RendererOptions): Renderer {
  const gl = canvas.getContext("webgl", { antialias: options.antialias ?? false, premultipliedAlpha: true });
  if (!gl) throw new Error("shaders-lab: WebGL is not supported");

  const { geometry } = options;
  let program: WebGLProgram | null = null;
  let buffers: WebGLBuffer[] = [];
  let textures: WebGLTexture[] = [];
  let videos: { texture: WebGLTexture | null; unit: number; video: HTMLVideoElement; time: number }[] = [];
  let instancing: ANGLE_instanced_arrays | null = null;
  const locations = new Map<string, WebGLUniformLocation | null>();

  const bindAttribute = (linked: WebGLProgram, name: string, { data, size }: Attribute, divisor: number) => {
    const location = gl.getAttribLocation(linked, name);
    // Attributes the shader doesn't read are compiled out.
    if (location < 0) return;
    const buffer = gl.createBuffer();
    if (buffer) buffers.push(buffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
    if (divisor) instancing?.vertexAttribDivisorANGLE(location, divisor);
  };

  const setup = () => {
    // #extension directives have to come before anything else in the shader.
    const header = (options.extensions ?? [])
      .map((name) => {
        if (!gl.getExtension(name)) throw new Error(`shaders-lab: WebGL extension ${name} is not supported`);
        return `#extension GL_${name} : enable\n`;
      })
      .join("");
    const linked = link(gl, geometry && options.vertex, options.fragment, header);
    program = linked;
    gl.useProgram(linked);
    buffers = [];
    if (geometry) {
      if (geometry.instanced) {
        instancing = gl.getExtension("ANGLE_instanced_arrays");
        if (!instancing) throw new Error("shaders-lab: WebGL extension ANGLE_instanced_arrays is not supported");
      }
      for (const [name, attribute] of Object.entries(geometry.attributes)) bindAttribute(linked, name, attribute, 0);
      for (const [name, attribute] of Object.entries(geometry.instanced ?? {})) bindAttribute(linked, name, attribute, 1);
      gl.enable(gl.DEPTH_TEST);
      gl.clearColor(0, 0, 0, 0);
    } else {
      bindAttribute(linked, "a_position", { data: new Float32Array([-1, -1, 3, -1, -1, 3]), size: 2 }, 0);
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    locations.clear();

    const formats = { 1: gl.LUMINANCE, 2: gl.LUMINANCE_ALPHA, 4: gl.RGBA };
    const anisotropic = gl.getExtension("EXT_texture_filter_anisotropic");
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    videos = [];
    textures = Object.entries(options.textures ?? {}).map(([name, source], unit) => {
      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      let size: [number, number];
      if (source instanceof HTMLVideoElement) {
        // A placeholder pixel until the first frame arrives; videos are never mipmapped.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
        videos.push({ texture, unit, video: source, time: -1 });
        size = [0, 0];
      } else if (isTextureData(source)) {
        const format = formats[source.channels];
        gl.texImage2D(gl.TEXTURE_2D, 0, format, source.width, source.height, 0, format, gl.UNSIGNED_BYTE, source.data);
        size = [source.width, source.height];
      } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        size = sourceSize(source);
      }
      const pot = isPowerOfTwo(size[0]) && isPowerOfTwo(size[1]);
      if (pot) gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, pot ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, pot ? gl.REPEAT : gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      if (pot && anisotropic) {
        const max = gl.getParameter(anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number;
        gl.texParameterf(gl.TEXTURE_2D, anisotropic.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, max));
      }
      gl.uniform1i(gl.getUniformLocation(linked, name), unit);
      return texture;
    });
  };

  const locate = (name: string) => {
    if (!program) return null;
    if (!locations.has(name)) locations.set(name, gl.getUniformLocation(program, name));
    return locations.get(name) ?? null;
  };

  const uploadVideos = () => {
    for (const entry of videos) {
      const { video } = entry;
      if (video.readyState < video.HAVE_CURRENT_DATA || video.currentTime === entry.time) continue;
      entry.time = video.currentTime;
      gl.activeTexture(gl.TEXTURE0 + entry.unit);
      gl.bindTexture(gl.TEXTURE_2D, entry.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    }
  };

  let uniforms: Uniforms = options.uniforms ?? {};
  let paused = options.paused ?? false;
  const maxPixelRatio = options.maxPixelRatio ?? 2;
  const mouse: [number, number] = [0.5, 0.5];
  let hover = 0;
  let hovering = false;
  const start = performance.now();
  let frame = 0;
  let last = 0;
  let visible = true;
  let resolution = 1;
  let frameTime = 1 / 60;
  let warmup = 0;

  const apply = (values: Uniforms) => {
    for (const [name, value] of Object.entries(values)) {
      const location = locate(name);
      if (location) setUniform(gl, location, value);
    }
  };

  const draw = (dt: number) => {
    if (!program || gl.isContextLost()) return;
    const time = (performance.now() - start) / 1000;
    const tl = locate("u_time");
    const rl = locate("u_resolution");
    const ml = locate("u_mouse");
    const hl = locate("u_hover");
    hover = dt === 0 ? Number(hovering) : hover + (Number(hovering) - hover) * (1 - Math.exp(-dt / HOVER_EASE));
    if (tl) gl.uniform1f(tl, time);
    if (rl) gl.uniform2f(rl, canvas.width, canvas.height);
    if (ml) gl.uniform2fv(ml, mouse);
    if (hl) gl.uniform1f(hl, hover);
    apply(uniforms);
    const frameUniforms = options.onFrame?.(dt);
    if (frameUniforms) apply(frameUniforms);
    uploadVideos();
    if (!geometry) {
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      return;
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    for (const pass of options.passes ?? [{}]) {
      if (pass.uniforms) apply(pass.uniforms);
      if (pass.blend) {
        gl.enable(gl.BLEND);
        if (pass.blend === "screen") gl.blendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE);
        else gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthMask(false);
      }
      if (instancing) instancing.drawArraysInstancedANGLE(gl.TRIANGLES, 0, geometry.count, geometry.instances ?? 1);
      else gl.drawArrays(gl.TRIANGLES, 0, geometry.count);
      if (pass.blend) {
        // Clearing depth needs the mask back on.
        gl.disable(gl.BLEND);
        gl.depthMask(true);
      }
    }
  };

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, maxPixelRatio) * resolution;
    const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
    const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      if (paused) draw(0);
    }
  };

  const adapt = (elapsed: number) => {
    // A long frame is the main thread being blocked (GC, React work, a tab switch), not GPU load.
    if (elapsed === 0 || elapsed > 0.05) return;
    warmup += elapsed;
    frameTime += (elapsed - frameTime) * 0.08;
    if (warmup < WARMUP_SECONDS) return;
    if (frameTime > SLOW_FRAME && resolution > MIN_RESOLUTION) {
      resolution = Math.max(MIN_RESOLUTION, resolution * 0.8);
    } else if (frameTime < FAST_FRAME && resolution < 1) {
      resolution = Math.min(1, resolution / 0.8);
    } else {
      return;
    }
    frameTime = 1 / 60;
    resize();
  };

  const loop = (now: number) => {
    frame = requestAnimationFrame(loop);
    const elapsed = last ? (now - last) / 1000 : 0;
    last = now;
    adapt(elapsed);
    // Clamp so a long gap (background tab, debugger) doesn't fast-forward animations.
    draw(Math.min(elapsed, 0.1));
  };

  const play = () => {
    cancelAnimationFrame(frame);
    last = 0;
    // Draw synchronously: rAF never fires in a hidden document, so this guarantees a first frame.
    draw(0);
    if (!paused && visible) frame = requestAnimationFrame(loop);
  };

  const onPointerMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouse[0] = (event.clientX - rect.left) / rect.width;
    mouse[1] = 1 - (event.clientY - rect.top) / rect.height;
    hovering = true;
  };

  const onPointerLeave = () => {
    hovering = false;
  };

  const onContextLost = (event: Event) => {
    // Without preventDefault the browser treats the context as gone for good and never restores it.
    event.preventDefault();
    cancelAnimationFrame(frame);
    program = null;
    buffers = [];
    textures = [];
    videos = [];
  };

  const onContextRestored = () => {
    setup();
    play();
  };

  setup();
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true;
    play();
  });
  intersection.observe(canvas);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);
  resize();
  play();

  return {
    setUniforms(next) {
      uniforms = next;
      if (paused) draw(0);
    },
    setPaused(next) {
      paused = next;
      play();
    },
    destroy() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      if (gl.isContextLost()) return;
      for (const buffer of buffers) gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      for (const texture of textures) gl.deleteTexture(texture);
    },
  };
}
