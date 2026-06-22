import { describe, expect, it } from "vitest";
import { COLORS, hexToRgba, markerTextColor } from "./colors";

describe("hexToRgba", () => {
  it("converts a hex color to rgba with the given alpha", () => {
    expect(hexToRgba("#ff0000", 0.1)).toBe("rgba(255, 0, 0, 0.1)");
  });
});

describe("markerTextColor", () => {
  it("returns dark text (#111111) on light backgrounds with high luminance", () => {
    expect(markerTextColor(COLORS.YELLOW)).toBe("#111111");
    expect(markerTextColor("#ffffff")).toBe("#111111");
  });

  it("returns light text (#ffffff) on mid-tone and dark backgrounds", () => {
    expect(markerTextColor(COLORS.LIGHT_BLUE)).toBe("#ffffff");
    expect(markerTextColor("#000000")).toBe("#ffffff");
  });
});
