/** Stage master used as the page backdrop and as the curtain texture. */
export const STAGE_IMAGE = {
  src: "/images/stage/skylounge-stage_master_4k.png",
  width: 1456,
  height: 816,
} as const;

/**
 * Closed orange curtain, as fractions of the master image.
 * Tuned to the fabric itself: above the stage lip, inside the proscenium.
 * Centered on x so cover-cropping on narrow screens keeps the opening aligned.
 */
export const CURTAIN_OPENING = {
  x: 0.272,
  y: 0.142,
  w: 0.456,
  h: 0.49,
} as const;

export type CoverLayout = {
  offsetX: number;
  offsetY: number;
  renderedW: number;
  renderedH: number;
};

export type FrameRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/** Same math as background-size: cover; background-position: center. */
export function coverLayout(
  frameW: number,
  frameH: number,
  imgW: number,
  imgH: number
): CoverLayout {
  const scale = Math.max(frameW / imgW, frameH / imgH);
  const renderedW = imgW * scale;
  const renderedH = imgH * scale;
  return {
    renderedW,
    renderedH,
    offsetX: (frameW - renderedW) / 2,
    offsetY: (frameH - renderedH) / 2,
  };
}

export function openingRect(cover: CoverLayout): FrameRect {
  return {
    left: cover.offsetX + CURTAIN_OPENING.x * cover.renderedW,
    top: cover.offsetY + CURTAIN_OPENING.y * cover.renderedH,
    width: CURTAIN_OPENING.w * cover.renderedW,
    height: CURTAIN_OPENING.h * cover.renderedH,
  };
}
