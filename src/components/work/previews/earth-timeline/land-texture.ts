import type { TextureData } from "./renderer";
import { LAND_MASK } from "./land-mask";

let cached: TextureData | null = null;

/** Box blur that wraps east-west and clamps at the poles. */
function blur(source: Float32Array, width: number, height: number, radius: number) {
  const span = radius * 2 + 1;
  const across = new Float32Array(source.length);
  const result = new Float32Array(source.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      for (let k = -radius; k <= radius; k++) sum += source[y * width + ((x + k + width) % width)]!;
      across[y * width + x] = sum / span;
    }
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      for (let k = -radius; k <= radius; k++) sum += across[Math.min(height - 1, Math.max(0, y + k)) * width + x]!;
      result[y * width + x] = sum / span;
    }
  }
  return result;
}

/**
 * The 1-bit land mask unpacked into a texture: land in `.r`, and a blurred copy in `.a` that
 * measures distance from the coast. Built once and shared by every globe on the page.
 */
export function landTexture(): TextureData {
  if (cached) return cached;
  const { width, height, base64 } = LAND_MASK;
  const bits = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  const land = new Float32Array(width * height);
  for (let i = 0; i < land.length; i++) land[i] = (bits[i >> 3]! >> (7 - (i & 7))) & 1;
  const coast = blur(blur(land, width, height, 4), width, height, 4);
  const data = new Uint8Array(width * height * 2);
  for (let i = 0; i < land.length; i++) {
    data[i * 2] = land[i]! * 255;
    data[i * 2 + 1] = Math.round(coast[i]! * 255);
  }
  cached = { width, height, channels: 2, data };
  return cached;
}
