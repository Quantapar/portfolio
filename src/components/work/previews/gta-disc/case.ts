import * as THREE from "three";
import { artTexture, printMaterial, type Art, type Levels } from "./print.ts";

/* The game case: the PS5 retail case, 135 × 170 × 14 mm, in its translucent blue
   plastic. Two halves joined by a spine through two living hinges, a paper insert in
   the outer sleeve printed both sides as the retail box's is (front, spine and back
   laid out after the retail box from Rockstar's art, screenshots and logos; a heist
   piece across the inside, seen through the tray), and a hub of clips the disc presses
   onto. The retail edition is code-in-box; ours has the disc.

   Built in millimetres in the disc model's frame (its label faces +z), laid out open
   and flat, inside up: front | spine | back. setOpen(0) folds it shut, front on top.
   The case root is in the disc model's units (a unit is 60 mm, the disc's radius). */

export const CASE = {
  w: 135,
  h: 170,
  d: 14, // shut: the spine's width
  wall: 1.6,
  r: 4, // outer corners
  inset: 3.5, // the paper's margin inside the outer edge
  paper: 160, // the paper's height
} as const;

const RIM = CASE.d / 2 - CASE.wall; // each half's wall rises to meet the other's at mid-depth
const SEAT = { rIn: 16.5, rOut: 19.5, h: 1.6 }; // the ring the disc rests on
const HUB = { rIn: 5.2, rOut: 7.35, h: 4.2, petals: 10 }; // clips through the 7.5 mm hole
export const DISC_REST = CASE.wall + SEAT.h + 0.6; // the disc's mid-plane over the back's outer face

export type CaseArt = {
  front: Art; // the front of the sleeve
  inside: Art | Promise<Art>; // printed across the inside: front | spine | back
  back: Art; // the back of the sleeve
  spine: Art; // the spine's print, 14 × 160 mm
};

export type GameCase = {
  root: THREE.Group;
  /** Where the disc sits on the hub; the disc's frame (units, label up). */
  mount: THREE.Object3D;
  /** Where the folded poster lies, in the front cover; millimetres, its face up. */
  posterMount: THREE.Object3D;
  setOpen(p: number): void;
  dispose(): void;
};

type Env = { envMap: THREE.Texture; envMapIntensity: number; envMapRotation: THREE.Euler };

// A rounded rectangle, square on the hinge side (x = 0), rounded on the far one.
function slabShape(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  s.moveTo(0, -h / 2);
  s.lineTo(w - r, -h / 2);
  s.absarc(w - r, -h / 2 + r, r, -Math.PI / 2, 0, false);
  s.lineTo(w, h / 2 - r);
  s.absarc(w - r, h / 2 - r, r, 0, Math.PI / 2, false);
  s.lineTo(0, h / 2);
  s.closePath();
  return s;
}

// The wall round a half: a U open on the hinge side, t thick, its corners following the slab's.
function wallShape(w: number, h: number, r: number, t: number) {
  const s = new THREE.Shape();
  const ri = Math.max(r - t, 0.3);
  s.moveTo(0, -h / 2);
  s.lineTo(w - r, -h / 2);
  s.absarc(w - r, -h / 2 + r, r, -Math.PI / 2, 0, false);
  s.lineTo(w, h / 2 - r);
  s.absarc(w - r, h / 2 - r, r, 0, Math.PI / 2, false);
  s.lineTo(0, h / 2);
  s.lineTo(0, h / 2 - t);
  s.lineTo(w - t - ri, h / 2 - t);
  s.absarc(w - t - ri, h / 2 - t - ri, ri, Math.PI / 2, 0, true);
  s.lineTo(w - t, -h / 2 + t + ri);
  s.absarc(w - t - ri, -h / 2 + t + ri, ri, 0, -Math.PI / 2, true);
  s.lineTo(0, -h / 2 + t);
  s.closePath();
  return s;
}

function extrude(shapes: THREE.Shape | THREE.Shape[], depth: number, bevel = 0.35) {
  const g = new THREE.ExtrudeGeometry(shapes, {
    depth: Math.max(depth - 2 * bevel, 0.01),
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 10,
  });
  g.translate(0, 0, bevel);
  return g;
}

// A paper panel x0..x1 (mm) at height `paper`, facing +z or -z.
// A paper panel x0..x1 (mm), facing +z or -z, showing the image's u0..u1.
function paperGeometry(x0: number, x1: number, facing: 1 | -1, u0 = 0, u1 = 1) {
  const g = new THREE.PlaneGeometry(x1 - x0, CASE.paper);
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setX(i, THREE.MathUtils.lerp(u0, u1, uv.getX(i)));
  // Facing -z: turned over, so it reads the right way round from that side.
  if (facing < 0) g.rotateY(Math.PI);
  g.translate((x0 + x1) / 2, 0, 0);
  return g;
}

