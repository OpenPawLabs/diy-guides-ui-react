import { render, waitFor } from "@testing-library/react";
import { useRef, type RefObject } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useGuideStepUrlSync } from "./useGuideStepUrlSync";

function SyncHarness({
  stepNumbers,
  enabled = true,
  guideTopRef = null,
}: {
  stepNumbers: number[];
  enabled?: boolean;
  guideTopRef?: RefObject<HTMLDivElement | null> | null;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const localGuideTopRef = useRef<HTMLDivElement>(null);
  const topRef = guideTopRef ?? localGuideTopRef;

  useGuideStepUrlSync({
    enabled,
    rootRef,
    guideTopRef: topRef,
    stepNumbers,
  });

  return (
    <div ref={topRef} data-testid="guide-top">
      <p>Overview section</p>
      <div ref={rootRef} data-testid="guide-root">
        {stepNumbers.map((step) => (
          <section key={step} id={`step-${step}`}>
            Step {step}
          </section>
        ))}
      </div>
    </div>
  );
}

describe("useGuideStepUrlSync", () => {
  const scrollIntoView = vi.fn();
  const scrolledElements: Element[] = [];
  let intersectionCallback: (() => void) | undefined;

  beforeEach(() => {
    scrolledElements.length = 0;
    intersectionCallback = undefined;
    scrollIntoView.mockReset();
    scrollIntoView.mockImplementation(function (this: Element) {
      scrolledElements.push(this);
    });
    Element.prototype.scrollIntoView = scrollIntoView;

    globalThis.IntersectionObserver = vi.fn(function (
      this: IntersectionObserver,
      callback: IntersectionObserverCallback,
    ) {
      intersectionCallback = () => {
        callback([], this);
      };
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
        unobserve: vi.fn(),
      };
    }) as unknown as typeof IntersectionObserver;

    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        href: "https://example.com/guide",
        hash: "",
        search: "",
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("smooth-scrolls to the guide overview when no step is in the URL", async () => {
    render(<SyncHarness stepNumbers={[1, 2]} />);

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "start",
      });
    });

    expect(scrolledElements[0]).toHaveAttribute("data-testid", "guide-top");
  });

  it("falls back to the step list root when no guide top ref is provided", async () => {
    function StandaloneHarness() {
      const rootRef = useRef<HTMLDivElement>(null);

      useGuideStepUrlSync({
        enabled: true,
        rootRef,
        stepNumbers: [1, 2],
      });

      return (
        <div ref={rootRef} data-testid="guide-root">
          <section id="step-1">Step 1</section>
          <section id="step-2">Step 2</section>
        </div>
      );
    }

    render(<StandaloneHarness />);

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalled();
    });

    expect(scrolledElements[0]).toHaveAttribute("data-testid", "guide-root");
  });

  it("smooth-scrolls to the requested step from the hash", async () => {
    window.location.hash = "#step-2";

    render(<SyncHarness stepNumbers={[1, 2]} />);

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "start",
      });
    });

    expect(scrolledElements[0]).toHaveAttribute("id", "step-2");
  });

  it("does nothing when disabled", async () => {
    window.location.hash = "#step-2";

    render(<SyncHarness stepNumbers={[1, 2]} enabled={false} />);

    await waitFor(() => {
      expect(scrollIntoView).not.toHaveBeenCalled();
    });
  });

  it("syncs the URL from scroll after initial programmatic scroll settles", async () => {
    vi.useFakeTimers();
    const replaceState = vi
      .spyOn(window.history, "replaceState")
      .mockImplementation(() => {});

    render(<SyncHarness stepNumbers={[1, 2]} />);

    const guideTop = document.querySelector("[data-testid='guide-top']") as HTMLElement;
    const stepOne = document.getElementById("step-1") as HTMLElement;

    vi.spyOn(guideTop, "getBoundingClientRect").mockReturnValue({
      top: -500,
      bottom: -100,
      height: 400,
    } as DOMRect);
    vi.spyOn(stepOne, "getBoundingClientRect").mockReturnValue({
      top: 100,
      bottom: 400,
      height: 300,
    } as DOMRect);

    await vi.advanceTimersByTimeAsync(901);

    expect(replaceState).toHaveBeenCalledWith(
      window.history.state,
      "",
      "https://example.com/guide#step-1",
    );

    vi.useRealTimers();
  });

  it("clears the step hash when the reader scrolls back to the overview", async () => {
    vi.useFakeTimers();
    const replaceState = vi
      .spyOn(window.history, "replaceState")
      .mockImplementation(() => {});

    window.location.hash = "#step-1";
    window.location.href = "https://example.com/guide#step-1";

    render(<SyncHarness stepNumbers={[1, 2]} />);

    await vi.advanceTimersByTimeAsync(901);

    const guideTop = document.querySelector("[data-testid='guide-top']") as HTMLElement;
    const stepOne = document.getElementById("step-1") as HTMLElement;

    vi.spyOn(guideTop, "getBoundingClientRect").mockReturnValue({
      top: 0,
      bottom: 500,
      height: 500,
    } as DOMRect);
    vi.spyOn(stepOne, "getBoundingClientRect").mockReturnValue({
      top: 880,
      bottom: 1080,
      height: 200,
    } as DOMRect);

    intersectionCallback?.();

    expect(replaceState).toHaveBeenCalledWith(
      window.history.state,
      "",
      "https://example.com/guide",
    );

    vi.useRealTimers();
  });
});
