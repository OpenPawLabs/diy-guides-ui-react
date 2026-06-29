import { describe, expect, it } from "vitest";
import { computeGuideStepScrollMarginTop } from "../context/guideScrollMargin";

describe("computeGuideStepScrollMarginTop", () => {
  it("includes the base margin, site chrome, and sticky progress bar", () => {
    expect(
      computeGuideStepScrollMarginTop({
        siteScrollMarginTop: 64,
        progressBarHeight: 72,
        includeProgressBar: true,
      }),
    ).toBe(16 + 64 + 72 + 8);
  });

  it("omits progress bar height when the bar is hidden", () => {
    expect(
      computeGuideStepScrollMarginTop({
        siteScrollMarginTop: 64,
        progressBarHeight: 72,
        includeProgressBar: false,
      }),
    ).toBe(16 + 64);
  });
});
