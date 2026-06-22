import { describe, expect, it } from "vitest";
import {
  displayRegionHeight,
  getDisplayRegionStyles,
} from "./mediaCrop";

describe("displayRegionHeight", () => {
  it("derives 4:3 height from width", () => {
    expect(displayRegionHeight(640)).toBe(480);
    expect(displayRegionHeight(1200)).toBe(900);
    expect(displayRegionHeight(1)).toBe(1);
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
