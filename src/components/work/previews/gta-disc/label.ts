/* The label, painted on a canvas in millimetres.

   A 120 mm disc, measured from the centre: the hole to 7.5, the clear hub, then the
   print from 11.5 (hub-printed, as many discs are) to 59.1, where desktop.fm's disc
   model starts its chamfered rim. The canvas covers the disc edge to edge, so a
   canvas pixel is 120 / size mm. */

export const MM = {
  disc: 60,
  labelIn: 11.5,
  labelOut: 59.1,
} as const;

export type LabelArt = {
  panels: HTMLImageElement; // the cover's panels, without the logo
  vi: HTMLImageElement; // the logo's VI, cropped from its square-cover layer
  text: HTMLImageElement; // the logo's "grand theft auto", likewise
};

function canvas(size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  // Millimetres, origin at the centre, y down (canvas) — the texture is flipped on upload.
  ctx.translate(size / 2, size / 2);
  ctx.scale(size / 120, size / 120);
  return { c, ctx };
}

function annulus(ctx: CanvasRenderingContext2D, rIn: number, rOut: number) {
  ctx.beginPath();
  ctx.arc(0, 0, rOut, 0, Math.PI * 2);
  ctx.arc(0, 0, rIn, 0, Math.PI * 2, true);
}

/* The label side: Rockstar's official square cover, rebuilt from the layers their site
   ships it in (the panels, the logo's VI, the logo's lettering), each in its official
   place, so it matches the cover exactly. */

// The square cover's frame: 1920 px, drawn this wide (mm) so its dark border falls
// just outside the rim.
const FRAME_PX = 1920;
const COVER = 123.6;
const K = COVER / FRAME_PX;
const at = (px: number) => -COVER / 2 + px * K;

// Where the two logo crops sit in that frame (px).
const VI = { x: 326, y: 531 };
const TEXT = { x: 609, y: 601 };

export function paintLabel(art: LabelArt, size = 2048) {
  const { c, ctx } = canvas(size);
  ctx.save();
  annulus(ctx, MM.labelIn, MM.labelOut);
  ctx.clip("evenodd");

  ctx.drawImage(art.panels, -COVER / 2, -COVER / 2, COVER, COVER);
  ctx.drawImage(art.vi, at(VI.x), at(VI.y), art.vi.naturalWidth * K, art.vi.naturalHeight * K);
  ctx.drawImage(art.text, at(TEXT.x), at(TEXT.y), art.text.naturalWidth * K, art.text.naturalHeight * K);

  ctx.restore();
  return c;
}
