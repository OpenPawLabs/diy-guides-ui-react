import { describe, expect, it } from "vitest";
import {
  getStepVisibleRatio,
  pickActiveGuideStep,
} from "./pickActiveGuideStep";

describe("pickActiveGuideStep", () => {
  it("advances when the current step is mostly scrolled past", () => {
    const elements = new Map<number, DOMRect>([
      [1, { top: -180, bottom: 20, height: 200 } as DOMRect],
      [2, { top: 40, bottom: 240, height: 200 } as DOMRect],
    ]);

    expect(
      pickActiveGuideStep( [1, 2], 0.2, (step) => elements.get(step) ?? null),
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

  it("does not advance when the next step header reaches the scroll anchor", () => {
    const elements = new Map<number, DOMRect>([
      [2, { top: -50, bottom: 400, height: 450 } as DOMRect],
      [3, { top: 160, bottom: 500, height: 340 } as DOMRect],
    ]);

    expect(getStepVisibleRatio(elements.get(2)!, 800)).toBeCloseTo(400 / 450, 2);
    expect(
      pickActiveGuideStep([2, 3], 0.2, (step) => elements.get(step) ?? null, 800),
    ).toBe(2);
  });

  it("advances once the current step drops below the visible ratio threshold", () => {
    const elements = new Map<number, DOMRect>([
      [2, { top: -380, bottom: 40, height: 420 } as DOMRect],
      [3, { top: 80, bottom: 420, height: 340 } as DOMRect],
    ]);

    expect(getStepVisibleRatio(elements.get(2)!, 800)).toBeCloseTo(40 / 420, 2);
    expect(
      pickActiveGuideStep([2, 3], 0.2, (step) => elements.get(step) ?? null, 800),
    ).toBe(3);
  });
});
