import { describe, expect, it } from "vitest";
import {
  computeGuideLibraryScrollMarginTop,
  computeGuideOverviewScrollMarginTop,
  computeGuideStepScrollMarginTop,
  GUIDE_STEP_PROGRESS_STICKY_GAP,
} from "../context/guideScrollMargin";

describe("computeGuideOverviewScrollMarginTop", () => {
  it("uses the parent offset only", () => {
    expect(
      computeGuideOverviewScrollMarginTop({
        parentScrollMarginTop: 64,
      }),
    ).toBe(64);
  });

  it("includes extra parent offset from embedders", () => {
    expect(
      computeGuideOverviewScrollMarginTop({
        parentScrollMarginTop: 64,
        additionalParentScrollMarginTop: 24,
      }),
    ).toBe(88);
  });
});

describe("computeGuideLibraryScrollMarginTop", () => {
  it("includes the progress bar height and sticky gap", () => {
    expect(
      computeGuideLibraryScrollMarginTop({
        progressBarHeight: 72,
        includeProgressBar: true,
      }),
    ).toBe(72 + GUIDE_STEP_PROGRESS_STICKY_GAP);
  });

  it("is zero when the progress bar is hidden", () => {
    expect(
      computeGuideLibraryScrollMarginTop({
        progressBarHeight: 72,
        includeProgressBar: false,
      }),
    ).toBe(0);
  });
});

describe("computeGuideStepScrollMarginTop", () => {
  it("combines parent and library offsets", () => {
    expect(
      computeGuideStepScrollMarginTop({
        parentScrollMarginTop: 64,
        progressBarHeight: 72,
        includeProgressBar: true,
      }),
    ).toBe(64 + 72 + GUIDE_STEP_PROGRESS_STICKY_GAP);
  });

  it("uses parent offset only when the progress bar is hidden", () => {
    expect(
      computeGuideStepScrollMarginTop({
        parentScrollMarginTop: 64,
        progressBarHeight: 72,
        includeProgressBar: false,
      }),
    ).toBe(64);
  });
});
