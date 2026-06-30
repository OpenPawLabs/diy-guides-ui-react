import { describe, expect, it } from "vitest";
import {
  getOverviewRect,
  getStepVisibleRatio,
  isAtPageBottom,
  pickActiveGuideSection,
  pickActiveGuideStep,
} from "./pickActiveGuideStep";

describe("getStepVisibleRatio", () => {
  it("ignores the area hidden behind fixed chrome at the top", () => {
    expect(getStepVisibleRatio({ top: -50, bottom: 350, height: 400 } as DOMRect, 900, 144)).toBeCloseTo(
      206 / 400,
      2,
    );
  });

  it("returns zero when the section is entirely above the content inset", () => {
    expect(getStepVisibleRatio({ top: -300, bottom: 50, height: 350 } as DOMRect, 900, 144)).toBe(0);
  });
});

describe("getOverviewRect", () => {
  it("spans from the guide top through the content column", () => {
    const rect = getOverviewRect(
      { top: 64, bottom: 1200, height: 1136, left: 0, right: 800, width: 800, x: 0, y: 64 } as DOMRect,
      { top: 520, bottom: 1200, height: 680, left: 0, right: 800, width: 800, x: 0, y: 520 } as DOMRect,
    );

    expect(rect).toMatchObject({ top: 64, bottom: 520, height: 456 });
  });
});

describe("pickActiveGuideSection", () => {
  it("selects a step when it is more visible than the overview", () => {
    const overviewRect = { top: -350, bottom: 120, height: 470 } as DOMRect;
    const steps = new Map<number, DOMRect>([
      [1, { top: 160, bottom: 520, height: 360 } as DOMRect],
    ]);

    expect(
      pickActiveGuideSection({
        overviewRect,
        overviewContentInsetTop: 64,
        stepNumbers: [1],
        getStepRect: (step) => steps.get(step) ?? null,
        activeStepMinVisibleRatio: 0.2,
        stepContentInsetTop: 144,
        innerHeight: 900,
      }),
    ).toBe(1);
  });

  it("selects a step once the overview falls below the visible ratio", () => {
    const overviewRect = { top: -300, bottom: 100, height: 400 } as DOMRect;
    const steps = new Map<number, DOMRect>([
      [1, { top: 160, bottom: 520, height: 360 } as DOMRect],
    ]);

    expect(
      pickActiveGuideSection({
        overviewRect,
        overviewContentInsetTop: 64,
        stepNumbers: [1],
        getStepRect: (step) => steps.get(step) ?? null,
        activeStepMinVisibleRatio: 0.2,
        stepContentInsetTop: 144,
        innerHeight: 900,
      }),
    ).toBe(1);
  });

  it("clears the step when the overview is fully visible again", () => {
    const overviewRect = { top: 64, bottom: 700, height: 636 } as DOMRect;
    const steps = new Map<number, DOMRect>([
      [1, { top: 820, bottom: 1020, height: 200 } as DOMRect],
    ]);

    expect(
      pickActiveGuideSection({
        overviewRect,
        overviewContentInsetTop: 64,
        stepNumbers: [1],
        getStepRect: (step) => steps.get(step) ?? null,
        activeStepMinVisibleRatio: 0.2,
        stepContentInsetTop: 144,
        innerHeight: 900,
      }),
    ).toBeNull();
  });

  it("does not keep a step active when it is only visible behind fixed chrome", () => {
    const steps = new Map<number, DOMRect>([
      [1, { top: -200, bottom: 120, height: 320 } as DOMRect],
      [2, { top: 220, bottom: 520, height: 300 } as DOMRect],
    ]);

    expect(
      pickActiveGuideSection({
        overviewRect: null,
        overviewContentInsetTop: 64,
        stepNumbers: [1, 2],
        getStepRect: (step) => steps.get(step) ?? null,
        activeStepMinVisibleRatio: 0.2,
        stepContentInsetTop: 144,
        innerHeight: 900,
      }),
    ).toBe(2);
  });

  it("selects the final step when the reader has scrolled to the page bottom", () => {
    const steps = new Map<number, DOMRect>([
      [3, { top: 200, bottom: 500, height: 300 } as DOMRect],
      [4, { top: 520, bottom: 720, height: 200 } as DOMRect],
    ]);

    expect(
      pickActiveGuideSection({
        overviewRect: null,
        overviewContentInsetTop: 64,
        stepNumbers: [3, 4],
        getStepRect: (step) => steps.get(step) ?? null,
        activeStepMinVisibleRatio: 0.2,
        stepContentInsetTop: 144,
        innerHeight: 900,
        atPageBottom: true,
      }),
    ).toBe(4);
  });

  it("keeps natural step selection before the document bottom", () => {
    const steps = new Map<number, DOMRect>([
      [3, { top: 200, bottom: 500, height: 300 } as DOMRect],
      [4, { top: 520, bottom: 720, height: 200 } as DOMRect],
    ]);

    expect(
      pickActiveGuideSection({
        overviewRect: null,
        overviewContentInsetTop: 64,
        stepNumbers: [3, 4],
        getStepRect: (step) => steps.get(step) ?? null,
        activeStepMinVisibleRatio: 0.2,
        stepContentInsetTop: 144,
        innerHeight: 900,
        atPageBottom: false,
      }),
    ).toBe(3);
  });

  it("prefers the final step when it is in the primary reading position", () => {
    const steps = new Map<number, DOMRect>([
      [3, { top: 200, bottom: 500, height: 300 } as DOMRect],
      [4, { top: 144, bottom: 344, height: 200 } as DOMRect],
    ]);

    expect(
      pickActiveGuideSection({
        overviewRect: null,
        overviewContentInsetTop: 64,
        stepNumbers: [3, 4],
        getStepRect: (step) => steps.get(step) ?? null,
        activeStepMinVisibleRatio: 0.2,
        stepContentInsetTop: 144,
        innerHeight: 900,
      }),
    ).toBe(4);
  });
});

describe("pickActiveGuideStep", () => {
  it("advances when the current step is mostly scrolled past", () => {
    const elements = new Map<number, DOMRect>([
      [1, { top: -180, bottom: 20, height: 200 } as DOMRect],
      [2, { top: 40, bottom: 240, height: 200 } as DOMRect],
    ]);

    expect(
      pickActiveGuideStep([1, 2], 0.2, (step) => elements.get(step) ?? null),
    ).toBe(2);
  });

  it("keeps the current step active while at least 20% remains visible", () => {
    const elements = new Map<number, DOMRect>([
      [1, { top: -140, bottom: 60, height: 200 } as DOMRect],
      [2, { top: 300, bottom: 500, height: 200 } as DOMRect],
    ]);

    expect(
      pickActiveGuideStep([1, 2], 0.2, (step) => elements.get(step) ?? null),
    ).toBe(1);
  });
});

describe("isAtPageBottom", () => {
  it("returns true when scroll position reaches the document bottom", () => {
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 2000,
    });
    Object.defineProperty(document.body, "scrollHeight", {
      configurable: true,
      value: 2000,
    });

    expect(isAtPageBottom(1100, 900, 2)).toBe(true);
    expect(isAtPageBottom(500, 900, 2)).toBe(false);
  });

  it("returns false when the page is not scrollable", () => {
    expect(isAtPageBottom(0, 900, 2)).toBe(false);
  });
});
