import { describe, expect, it } from "vitest";
import {
  centeredDisplayRegion,
  clampDisplayRegion,
  displayRegionHeight,
  getDisplayRegionStyles,
  MIN_REGION_WIDTH,
} from "./mediaCrop";

describe("displayRegionHeight", () => {
  it("derives 4:3 height from width", () => {
    expect(displayRegionHeight(640)).toBe(480);
    expect(displayRegionHeight(1200)).toBe(900);
    expect(displayRegionHeight(1)).toBe(1);
  });
});

describe("centeredDisplayRegion", () => {
  it("centers horizontally on a wide source", () => {
    expect(centeredDisplayRegion(1280, 720)).toEqual({ x: 160, y: 0, width: 960 });
  });

  it("centers vertically on a tall source", () => {
    expect(centeredDisplayRegion(600, 900)).toEqual({ x: 0, y: 225, width: 600 });
  });

  it("returns the whole source when it is already 4:3", () => {
    expect(centeredDisplayRegion(1200, 900)).toEqual({ x: 0, y: 0, width: 1200 });
  });

  it("always derives a height that fits the source", () => {
    for (const [w, h] of [[1000, 333], [333, 1000], [1920, 1081]]) {
      const region = centeredDisplayRegion(w, h);
      expect(region.x + region.width).toBeLessThanOrEqual(w);
      expect(region.y + displayRegionHeight(region.width)).toBeLessThanOrEqual(h);
    }
  });
});

describe("clampDisplayRegion", () => {
  it("pulls an over-sized, out-of-bounds region back inside", () => {
    expect(clampDisplayRegion({ x: -50, y: 9999, width: 99999 }, 1280, 720)).toEqual({
      x: 0,
      y: 0,
      width: 960,
    });
  });

  it("enforces the minimum width", () => {
    expect(clampDisplayRegion({ x: 0, y: 0, width: 4 }, 1280, 720)).toEqual({
      x: 0,
      y: 0,
      width: MIN_REGION_WIDTH,
    });
  });

  it("keeps a valid region untouched and integer-snapped", () => {
    expect(clampDisplayRegion({ x: 100.4, y: 50.6, width: 640.2 }, 1280, 720)).toEqual({
      x: 100,
      y: 51,
      width: 640,
    });
  });
});

describe("getDisplayRegionStyles", () => {
  const region = { x: 320, y: 90, width: 640 };

  it("scales and positions the source to show the region in the frame", () => {
    const styles = getDisplayRegionStyles(region, 1280, 720, 400, 300);

    expect(styles).toEqual({
      position: "absolute",
      width: 800,
      height: 450,
      left: -200,
      top: -56.25,
      maxWidth: "none",
    });
  });

  it("uses uniform scale when frame and region are both 4:3", () => {
    const styles = getDisplayRegionStyles(region, 1280, 720, 640, 480);

    expect(styles).toMatchObject({
      width: 1280,
      height: 720,
      left: -320,
      top: -90,
    });
  });

  it("returns null when region extends past source bounds", () => {
    expect(
      getDisplayRegionStyles({ x: 900, y: 0, width: 640 }, 1280, 720, 400, 300),
    ).toBeNull();
    expect(
      getDisplayRegionStyles({ x: 0, y: 500, width: 640 }, 1280, 720, 400, 300),
    ).toBeNull();
  });

  it("returns null for non-positive width or dimensions", () => {
    expect(getDisplayRegionStyles({ x: 0, y: 0, width: 0 }, 1280, 720, 400, 300)).toBeNull();
    expect(getDisplayRegionStyles(region, 0, 720, 400, 300)).toBeNull();
    expect(getDisplayRegionStyles(region, 1280, 720, 0, 300)).toBeNull();
  });
});
