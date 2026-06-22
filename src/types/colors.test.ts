import { describe, expect, it } from "vitest";
import { COLORS, hexToRgba, markerTextColor } from "./colors";

describe("hexToRgba", () => {
  it("converts a hex color to rgba with the given alpha", () => {
    expect(hexToRgba("#ff0000", 0.1)).toBe("rgba(255, 0, 0, 0.1)");
    expect(hexToRgba(COLORS.BLUE, 0.5)).toBe("rgba(23, 56, 222, 0.5)");
  });
});

describe("markerTextColor", () => {
  it("returns dark text on light backgrounds", () => {
    expect(markerTextColor(COLORS.YELLOW)).toBe("#111111");
  });

  it("returns dark text on bright palette colors", () => {
    expect(markerTextColor(COLORS.LIGHT_BLUE)).toBe("#111111");
  });

  it("returns light text on saturated mid-tone backgrounds", () => {
    expect(markerTextColor(COLORS.MAGENTA)).toBe("#ffffff");
  });

  it("returns light text on dark backgrounds", () => {
    expect(markerTextColor(COLORS.BLUE)).toBe("#ffffff");
    expect(markerTextColor(COLORS.RED)).toBe("#ffffff");
  });
});
