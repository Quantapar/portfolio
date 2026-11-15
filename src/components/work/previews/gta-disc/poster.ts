import * as THREE from "three";
import { artTexture, printMaterial, type Art, type Levels } from "./print.ts";

/* The double-sided poster in the retail box: 18 × 26 in (457 × 660 mm), folded in four
   down and five across to 114 × 132 so it stands upright in the front cover, the girl
   side's bottom-left corner (its "Welcome to Vice City") showing, as in the box. Side A
   carries the key art; side B the cover's girl.

   Built in millimetres, flat, side A towards +z, centred on the sheet. Each fold is a
   hinge: the rows of each column fold onto the bottom one, then the columns fold onto
   the right one, every layer landing in front of side A's bottom-right panel, so that
   panel's back (side B's bottom-left) is the outside face. */

export const SHEET = { w: 457, h: 660, cols: 4, rows: 5 } as const;
const COL = SHEET.w / SHEET.cols;
const ROW = SHEET.h / SHEET.rows;
const LAYER = 0.15; // mm between stacked layers

export type PosterArt = { a: Art | Promise<Art>; b: Art | Promise<Art> };

export type Poster = {
  root: THREE.Group;
  meshes: THREE.Mesh[];
  /** 1 folded, 0 open: the folds down, and the folds across. */
  setFold(cols: number, rows: number): void;
  /** The middle of the sheet's current extent, mm, for keeping it centred as it opens. */
  centre(cols: number, rows: number, out: THREE.Vector3): THREE.Vector3;
  /** How far the folded layers stand off the outside face, mm. */
  thickness: number;
  dispose(): void;
};

export function createPoster(art: PosterArt, maxAnisotropy: number, levels: Levels): Poster {
  const disposables: { dispose(): void }[] = [];
  const keep = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);
  const meshes: THREE.Mesh[] = [];

  const material = (img: Art | Promise<Art>) => keep(printMaterial(keep(artTexture(img, maxAnisotropy)), levels));
  const sideA = material(art.a);
  const sideB = material(art.b);

  const { w: W, h: H, cols: N, rows: M } = SHEET;
  const C = COL;
  const R = ROW;

  // One panel, both faces: columns left to right, rows top to bottom (side A's view).
  function panel(c: number, r: number) {
    const x0 = -W / 2 + c * C;
    const x1 = x0 + C;
    const y1 = H / 2 - r * R;
    const y0 = y1 - R;
    const g = new THREE.Group();

    const a = keep(new THREE.PlaneGeometry(C, R));
    const ua = a.attributes.uv;
    for (let i = 0; i < ua.count; i++) {
      ua.setXY(
        i,
        THREE.MathUtils.lerp((x0 + W / 2) / W, (x1 + W / 2) / W, ua.getX(i)),
        THREE.MathUtils.lerp((y0 + H / 2) / H, (y1 + H / 2) / H, ua.getY(i)),
      );
    }
    a.translate((x0 + x1) / 2, (y0 + y1) / 2, 0);

    // Side B, seen from behind, runs right to left over side A.
    const b = keep(new THREE.PlaneGeometry(C, R));
    const ub = b.attributes.uv;
    for (let i = 0; i < ub.count; i++) {
      ub.setXY(
        i,
        THREE.MathUtils.lerp((W / 2 - x1) / W, (W / 2 - x0) / W, ub.getX(i)),
        THREE.MathUtils.lerp((y0 + H / 2) / H, (y1 + H / 2) / H, ub.getY(i)),
      );
    }
    b.rotateY(Math.PI);
    b.translate((x0 + x1) / 2, (y0 + y1) / 2, 0);

    const ma = new THREE.Mesh(a, sideA);
    const mb = new THREE.Mesh(b, sideB);
    meshes.push(ma, mb);
    g.add(ma, mb);
    return g;
  }

  // A column: its bottom panel fixed, the rows above on hinges, each folding over the last
  // (hinges sit a layer to alternate sides, so the folded rows stack, a layer apart).
  function column(c: number) {
    const root = new THREE.Group();
    root.add(panel(c, M - 1));
    const hinges: THREE.Group[] = [];
    let parent: THREE.Object3D = root;
    const origin = new THREE.Vector3();
    for (let k = 0; k < M - 1; k++) {
      const at = new THREE.Vector3(0, -H / 2 + R * (k + 1), k % 2 === 0 ? LAYER / 2 : -LAYER / 2);
      const hinge = new THREE.Group();
      hinge.position.copy(at).sub(origin);
      parent.add(hinge);
      const p = panel(c, M - 2 - k);
      p.position.copy(at).negate();
      hinge.add(p);
      hinges.push(hinge);
      parent = hinge;
      origin.copy(at);
    }
    return { root, hinges };
  }

  // The columns, right to left, each folding over everything already stacked. Each
  // column is a stack of rows a layer apart; folded, it turns over, so its hinge stands
  // off far enough that the stack lands just past the deepest layer so far.
  const columns = [column(N - 1)];
  const colHinges: THREE.Group[] = [];
  const root = new THREE.Group();
  root.add(columns[0].root);
  let parent: THREE.Object3D = root;
  const origin = new THREE.Vector3();
  const rowsDeep = (M - 1) * LAYER;
  let facing = 1; // +1 while a column's own stack runs towards the fold side
  let depth = 0; // that column's origin, along the fold side
  let deepest = rowsDeep;
  for (let k = 0; k < N - 1; k++) {
    const next = -facing;
    const nextDepth = next > 0 ? deepest + LAYER : deepest + LAYER + rowsDeep;
    const z = (nextDepth - depth) / (2 * facing);
    const at = new THREE.Vector3(W / 2 - C * (k + 1), 0, z);
    const hinge = new THREE.Group();
    hinge.position.copy(at).sub(origin);
    parent.add(hinge);
    const col = column(N - 2 - k);
    col.root.position.copy(at).negate();
    hinge.add(col.root);
    columns.push(col);
    colHinges.push(hinge);
    parent = hinge;
    origin.copy(at);
    facing = next;
    depth = nextDepth;
    deepest = next > 0 ? nextDepth + rowsDeep : nextDepth;
  }

  function setFold(cols: number, rows: number) {
    for (const col of columns) col.hinges.forEach((h, k) => (h.rotation.x = (k % 2 === 0 ? 1 : -1) * Math.PI * rows));
    colHinges.forEach((h, k) => (h.rotation.y = (k % 2 === 0 ? 1 : -1) * Math.PI * cols));
  }
  setFold(1, 1);

  return {
    root,
    meshes,
    setFold,
    centre(cols, rows, out) {
      return out.set((W / 2 - C / 2) * cols, (-H / 2 + R / 2) * rows, 0);
    },
    thickness: deepest + LAYER,
    dispose() {
      for (const d of disposables) d.dispose();
    },
  };
}