export function createCase(art: CaseArt, env: Env, maxAnisotropy: number, levels: Levels): GameCase {
  const { w: W, h: H, d: D, wall, r, inset } = CASE;
  const disposables: { dispose(): void }[] = [];
  const keep = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

  const texture = (source: Art | Promise<Art>) => keep(artTexture(source, maxAnisotropy));

  // PS5 blue polypropylene: translucent and glossy. Thin where it is a sheet (the
  // covers and tray, which the print shows through); seen through its depth at the walls
  // and spine, nearly solid, as the moulding is.
  const sheet = keep(
    new THREE.MeshStandardMaterial({
      ...env,
      color: new THREE.Color("#1f63e0"),
      metalness: 0,
      roughness: 0.06,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  const walls = keep(sheet.clone());
  walls.opacity = 0.86;
  walls.color.set("#1a56cc");
  // The hub and seat: the same plastic, a touch frosted, as moulded clips are.
  const frosted = keep(sheet.clone());
  frosted.roughness = 0.3;
  frosted.opacity = 0.7;

  // The sleeve's paper and its inside: printed, shown as printed (print.ts).
  const paper = (map: THREE.Texture) => keep(printMaterial(map, levels));
  const frontPaper = paper(texture(art.front));
  const backPaper = paper(texture(art.back));
  const spinePaper = paper(texture(art.spine));
  const insidePaper = paper(texture(art.inside));

  const mesh = (g: THREE.BufferGeometry, m: THREE.Material) => new THREE.Mesh(keep(g), m);
  const PAPER_OUT = -0.22; // the paper lies in the sleeve, just outside the shell
  const PAPER_IN = -0.12;

  // The inside print runs across all three panels, front | spine | back, in the back's
  // hinge frame; the image is cropped to the spread already.
  const X0 = -D - W + inset;
  const X1 = W - inset;
  const spreadU = (x: number) => (x - X0) / (X1 - X0);

  // One half: slab, wall, paper. Built hinge at x = 0, running to +x.
  function half(outer: THREE.Material, mirrored: boolean, insideFrom: number) {
    const g = new THREE.Group();
    const shell = new THREE.Group();
    if (mirrored) shell.scale.x = -1;
    shell.add(mesh(extrude(slabShape(W, H, r), wall), sheet));
    const rim = mesh(extrude(wallShape(W, H, r, wall), RIM, 0.3), walls);
    rim.position.z = wall;
    shell.add(rim);
    g.add(shell);
    // Paper: outside face and inside face, to the hinge on the hinge side.
    const sx = mirrored ? -1 : 1;
    const a = 0;
    const b = sx * (W - inset);
    const [x0, x1] = a < b ? [a, b] : [b, a];
    const out = mesh(paperGeometry(x0, x1, -1), outer);
    out.position.z = PAPER_OUT;
    const inner = mesh(paperGeometry(x0, x1, 1, spreadU(x0 + insideFrom), spreadU(x1 + insideFrom)), insidePaper);
    inner.position.z = PAPER_IN;
    g.add(out, inner);
    return g;
  }

  const root = new THREE.Group();
  const mm = new THREE.Group();
  mm.scale.setScalar(1 / 60);
  root.add(mm);

  // The back half, its hinge at x = -W/2 so the hub sits on the disc model's origin.
  const back = half(backPaper, false, 0);
  back.position.set(-W / 2, 0, -D / 2);
  mm.add(back);

  // Seat ring and hub clips, at the back's centre.
  const seatShape = new THREE.Shape().absarc(0, 0, SEAT.rOut, 0, Math.PI * 2, false);
  seatShape.holes.push(new THREE.Path().absarc(0, 0, SEAT.rIn, 0, Math.PI * 2, true));
  const seat = mesh(extrude(seatShape, SEAT.h, 0.3), frosted);
  seat.position.set(W / 2, 0, wall);
  const petals: THREE.Shape[] = [];
  const step = (Math.PI * 2) / HUB.petals;
  for (let i = 0; i < HUB.petals; i++) {
    const a0 = i * step + step * 0.14;
    const a1 = (i + 1) * step - step * 0.14;
    const p = new THREE.Shape();
    p.absarc(0, 0, HUB.rOut, a0, a1, false);
    p.absarc(0, 0, HUB.rIn, a1, a0, true);
    p.closePath();
    petals.push(p);
  }
  const hub = mesh(extrude(petals, HUB.h, 0.35), frosted);
  hub.position.set(W / 2, 0, wall);
  back.add(seat, hub);

  const mount = new THREE.Object3D();
  mount.position.set(W / 2, 0, DISC_REST);
  mount.scale.setScalar(60); // back to the disc's units
  back.add(mount);

  // The spine, hinged on the back's edge.
  const spineHinge = new THREE.Group();
  back.add(spineHinge);
  spineHinge.add(mesh(new THREE.BoxGeometry(D, H - 2 * 0.6, wall).translate(-D / 2, 0, wall / 2), sheet));
  const spineOut = mesh(paperGeometry(-D, 0, -1), spinePaper);
  spineOut.position.z = PAPER_OUT;
  const spineIn = mesh(paperGeometry(-D, 0, 1, spreadU(-D), spreadU(0)), insidePaper);
  spineIn.position.z = PAPER_IN;
  spineHinge.add(spineOut, spineIn);

  // The front, hinged on the spine's far edge; mirrored, it runs to -x when open.
  const frontHinge = new THREE.Group();
  frontHinge.position.x = -D;
  spineHinge.add(frontHinge);
  frontHinge.add(half(frontPaper, true, -D));

  // The folded poster stands in the front cover (it folds to 99 × 140), its outside face
  // up and its layers under it on the tray.
  const posterMount = new THREE.Object3D();
  posterMount.position.set(-W / 2, 0, wall + 4.2);
  posterMount.rotation.y = Math.PI;
  frontHinge.add(posterMount);

  function setOpen(p: number) {
    // Each living hinge folds a right angle; the front turns through both.
    const a = (Math.PI / 2) * (1 - p);
    spineHinge.rotation.y = a;
    frontHinge.rotation.y = a;
  }
  setOpen(0);

  return {
    root,
    mount,
    posterMount,
    setOpen,
    dispose() {
      for (const d of disposables) d.dispose();
    },
  };
}
