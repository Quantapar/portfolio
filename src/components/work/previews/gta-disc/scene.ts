import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// Fetched when the scene loads, so the model stays out of the script.
const modelUrl = new URL("./dfm/cd.glb", import.meta.url).href;
import iridescenceUrl from "./dfm/iridescence.png";
import studioUrl from "./dfm/studio.png";
import { CASE, createCase, type CaseArt } from "./case.ts";
import { MM, paintLabel, type LabelArt } from "./label.ts";
import { createPoster, SHEET, type PosterArt } from "./poster.ts";
import { artTexture } from "./print.ts";

/* The disc, staged exactly as desktop.fm stages theirs, from their own code and files
   (src/gta/dfm: their disc model, decompressed; their studio map; their iridescence
   gradient):

   - one 25° camera at 28 units, the disc scaled ×3, raised 0.75, leaning (-0.75,
     -0.5, -0.5), turning -0.5 rad/s round the vertical, faster while held;
   - every surface at roughness 0, lit only by the studio map turned 1.2 rad round the
     vertical, at 1.5; the back metallic 0.418, the centre translucent grey at 0.8;
   - their iridescence: a gradient looked up by the angle round the disc and the turn,
     added on top where the surface is bare;
   - fog from 25 to 40, no tone mapping, a pixel ratio of 1.5, and a levels pass
     (black 0.05, gamma 0.95, white 0.95) over the frame.

   Ours on top: the label side carries Rockstar's cover instead of their print, the
   room is a warm white instead of their grey, and the disc can be dragged as well as
   held. */

const LEAN = new THREE.Euler(-0.75, -0.5, -0.5);
const IDLE_YAW = -0.5; // rad/s
const HELD_YAW = -2.5; // rad/s: theirs adds 2 while the pointer is down
const PIXEL_RATIO = 1.5; // desktop.fm's; ours is the floor (see pixelRatio)
const MAX_PIXELS = 12e6; // the frame's ceiling, so a big zoomed screen stays affordable

// At least desktop.fm's 1.5, more on a denser screen, and more again while the page is
// pinch-zoomed, so the box's small print holds up close.
function pixelRatio(width: number, height: number) {
  const zoom = window.visualViewport?.scale ?? 1;
  const want = Math.max(PIXEL_RATIO, window.devicePixelRatio * zoom);
  return Math.max(Math.min(want, 3, Math.sqrt(MAX_PIXELS / (width * height))), 1);
}
const LEVELS = new THREE.Vector3(0.05, 0.95, 0.95); // black in, gamma, white in

// The page: a white with a blush of the Vice City sunset (desktop.fm's is grey). Kept
// in step with .gd in gta.css.
const PAGE = "#f7f1f3";

// The room colour that comes out of the levels pass as exactly PAGE: the pass run
// backwards, channel by channel, in linear light.
function roomColor() {
  const c = new THREE.Color(PAGE);
  const back = (v: number) => Math.pow(v, LEVELS.y) * (LEVELS.z - LEVELS.x) + LEVELS.x;
  return new THREE.Color().setRGB(back(c.r), back(c.g), back(c.b));
}
const CENTRE_Y = 0.0096; // their model sits this far below its origin
const FIT_WIDTH = 7.6; // units of view width the disc (6 across) needs on a narrow screen

// The shadow: the disc seen from straight below by an orthographic camera on an unseen
// floor, blurred, and laid on that floor. The floor is tipped towards the camera (which
// looks dead level, so a level floor would be a line) as if seen from a little above.
const SHADOW = {
  // Under the disc's lowest point (-2.25) with air between; lower while the case (8.5
  // tall) is out.
  floor: { disc: -3.15, case: -5 },
  size: 16, // units square the shadow camera covers: the open case (14) plus the blur
  reach: 7, // height over the floor at which the disc stops casting
  tilt: 0.2, // rad the floor is tipped towards the camera
  res: 512,
  blur: [5, 2.5], // px per tap, one pair of passes each
  color: "#3a1a2c", // a plum shadow, from the room's sunset rather than grey
  opacity: 0.2,
};

// The unboxing. The case floats where the disc will, the camera further back; it opens
// round its spine, the disc comes off the hub, the case falls away into the fog, and the
// camera comes in to desktop.fm's framing as the disc takes its place.
const CASE_Y = 0.9;
const CASE_DIST = 42; // the camera, while the case is out
const CASE_FIT = 9.4; // units of view width the shut case (6.75 across) needs
const SPREAD_SHIFT = 3.72; // the open case moves this far right to centre its spread
const SPREAD_FIT = 15.6; // units of view width the open case (14.2 across) needs
const LIFT = 0.5; // disc units the disc rises off the hub at a full pull (30 mm)
const OUT_TIME = 1.15; // s, from the hub to the float

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const smooth = (t: number) => t * t * (3 - 2 * t);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = THREE.MathUtils.lerp;

