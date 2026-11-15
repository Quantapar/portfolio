import * as THREE from "three";

/* Printed paper, shown as printed: every printed surface in the scene (the box's sleeve,
   its inside, the poster) through one material, so they all carry Rockstar's colours the
   same way and none runs hotter or paler than another.

   The art is shown at its own colours, lit only enough to read its angle (a face turned
   from you darkens a little), then run back through the inverse of the frame's levels
   pass (scene.ts), so it comes out of that pass exactly as the file it came from. */

export type Levels = { lo: number; gamma: number; hi: number };

export function printMaterial(map: THREE.Texture, levels: Levels) {
  const m = new THREE.MeshBasicMaterial({ map });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uLevels = { value: new THREE.Vector3(levels.lo, levels.gamma, levels.hi) };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vFace;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvFace = normalize(normalMatrix * normal);");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform vec3 uLevels;\nvarying vec3 vFace;")
      .replace(
        "#include <opaque_fragment>",
        `#include <opaque_fragment>
        float facing = abs(normalize(vFace).z);
        gl_FragColor.rgb *= mix(0.78, 1.0, facing);
        gl_FragColor.rgb = pow(max(gl_FragColor.rgb, 0.0), vec3(uLevels.y)) * (uLevels.z - uLevels.x) + uLevels.x;`,
      );
  };
  return m;
}

/* Art that may still be on its way: the texture shows a flat stand-in in the print's
   own tone until the file lands, then takes the file. Only the closed box's outside is
   waited for; the rest (the inside, the poster, the disc's label) comes in behind it. */

export type Art = HTMLImageElement | HTMLCanvasElement;

export function artTexture(source: Art | Promise<Art>, maxAnisotropy: number, tone = "#2a2530") {
  const t = new THREE.Texture();
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = maxAnisotropy;
  const show = (img: Art) => {
    // A new size can't reuse the stand-in's storage on the GPU.
    t.dispose();
    t.image = img;
    t.needsUpdate = true;
  };
  if (source instanceof Promise) {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = tone;
    ctx.fillRect(0, 0, 1, 1);
    t.image = c;
    t.needsUpdate = true;
    source.then(show, () => {});
  } else {
    show(source);
  }
  return t;
}
