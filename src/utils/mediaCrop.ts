import type { CSSProperties } from "react";

/** Top-left and width of a 4:3 crop rect in intrinsic source pixels. Height is derived. */
export interface MediaDisplayRegion {
  /** Left edge in pixels from the source left. */
  x: number;
  /** Top edge in pixels from the source top. */
  y: number;
  /** Width in source pixels; height is computed as `round(width × 3 / 4)`. */
  width: number;
}

export const DISPLAY_REGION_ASPECT = 4 / 3;

/** Height in source pixels for a 4:3 region with the given width. */
export function displayRegionHeight(width: number): number {
  return Math.round((width * 3) / 4);
}

function isValidDisplayRegion(
  region: MediaDisplayRegion,
  sourceWidth: number,
  sourceHeight: number,
): boolean {
  const { x, y, width } = region;
  if (width <= 0 || x < 0 || y < 0) {
    return false;
  }

  const height = displayRegionHeight(width);
  return x + width <= sourceWidth && y + height <= sourceHeight;
}

/**
 * CSS styles to show a 4:3 source-pixel region scaled to fill a 4:3 frame.
 * Returns `null` when the region is invalid for the given source dimensions.
 */
export function getDisplayRegionStyles(
  region: MediaDisplayRegion,
  sourceWidth: number,
  sourceHeight: number,
  frameWidth: number,
  frameHeight: number,
): CSSProperties | null {
  if (
    frameWidth <= 0 ||
    frameHeight <= 0 ||
    sourceWidth <= 0 ||
    sourceHeight <= 0 ||
    !isValidDisplayRegion(region, sourceWidth, sourceHeight)
  ) {
    return null;
  }

  const scale = frameWidth / region.width;

  return {
    position: "absolute",
    width: scale * sourceWidth,
    height: scale * sourceHeight,
    left: -region.x * scale,
    top: -region.y * scale,
    maxWidth: "none",
  };
}