// Their CD material: MeshStandardMaterial plus the iridescence pass, as in their shader.
function cdMaterial(
  params: THREE.MeshStandardMaterialParameters,
  gradient: THREE.Texture,
  rotation: THREE.Euler,
  strength: number,
) {
  const m = new THREE.MeshStandardMaterial(params);
  m.onBeforeCompile = (shader) => {
    shader.uniforms.rotation = { value: rotation };
    shader.uniforms.iridescenceMap = { value: gradient };
    shader.uniforms.iridescenceStrength = { value: strength };
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform vec3 rotation;
        varying vec3 vCdPosition;
        vec2 cdRotate(vec2 v, float a) { float s = sin(a); float c = cos(a); return mat2(c, s, -s, c) * v; }`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        vCdPosition = position;
        vCdPosition.xy = cdRotate(vCdPosition.xy, rotation.y);`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform vec3 rotation;
        uniform sampler2D iridescenceMap;
        uniform float iridescenceStrength;
        varying vec3 vCdPosition;
        float cdAtan3(vec2 st) { return mod(atan(st.y, st.x), 2.0 * PI); }`,
      )
      .replace(
        "#include <opaque_fragment>",
        `#include <opaque_fragment>
        {
          float angleV = cdAtan3(vCdPosition.xy) / (PI * 2.0);
          float val = sin(-rotation.y * 0.4 + angleV * 5.0) * cos(rotation.y * 0.2 + angleV * 4.5);
          // Theirs jitters this lookup with fine noise for a brushed look; left out, as
          // at this size it reads as grain.
          vec3 iri = texture2D(iridescenceMap, vec2(val, 0.5)).rgb;
          float mask = smoothstep(0.0, 0.1, angleV) - smoothstep(0.9, 1.0, angleV);
          gl_FragColor.rgb += mask * iridescenceStrength * (iri - 0.25);
        }`,
      );
  };
  return m;
}

// A flat ring in the disc's plane, with the label's planar UVs (the whole disc on the
// unit square), for the band between their hub and their print.
function ring(rIn: number, rOut: number, z: number) {
  const g = new THREE.RingGeometry(rIn, rOut, 192, 1);
  g.translate(0, 0, z);
  const p = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / 2 + 0.5, p.getY(i) / 2 + 0.5);
  return g;
}

export type DiscController = {
  setSize(width: number, height: number): void;
  setActive(active: boolean): void;
  pointerDown(x: number, y: number): void;
  pointerMove(x: number, y: number): void;
  pointerUp(): void;
  nudge(direction: -1 | 1): void;
  hold(on: boolean): void;
  /** The keyboard's way through the unboxing: opens the case, then takes the disc out.
   *  False once the disc is out. */
  advance(): boolean;
  /** Back a step: the disc into its case, or the poster into the cover. */
  back(): boolean;
  dispose(): void;
};

/* The disc's model and the light it's lit by: none of it needs the renderer, so it starts
   downloading with the box's art rather than after it. */
let sceneAssets: Promise<[Awaited<ReturnType<GLTFLoader["loadAsync"]>>, THREE.Texture, THREE.Texture]> | undefined;
export function preloadDisc() {
  const textures = new THREE.TextureLoader();
  sceneAssets ??= Promise.all([
    new GLTFLoader().loadAsync(modelUrl),
    textures.loadAsync(studioUrl.src),
    textures.loadAsync(iridescenceUrl.src),
  ]);
  return sceneAssets;
}

export async function createDisc(
  canvas: HTMLCanvasElement,
  art: LabelArt | Promise<LabelArt>,
  caseArt: CaseArt,
  posterArt: PosterArt,
  {
    reducedMotion = false,
    onRelease,
    onReturn,
  }: { reducedMotion?: boolean; onRelease?: () => void; onReturn?: () => void } = {},
): Promise<DiscController> {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(PIXEL_RATIO);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;

  const disposables: { dispose(): void }[] = [];
  const keep = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

  // Owned by this disc from here: a later one (StrictMode's second mount) loads its own.
  const assets = preloadDisc();
  sceneAssets = undefined;
  const [gltf, studio, gradient] = await assets;
  studio.colorSpace = THREE.SRGBColorSpace;
  gradient.colorSpace = THREE.SRGBColorSpace;
  gradient.wrapS = gradient.wrapT = THREE.RepeatWrapping;
  keep(gradient);
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envTarget = keep(pmrem.fromEquirectangular(studio));
  pmrem.dispose();
  studio.dispose();
  const env = envTarget.texture;

  const scene = new THREE.Scene();
  const room = roomColor();
  scene.fog = new THREE.Fog(room, 25, 40);
  const camera = new THREE.PerspectiveCamera(25, 1, 0.1, 1000);
  camera.position.set(0, 0, 28);

  // Their backdrop: a big plane in the fog colour that always faces the camera.
  const backdrop = new THREE.Mesh(
    keep(new THREE.PlaneGeometry(100, 100)),
    keep(new THREE.MeshBasicMaterial({ color: room, depthTest: false })),
  );
  backdrop.renderOrder = -1;
  backdrop.onBeforeRender = (_r, _s, cam) => backdrop.quaternion.copy(cam.quaternion);
  scene.add(backdrop);

  // group (scale, height, the turn) → lean → drag (ours) → the disc
  const group = new THREE.Group();
  group.scale.setScalar(3);
  group.position.y = 0.75;
  group.rotation.y = 2.1;
  const lean = new THREE.Group();
  lean.rotation.copy(LEAN);
  const drag = new THREE.Group();
  group.add(lean);
  lean.add(drag);
  scene.add(group);

  // --- The label ---------------------------------------------------------------------
  const labelTex = keep(
    artTexture(art instanceof Promise ? art.then((a) => paintLabel(a)) : paintLabel(art), renderer.capabilities.getMaxAnisotropy(), "#3b2a3a"),
  );

  const surface = {
    envMap: env,
    envMapIntensity: 1.5,
    envMapRotation: new THREE.Euler(0, 1.2, 0),
    side: THREE.DoubleSide,
  };
  // The back: their values exactly. The label: printed all over, so in their terms all
  // ink: no iridescence, and a glossy coat rather than their 0.7 for bare white ink.
  // Their studio is black all round the horizon, which suits a silver print but turns
  // full-colour art dull whenever it faces the camera; so the print carries part of its
  // own brightness (as product renders of artwork do), with the studio's gloss on top.
  const back = keep(cdMaterial({ ...surface, metalness: 0.418, roughness: 0 }, gradient, group.rotation, 1));
  const front = keep(
    cdMaterial(
      {
        ...surface,
        map: labelTex,
        emissive: new THREE.Color("#ffffff"),
        emissiveMap: labelTex,
        emissiveIntensity: 0.72,
        metalness: 0,
        roughness: 0.18,
      },
      gradient,
      group.rotation,
      0,
    ),
  );
  const centre = keep(
    new THREE.MeshStandardMaterial({
      ...surface,
      color: new THREE.Color(0.8, 0.8, 0.8),
      metalness: 0,
      roughness: 0,
      transparent: true,
      opacity: 0.8,
    }),
  );

  const cd = gltf.scene;
  cd.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    keep(o.geometry);
    (o.material as THREE.Material).dispose();
    o.geometry.translate(0, CENTRE_Y, 0);
    if (o.name === "CD-Back") o.material = back;
    else if (o.name === "CD-Center") o.material = centre;
    else if (o.name === "CD-Front") {
      // Their UVs point into their own print; give the face the label's planar ones.
      const p = o.geometry.attributes.position;
      const uv = o.geometry.attributes.uv;
      for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / 2 + 0.5, p.getY(i) / 2 + 0.5);
      uv.needsUpdate = true;
      o.material = front;
    }
  });
  // Their print starts at r 0.286; ours runs in to MM.labelIn, over their centre.
  // Front-facing only: from behind, the hub shows through to the room, not the print.
  const frontOnly = keep(front.clone());
  frontOnly.side = THREE.FrontSide;
  frontOnly.onBeforeCompile = front.onBeforeCompile;
  cd.add(new THREE.Mesh(keep(ring(MM.labelIn / MM.disc, 0.2862, 0.0095)), frontOnly));
  // The disc is placed by hand each frame: on the hub, in the hand, or at the stage pose
  // (stageAnchor, at the end of their chain), or between.
  const stageAnchor = new THREE.Object3D();
  drag.add(stageAnchor);
  const discHolder = new THREE.Group();
  discHolder.matrixAutoUpdate = false;
  discHolder.add(cd);
  scene.add(discHolder);

  // --- The case ----------------------------------------------------------------------
  const gameCase = keep(
    createCase(
      caseArt,
      { envMap: env, envMapIntensity: surface.envMapIntensity, envMapRotation: surface.envMapRotation },
      renderer.capabilities.getMaxAnisotropy(),
      { lo: LEVELS.x, gamma: LEVELS.y, hi: LEVELS.z },
    ),
  );
  gameCase.root.scale.setScalar(3);
  scene.add(gameCase.root);

  // --- The poster, folded in the front cover -----------------------------------------
  const poster = keep(
    createPoster(posterArt, renderer.capabilities.getMaxAnisotropy(), {
      lo: LEVELS.x,
      gamma: LEVELS.y,
      hi: LEVELS.z,
    }),
  );
  // It lies on the cover's tray, its folded layers under its face.
  gameCase.posterMount.position.z = CASE.wall + poster.thickness + 0.3;
  // Placed by hand each frame, as the disc is: in the cover, or held up to you, or between.
  const posterHolder = new THREE.Group();
  posterHolder.matrixAutoUpdate = false;
  posterHolder.add(poster.root);
  scene.add(posterHolder);

  const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // --- The shadow --------------------------------------------------------------------
  const shadowTarget = keep(new THREE.WebGLRenderTarget(SHADOW.res, SHADOW.res));
  const blurTarget = keep(new THREE.WebGLRenderTarget(SHADOW.res, SHADOW.res));
  const half = SHADOW.size / 2;
  const shadowCamera = new THREE.OrthographicCamera(-half, half, half, -half, 0, SHADOW.reach);
  shadowCamera.position.y = SHADOW.floor.case;
  shadowCamera.rotation.x = Math.PI / 2; // looking up; its up is +z, towards the viewer
  // Every face in solid shadow, fading with height: whatever is nearest the floor wins.
  const caster = keep(new THREE.MeshDepthMaterial({ side: THREE.DoubleSide }));
  caster.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );",
      "float shade = 1.0 - fragCoordZ * 0.85; gl_FragColor = vec4( vec3( shade ), shade );",
    );
  };
  const quad = keep(new THREE.PlaneGeometry(2, 2));
  const blurMaterial = keep(
    new THREE.ShaderMaterial({
      uniforms: { uMap: { value: null }, uStep: { value: new THREE.Vector2() } },
      depthTest: false,
      depthWrite: false,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap;
        uniform vec2 uStep;
        varying vec2 vUv;
        void main() {
          vec4 sum = texture2D(uMap, vUv) * 0.1633;
          sum += (texture2D(uMap, vUv - uStep) + texture2D(uMap, vUv + uStep)) * 0.1531;
          sum += (texture2D(uMap, vUv - 2.0 * uStep) + texture2D(uMap, vUv + 2.0 * uStep)) * 0.12245;
          sum += (texture2D(uMap, vUv - 3.0 * uStep) + texture2D(uMap, vUv + 3.0 * uStep)) * 0.0918;
          sum += (texture2D(uMap, vUv - 4.0 * uStep) + texture2D(uMap, vUv + 4.0 * uStep)) * 0.051;
          gl_FragColor = sum;
        }`,
    }),
  );
  const blurScene = new THREE.Scene();
  const blurQuad = new THREE.Mesh(quad, blurMaterial);
  blurQuad.frustumCulled = false;
  blurScene.add(blurQuad);

  const floorGeometry = keep(new THREE.PlaneGeometry(SHADOW.size, SHADOW.size));
  // The shadow camera's texture runs +z (near) upwards; the floor's runs away. Flip it.
  const fuv = floorGeometry.attributes.uv;
  for (let i = 0; i < fuv.count; i++) fuv.setY(i, 1 - fuv.getY(i));
  const floor = new THREE.Mesh(
    floorGeometry,
    keep(
      new THREE.MeshBasicMaterial({
        color: SHADOW.color,
        alphaMap: shadowTarget.texture,
        transparent: true,
        opacity: SHADOW.opacity,
        depthWrite: false,
        fog: false,
      }),
    ),
  );
  floor.position.y = SHADOW.floor.case;
  floor.rotation.x = -Math.PI / 2 + SHADOW.tilt;
  scene.add(floor);

  function renderShadow() {
    const clearAlpha = renderer.getClearAlpha();
    backdrop.visible = floor.visible = false;
    scene.overrideMaterial = caster;
    renderer.setClearAlpha(0);
    renderer.setRenderTarget(shadowTarget);
    renderer.clear();
    renderer.render(scene, shadowCamera);
    scene.overrideMaterial = null;
    backdrop.visible = floor.visible = true;
    for (const px of SHADOW.blur) {
      blurMaterial.uniforms.uMap.value = shadowTarget.texture;
      blurMaterial.uniforms.uStep.value.set(px / SHADOW.res, 0);
      renderer.setRenderTarget(blurTarget);
      renderer.render(blurScene, postCamera);
      blurMaterial.uniforms.uMap.value = blurTarget.texture;
      blurMaterial.uniforms.uStep.value.set(0, px / SHADOW.res);
      renderer.setRenderTarget(shadowTarget);
      renderer.render(blurScene, postCamera);
    }
    renderer.setClearAlpha(clearAlpha);
  }

  // --- The frame, then their levels pass over it ------------------------------------
  const target = keep(new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 }));
  const post = new THREE.Scene();
  const postMaterial = keep(
    new THREE.ShaderMaterial({
      uniforms: { uDiffuse: { value: target.texture }, uLevels: { value: LEVELS } },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D uDiffuse;
        uniform vec3 uLevels;
        varying vec2 vUv;
        vec3 levelRange(vec3 c, float lo, float hi) {
          return min(max(c - vec3(lo), vec3(0.0)) / (vec3(hi) - vec3(lo)), vec3(1.0));
        }
        void main() {
          vec4 world = texture2D(uDiffuse, vUv);
          gl_FragColor = vec4(pow(levelRange(world.rgb, uLevels.x, uLevels.z), vec3(1.0 / uLevels.y)), 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  );
  post.add(new THREE.Mesh(quad, postMaterial));

  // --- Motion ------------------------------------------------------------------------
  const idle = reducedMotion ? 0 : IDLE_YAW;
  const s = {
    yawVel: 0, // still while it is in the case
    pitch: 0,
    pitchVel: 0,
    holding: false,
    dragging: false,
    down: null as null | {
      x: number;
      y: number;
      lastX: number;
      lastY: number;
      t: number;
      t0: number;
      target: "cover" | "disc" | "turn" | "stage" | "posterIn" | "poster";
      open0: number;
    },
    holdTimer: 0,
  };
  // The unboxing.
  const u = {
    phase: "case" as "case" | "out" | "disc" | "back",
    open: 0, // the hinges, 0 shut to 1 flat open
    openVel: 0,
    openGoal: 0,
    openSince: -1,
    lift: 0, // the disc off the hub, 0 seated to 1 free
    liftVel: 0,
    follow: new THREE.Vector2(), // the pulled disc's slide across the tray, disc units
    out: 0, // 0 on the hub to 1 at the stage pose
    time: 0,
    touched: false,
    // Turned by hand, round the vertical and across, over the presentation pose.
    turnY: 0,
    turnX: 0,
    turnVelY: 0,
    turnVelX: 0,
  };
  const view = { distCase: CASE_DIST, distOpen: CASE_DIST, distDisc: 28, lookY: 0, pxPerUnit: 20, view2: 1, height: 1 };

  // Unprompted, the shut case's cover lifts a little now and then, and the open case's
  // disc, as a hand would test them: the only hint there is.
  function peek() {
    if (reducedMotion || u.touched || u.open > 0.01 || u.time < 2) return 0;
    const c = (u.time - 2) % 5;
    return c < 1 ? 0.05 * Math.sin(Math.PI * c) ** 2 : 0;
  }
  function liftHint() {
    if (reducedMotion || s.down || u.openSince < 0) return 0;
    const t = u.time - u.openSince - 1.8;
    if (t < 0) return 0;
    const c = t % 4.5;
    return c < 0.9 ? 0.14 * Math.sin((Math.PI * c) / 0.9) ** 2 : 0;
  }

  function stepCase(dt: number) {
    if (u.phase === "back") {
      // The way out, run backwards: u.out falls from 1 to 0 as the disc goes home.
      u.out = Math.max(0, u.out - dt / (reducedMotion ? 0.5 : OUT_TIME));
      if (u.out <= 0) {
        u.phase = "case";
        s.yawVel = 0;
      }
      return;
    }
    if (u.phase === "out") {
      u.out = Math.min(1, u.out + dt / (reducedMotion ? 0.5 : OUT_TIME));
      if (u.out >= 1) {
        u.phase = "disc";
        gameCase.root.visible = false;
      }
      return;
    }
    if (u.phase !== "case") return;
    // Turned by hand: it keeps turning a little after a throw, then rests where it is.
    // Opening, it comes back round to face you, the nearest way.
    if (s.down?.target !== "turn") {
      if (u.openGoal > 0) {
        const goalY = Math.round(u.turnY / (Math.PI * 2)) * Math.PI * 2;
        const k = 1 - Math.exp(-dt * 7);
        u.turnY += (goalY - u.turnY) * k;
        u.turnX += -u.turnX * k;
        u.turnVelY = u.turnVelX = 0;
      } else {
        const damp = Math.exp(-dt * 3.2);
        u.turnVelY *= damp;
        u.turnVelX *= damp;
        u.turnY += u.turnVelY * dt;
        u.turnX = THREE.MathUtils.clamp(u.turnX + u.turnVelX * dt, -1.1, 1.1);
      }
    }
    // The hinge: a soft spring to its goal, damped just short of critical, so a tap swings
    // the cover over in about a second and lays it down without a knock. (Stops at shut
    // and flat still catch a hand-thrown cover.)
    if (s.down?.target !== "cover") {
      u.openVel += (26 * (u.openGoal - u.open) - 9.6 * u.openVel) * dt;
      u.open += u.openVel * dt;
      if (u.open > 1) {
        u.open = 1;
        u.openVel *= -0.3;
      } else if (u.open < 0) {
        u.open = 0;
        u.openVel *= -0.2;
      }
    }
    if (u.open > 0.98 && u.openSince < 0) u.openSince = u.time;
    else if (u.open < 0.9) u.openSince = -1;
    // Let go short of free, the disc drops back and clicks onto the hub.
    if (s.down?.target !== "disc") {
      u.liftVel += (120 * -u.lift - 16 * u.liftVel) * dt;
      u.lift += u.liftVel * dt;
      if (u.lift < 0) {
        u.lift = 0;
        u.liftVel *= -0.25;
      }
      u.follow.multiplyScalar(Math.exp(-dt * 12));
    }
  }

  function step(dt: number) {
    if (u.phase === "case") return;
    if (!s.dragging) {
      const goal = s.holding ? HELD_YAW : idle;
      // Theirs eases towards the held speed by 0.05 x 0.16 of the gap per millisecond:
      // a rate of 8 per second.
      s.yawVel += (goal - s.yawVel) * (1 - Math.exp(-dt * 8));
      group.rotation.y += s.yawVel * dt;
      const a = -s.pitch * 30 - s.pitchVel * 9;
      s.pitchVel += a * dt;
      s.pitch += s.pitchVel * dt;
    }
    drag.rotation.x = s.pitch;
  }

  function poseCase() {
    if (!gameCase.root.visible) return;
    const t = u.time;
    const sway = reducedMotion ? 0 : 1;
    const o = smooth(clamp01(u.open));
    const away = u.phase === "case" ? 0 : easeInOut(u.out);
    gameCase.root.position.set(
      SPREAD_SHIFT * o,
      CASE_Y + sway * 0.12 * Math.sin(t * 0.8) * (1 - o) - 6 * away,
      -18 * away,
    );
    gameCase.root.rotation.set(
      lerp(-0.1 + sway * 0.04 * Math.sin(t * 0.45), -0.62, o) - 0.5 * away + u.turnX,
      lerp(0.42 + sway * 0.1 * Math.sin(t * 0.6), 0, o) + u.turnY,
      lerp(0.03, 0, o),
      "YXZ",
    );
    gameCase.setOpen(Math.min(Math.max(u.open + peek(), 0), 1));
  }

  function placeCamera() {
    const e = u.phase === "case" ? 0 : u.phase === "disc" ? 1 : easeInOut(u.out);
    // Opening, the camera eases back as far as the open case needs (on a phone, the
    // whole spread across the screen: cover, poster and disc all in reach).
    const caseDist = lerp(view.distCase, view.distOpen, smooth(clamp01(u.open)));
    const dist = lerp(caseDist, view.distDisc, e);
    // Hand distances (a pull, a drag of the cover, the disc's reach) are in screen pixels
    // per unit at the case, wherever the camera now stands.
    view.pxPerUnit = view.height / (view.view2 * caseDist);
    camera.position.set(0, 0, dist);
    camera.lookAt(0, view.lookY, 0);
    // desktop.fm's fog is close (it starts just past the disc): right for a disc 6 across,
    // but the open case is 14 across, and turned, its far side would wash out. So while the
    // case is out the fog stands well back, and closes in as the disc takes over, the case
    // falling away into it.
    const fog = scene.fog as THREE.Fog;
    fog.near = dist + lerp(10, -3, e);
    fog.far = dist + lerp(60, 12, e);
    const y = lerp(SHADOW.floor.case, SHADOW.floor.disc, e);
    floor.position.y = shadowCamera.position.y = y;
  }

  const local = new THREE.Matrix4();
  const axis = new THREE.Vector3();
  const from = { p: new THREE.Vector3(), q: new THREE.Quaternion(), s: new THREE.Vector3() };
  const to = { p: new THREE.Vector3(), q: new THREE.Quaternion(), s: new THREE.Vector3() };
  function placeDisc() {
    if (u.phase === "case") {
      // Pulled, it tips up on the side away from the pull, as a disc levered off its clips does.
      const lift = u.lift + liftHint();
      const f = u.follow;
      if (f.lengthSq() > 1e-6) axis.set(-f.y, f.x, 0).normalize();
      else axis.set(1, 0, 0);
      local.makeRotationAxis(axis, -lift * 0.32);
      local.setPosition(f.x, f.y, lift * LIFT);
      discHolder.matrix.multiplyMatrices(gameCase.mount.matrixWorld, local);
    } else if (u.phase === "out") {
      stageAnchor.matrixWorld.decompose(to.p, to.q, to.s);
      const e = easeOut(u.out);
      const p = to.p.clone().lerp(from.p, 1 - e);
      p.y += 1.1 * Math.sin(Math.PI * Math.min(u.out * 1.2, 1)); // up and out of the tray
      p.z += 2.5 * Math.sin(Math.PI * u.out); // towards you on the way
      discHolder.matrix.compose(p, from.q.clone().slerp(to.q, e), from.s.clone().lerp(to.s, e));
    } else if (u.phase === "back") {
      // From where it was turning, up and over, down onto the hub.
      gameCase.mount.matrixWorld.decompose(to.p, to.q, to.s);
      const t = easeInOut(1 - u.out);
      const p = from.p.clone().lerp(to.p, t);
      p.y += 1.1 * Math.sin(Math.PI * t);
      p.z += 2.5 * Math.sin(Math.PI * t);
      discHolder.matrix.compose(p, from.q.clone().slerp(to.q, t), from.s.clone().lerp(to.s, t));
    } else {
      discHolder.matrix.copy(stageAnchor.matrixWorld);
    }
    discHolder.matrixWorldNeedsUpdate = true;
  }

  function open() {
    u.openGoal = 1;
  }

  function close() {
    u.openGoal = 0;
  }

  function release() {
    if (u.phase !== "case") return;
    discHolder.matrix.decompose(from.p, from.q, from.s);
    u.phase = "out";
    u.out = 0;
    s.yawVel = idle;
    s.down = null;
    s.dragging = false;
    onRelease?.();
  }

  // A tap on the floating disc puts it back: the case comes back up out of the fog, open,
  // and the disc settles onto its hub, as it left.
  function putBack() {
    if (u.phase !== "disc") return;
    discHolder.matrix.decompose(from.p, from.q, from.s);
    u.phase = "back";
    u.out = 1;
    u.open = u.openGoal = 1;
    u.openVel = 0;
    u.lift = u.liftVel = 0;
    u.follow.set(0, 0);
    gameCase.root.visible = true;
    s.down = null;
    s.dragging = false;
    s.holding = false;
    onReturn?.();
  }
  const stageRay = new THREE.Raycaster();
  const projected = new THREE.Vector3();
  function onStageDisc(x: number, y: number) {
    const rect = canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
    stageRay.setFromCamera(ndc, camera);
    if (stageRay.intersectObject(discHolder, true).length > 0) return true;
    // The hole and the clear hub count too: the middle is where a thumb lands.
    discHolder.getWorldPosition(projected).project(camera);
    const cx = rect.left + ((projected.x + 1) / 2) * rect.width;
    const cy = rect.top + ((1 - projected.y) / 2) * rect.height;
    const dist = camera.position.distanceTo(discHolder.getWorldPosition(new THREE.Vector3()));
    const r = (3 * rect.height) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist);
    return Math.hypot(x - cx, y - cy) < r * 0.45;
  }

  // Generous: anywhere on the disc's face as it lies in the open case.
  function onDisc(x: number, y: number) {
    const rect = canvas.getBoundingClientRect();
    gameCase.mount.getWorldPosition(projected).project(camera);
    const cx = rect.left + ((projected.x + 1) / 2) * rect.width;
    const cy = rect.top + ((1 - projected.y) / 2) * rect.height;
    const r = view.pxPerUnit * 3 * 1.08;
    return Math.hypot(x - cx, (y - cy) / Math.cos(0.62)) < r;
  }

  // The shut cover's free edge, on screen: grabbed near it and pulled towards the spine,
  // the cover swings open; anywhere else, a drag turns the case.
  const edge = { hinge: new THREE.Vector2(), free: new THREE.Vector2(), facing: false, half: 0 };
  const ep = new THREE.Vector3();
  const toScreen = (v: THREE.Vector3, out: THREE.Vector2, rect: DOMRect) => {
    v.project(camera);
    return out.set(rect.left + ((v.x + 1) / 2) * rect.width, rect.top + ((1 - v.y) / 2) * rect.height);
  };
  function measureCover() {
    const rect = canvas.getBoundingClientRect();
    const zFront = 7 / 60;
    toScreen(gameCase.root.localToWorld(ep.set(-1.125, 0, zFront)), edge.hinge, rect);
    toScreen(gameCase.root.localToWorld(ep.set(1.125, 0, zFront)), edge.free, rect);
    const top = toScreen(gameCase.root.localToWorld(ep.set(0, 1.4167, zFront)), new THREE.Vector2(), rect);
    const bottom = toScreen(gameCase.root.localToWorld(ep.set(0, -1.4167, zFront)), new THREE.Vector2(), rect);
    edge.half = top.distanceTo(bottom) / 2;
    // Facing: the front's normal turned towards the camera.
    const n = ep.set(0, 0, 1).transformDirection(gameCase.root.matrixWorld);
    const toCam = camera.position.clone().sub(gameCase.root.getWorldPosition(new THREE.Vector3())).normalize();
    edge.facing = n.dot(toCam) > 0.35;
  }
  // The open cover, lying flat beside the tray: its middle and the spine, on screen.
  const flat = { spine: new THREE.Vector2(), mid: new THREE.Vector2(), half: 0 };
  function measureOpenCover() {
    const rect = canvas.getBoundingClientRect();
    const z = -7 / 60;
    toScreen(gameCase.root.localToWorld(ep.set(-81.5 / 60, 0, z)), flat.spine, rect);
    toScreen(gameCase.root.localToWorld(ep.set(-149 / 60, 0, z)), flat.mid, rect);
    const top = toScreen(gameCase.root.localToWorld(ep.set(-149 / 60, 1.4167, z)), new THREE.Vector2(), rect);
    const bottom = toScreen(gameCase.root.localToWorld(ep.set(-149 / 60, -1.4167, z)), new THREE.Vector2(), rect);
    flat.half = top.distanceTo(bottom) / 2;
  }
  function onOpenCover(x: number, y: number) {
    measureOpenCover();
    const axis = flat.mid.clone().sub(flat.spine);
    const len = axis.length();
    axis.divideScalar(len);
    const rel = new THREE.Vector2(x, y).sub(flat.spine);
    const t = rel.dot(axis) / len;
    const off = Math.abs(rel.x * axis.y - rel.y * axis.x);
    return t > 0 && t < 2.1 && off < flat.half * 1.05;
  }

  function onCoverEdge(x: number, y: number) {
    measureCover();
    if (!edge.facing) return false;
    const axis = edge.free.clone().sub(edge.hinge);
    const len = axis.length();
    axis.divideScalar(len);
    const rel = new THREE.Vector2(x, y).sub(edge.hinge);
    const t = rel.dot(axis) / len;
    const off = Math.abs(rel.x * axis.y - rel.y * axis.x);
    return t > 0.6 && t < 1.2 && off < edge.half * 1.05;
  }

  // --- The poster: taken out, held up, unfolded, turned over, folded and put back ----
  const pz = {
    want: "in" as "in" | "out",
    travel: 0, // 0 in the cover, 1 held up to you
    unfold: 0, // 0 folded; the fold down the middle opens first, then the three across
    yaw: 0, // turned by hand, to see side B
    yawVel: 0,
  };
  const posterOut = () => pz.want === "out" || pz.travel > 0;
  function stepPoster(dt: number) {
    const k = reducedMotion ? 3 : 1;
    if (pz.want === "out") {
      pz.travel = Math.min(1, pz.travel + (dt / 0.7) * k);
      if (pz.travel >= 1) pz.unfold = Math.min(1, pz.unfold + (dt / 1.4) * k);
      if (s.down?.target !== "poster") {
        pz.yawVel *= Math.exp(-dt * 2.5);
        pz.yaw += pz.yawVel * dt;
      }
    } else {
      // Folded up and squared to you first, then back into the cover.
      const goal = Math.round(pz.yaw / (Math.PI * 2)) * Math.PI * 2;
      pz.yaw += (goal - pz.yaw) * (1 - Math.exp(-dt * 8));
      pz.yawVel = 0;
      pz.unfold = Math.max(0, pz.unfold - (dt / 1.1) * k);
      if (pz.unfold <= 0 && Math.abs(goal - pz.yaw) < 0.05) pz.travel = Math.max(0, pz.travel - (dt / 0.7) * k);
    }
  }
  const centreMm = new THREE.Vector3();
  const pFrom = { p: new THREE.Vector3(), q: new THREE.Quaternion(), s: new THREE.Vector3() };
  const pTo = { p: new THREE.Vector3(), q: new THREE.Quaternion(), s: new THREE.Vector3() };
  const yawQ = new THREE.Quaternion();
  const UP = new THREE.Vector3(0, 1, 0);
  function placePoster() {
    const cols = 1 - smooth(clamp01(pz.unfold / 0.4));
    const rows = 1 - smooth(clamp01((pz.unfold - 0.4) / 0.6));
    poster.setFold(cols, rows);
    poster.root.position.copy(poster.centre(cols, rows, centreMm)).negate();
    gameCase.posterMount.updateWorldMatrix(true, false);
    const t = easeInOut(pz.travel);
    if (t <= 0) {
      posterHolder.matrix.copy(gameCase.posterMount.matrixWorld);
    } else {
      gameCase.posterMount.matrixWorld.decompose(pFrom.p, pFrom.q, pFrom.s);
      // Held up between you and the case, upright, as large as fits.
      const dist = camera.position.length();
      const near = Math.max(dist - 14, 10);
      const viewH = 2 * near * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const scale = Math.min((0.8 * viewH) / SHEET.h, (0.9 * viewH * camera.aspect) / SHEET.w);
      const dir = new THREE.Vector3(0, view.lookY, 0).sub(camera.position).normalize();
      pTo.p.copy(camera.position).addScaledVector(dir, near);
      pTo.q.copy(camera.quaternion).multiply(yawQ.setFromAxisAngle(UP, pz.yaw));
      pTo.s.setScalar(scale);
      const p = pFrom.p.clone().lerp(pTo.p, t);
      p.y += 1.2 * Math.sin(Math.PI * t); // up out of the cover on the way
      posterHolder.matrix.compose(p, pFrom.q.clone().slerp(pTo.q, t), pFrom.s.clone().lerp(pTo.s, t));
    }
    posterHolder.matrixWorldNeedsUpdate = true;
  }
  const raycaster = new THREE.Raycaster();
  function onPoster(x: number, y: number) {
    const rect = canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
    posterHolder.updateMatrixWorld(true);
    raycaster.setFromCamera(ndc, camera);
    return raycaster.intersectObjects(poster.meshes, false).length > 0;
  }
  function takeOutPoster() {
    pz.want = "out";
  }
  function putBackPoster() {
    pz.want = "in";
  }

  const clock = new THREE.Clock(false);
  function frame() {
    const dt = Math.min(clock.getDelta(), 1 / 20);
    u.time += dt;
    stepCase(dt);
    stepPoster(dt);
    step(dt);
    poseCase();
    placeCamera();
    scene.updateMatrixWorld();
    placeDisc();
    placePoster();
    renderShadow();
    renderer.setRenderTarget(target);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.render(post, postCamera);
  }

  const size = { width: 0, height: 0 };
  function setSize(width: number, height: number) {
    if (!width || !height) return;
    size.width = width;
    size.height = height;
    const pr = pixelRatio(width, height);
    renderer.setPixelRatio(pr);
    renderer.setSize(width, height, false);
    // Dense enough, the extra pixels smooth edges themselves: multisampling then would only
    // quadruple the memory.
    const samples = pr >= 2 ? 0 : 4;
    if (target.samples !== samples) {
      target.samples = samples;
      target.dispose();
    }
    target.setSize(Math.round(width * pr), Math.round(height * pr));
    const aspect = width / height;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    // desktop.fm's framing (28 units back) is for wide screens. On a narrow one the disc
    // (6 units across) is wider than the view, so the camera backs off until it fits with
    // a margin, the fog moving with it; and in portrait the disc is centred a little above
    // the middle rather than left near the top. The case, likewise, further back; open,
    // it shows both halves where they fit, and on a narrow screen the half with the disc.
    const view2 = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    view.distDisc = Math.max(28, FIT_WIDTH / (view2 * aspect));
    view.distCase = Math.max(CASE_DIST, CASE_FIT / (view2 * aspect));
    view.lookY = aspect < 0.8 ? 0.3 : 0;
    view.distOpen = Math.max(view.distCase, SPREAD_FIT / (view2 * aspect));
    view.view2 = view2;
    view.height = height;
    view.pxPerUnit = height / (view2 * view.distCase);
    if (!clock.running) frame();
  }

  // Pinch-zoom changes no element's size, so nothing else would re-render it sharper.
  const onZoom = () => setSize(size.width, size.height);
  window.visualViewport?.addEventListener("resize", onZoom);

  function setActive(active: boolean) {
    if (active && !clock.running) {
      clock.start();
      renderer.setAnimationLoop(frame);
    } else if (!active && clock.running) {
      clock.stop();
      renderer.setAnimationLoop(null);
    }
  }

  return {
    setSize,
    setActive,
    pointerDown(x, y) {
      const now = performance.now();
      if (u.phase === "out") return;
      if (u.phase === "case") {
        u.touched = true;
        if (posterOut()) {
          // Held up: a drag turns it over; a tap folds it and puts it back.
          s.down = { x, y, lastX: x, lastY: y, t: now, t0: now, target: "poster", open0: u.open };
          s.dragging = false;
          return;
        }
        const target =
          u.open > 0.9 && onPoster(x, y)
            ? "posterIn"
            : u.open > 0.9 && onDisc(x, y)
            ? "disc"
            : u.open >= 0.9 && onOpenCover(x, y)
              ? "cover"
              : u.open > 0.1 && u.open < 0.9
              ? "cover"
              : u.open <= 0.1 && onCoverEdge(x, y)
                ? "cover"
                : "turn";
        s.down = { x, y, lastX: x, lastY: y, t: now, t0: now, target, open0: u.open };
        s.dragging = false;
        return;
      }
      s.down = { x, y, lastX: x, lastY: y, t: now, t0: now, target: "stage", open0: 0 };
      window.clearTimeout(s.holdTimer);
      // Pressed and held still: it turns faster, as on desktop.fm.
      s.holdTimer = window.setTimeout(() => {
        if (s.down && !s.dragging) s.holding = true;
      }, 140);
    },
    pointerMove(x, y) {
      const d = s.down;
      if (!d) return;
      if (!s.dragging && Math.hypot(x - d.x, y - d.y) > 5) {
        s.dragging = true;
        s.holding = false;
        window.clearTimeout(s.holdTimer);
      }
      if (!s.dragging) return;
      const now = performance.now();
      const dt = Math.max((now - d.t) / 1000, 1 / 240);
      // Dragged from the folded poster, it is the cover being pushed shut.
      if (d.target === "posterIn") d.target = "cover";

      if (d.target === "poster") {
        const dYaw = (x - d.lastX) * 0.01;
        pz.yaw += dYaw;
        pz.yawVel = lerp(pz.yawVel, dYaw / dt, 0.6);
      } else if (d.target === "cover") {
        // Shut, pulled towards the spine, the cover swings open round it; open, pushed back
        // towards the spine, it swings shut. About its own width on screen goes all the way.
        let pulled: number;
        if (d.open0 < 0.5) {
          measureCover();
          const along = edge.hinge.clone().sub(edge.free).normalize();
          pulled = (x - d.x) * along.x + (y - d.y) * along.y;
        } else {
          measureOpenCover();
          const along = flat.spine.clone().sub(flat.mid).normalize();
          pulled = -((x - d.x) * along.x + (y - d.y) * along.y);
        }
        const full = Math.max(view.pxPerUnit * 6.75 * 1.15, 140);
        const next = THREE.MathUtils.clamp(d.open0 + pulled / full, -0.04, 1.04);
        u.openVel = lerp(u.openVel, (next - u.open) / dt, 0.6);
        u.open = next;
      } else if (d.target === "disc") {
        // Off the hub: the further the pull, the higher it comes, sliding after the hand;
        // pulled far enough, it is free.
        const dx = x - d.x;
        const dy = y - d.y;
        u.lift = Math.min(Math.hypot(dx, dy) / (view.pxPerUnit * 2.4), 1);
        u.follow.set(dx, -dy).multiplyScalar(0.45 / (view.pxPerUnit * 3));
        if (u.lift >= 1) release();
      } else if (d.target === "turn") {
        const dY = (x - d.lastX) * 0.009;
        const dX = (y - d.lastY) * 0.007;
        u.turnY += dY;
        u.turnX = THREE.MathUtils.clamp(u.turnX + dX, -1.1, 1.1);
        u.turnVelY = lerp(u.turnVelY, dY / dt, 0.6);
        u.turnVelX = lerp(u.turnVelX, dX / dt, 0.6);
      } else {
        const dYaw = (x - d.lastX) * 0.0085;
        const dPitch = (y - d.lastY) * 0.0055;
        group.rotation.y += dYaw;
        s.pitch = THREE.MathUtils.clamp(s.pitch + dPitch, -0.9, 0.9);
        s.yawVel = THREE.MathUtils.clamp(s.yawVel * 0.4 + (dYaw / dt) * 0.6, -14, 14);
        s.pitchVel = THREE.MathUtils.clamp(s.pitchVel * 0.4 + (dPitch / dt) * 0.6, -8, 8);
      }
      d.lastX = x;
      d.lastY = y;
      d.t = now;
    },
    pointerUp() {
      const d = s.down;
      if (d && d.target !== "stage" && u.phase === "case") {
        const tap = !s.dragging && performance.now() - d.t0 < 450;
        if (d.target === "posterIn") {
          if (tap) takeOutPoster();
        } else if (d.target === "poster") {
          if (tap) putBackPoster();
          else if (performance.now() - d.t > 90) pz.yawVel = 0;
        } else if (d.target === "turn") {
          // A tap opens the shut case; on the open one, anywhere but the disc, shuts it.
          if (tap) {
            if (u.open < 0.5) open();
            else close();
          } else if (performance.now() - d.t > 90) {
            u.turnVelY = u.turnVelX = 0; // stopped before letting go: no throw
          }
        } else if (d.target === "cover") {
          if (tap) {
            if (u.open < 0.5) open();
            else close();
          } else {
            u.openGoal = u.open + u.openVel * 0.12 > 0.5 ? 1 : 0;
          }
        } else if (tap || u.lift > 0.45) {
          release();
        }
      } else if (d && d.target === "stage" && s.dragging && performance.now() - d.t > 90) {
        // A drag that stopped before letting go should not fling.
        s.yawVel = s.pitchVel = 0;
      } else if (d && d.target === "stage" && !s.dragging && performance.now() - d.t0 < 230 && onStageDisc(d.x, d.y)) {
        // A quick tap, not a hold (that spins it faster) and not a throw.
        putBack();
      }
      s.down = null;
      s.dragging = false;
      s.holding = false;
      window.clearTimeout(s.holdTimer);
    },
    nudge(direction) {
      if (u.phase !== "disc") return;
      s.yawVel = THREE.MathUtils.clamp(s.yawVel + direction * 2.6, -14, 14);
    },
    hold(on) {
      s.holding = on && u.phase === "disc";
    },
    back() {
      if (u.phase === "disc") {
        putBack();
        return true;
      }
      if (u.phase === "case" && posterOut()) {
        putBackPoster();
        return true;
      }
      return false;
    },
    advance() {
      if (u.phase === "disc") return false;
      u.touched = true;
      if (u.phase === "case") {
        if (posterOut()) putBackPoster();
        else if (u.open < 0.5) open();
        else release();
      }
      return true;
    },
    dispose() {
      setActive(false);
      window.visualViewport?.removeEventListener("resize", onZoom);
      window.clearTimeout(s.holdTimer);
      for (const d of disposables) d.dispose();
      renderer.dispose();
    },
  };
}
