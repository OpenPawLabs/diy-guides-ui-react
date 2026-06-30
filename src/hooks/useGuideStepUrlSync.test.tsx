import { render, waitFor } from "@testing-library/react";
import { useRef, type RefObject } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useGuideStepUrlSync } from "./useGuideStepUrlSync";

function SyncHarness({
  stepNumbers,
  enabled = true,
  guideTopRef = null,
  guideContentRef = null,
  overviewScrollMarginTop = 0,
  scrollMarginTop = 0,
}: {
  stepNumbers: number[];
  enabled?: boolean;
  guideTopRef?: RefObject<HTMLDivElement | null> | null;
  guideContentRef?: RefObject<HTMLDivElement | null> | null;
  overviewScrollMarginTop?: number;
  scrollMarginTop?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const localGuideTopRef = useRef<HTMLDivElement>(null);
  const localGuideContentRef = useRef<HTMLDivElement>(null);
  const topRef = guideTopRef ?? localGuideTopRef;
  const contentRef = guideContentRef ?? localGuideContentRef;

  useGuideStepUrlSync({
    enabled,
    rootRef,
    guideTopRef: topRef,
    guideContentRef: contentRef,
    stepNumbers,
    overviewScrollMarginTop,
    scrollMarginTop,
  });

  return (
    <>
      <div ref={topRef} data-testid="guide-top">
        <p>Overview section</p>
      </div>
      <div ref={contentRef} data-testid="guide-content" />
      <div ref={rootRef} data-testid="guide-root">
        {stepNumbers.map((step) => (
          <section key={step} id={`step-${step}`}>
            Step {step}
          </section>
        ))}
      </div>
    </>
  );
}

function mockRects(rects: {
  guideTop?: Partial<DOMRect>;
  guideContent?: Partial<DOMRect>;
  guideRoot?: Partial<DOMRect>;
  steps?: Record<number, Partial<DOMRect>>;
}) {
  const guideTopRect = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
    ...rects.guideTop,
  } as DOMRect;

  const guideContentRect = {
    top: guideTopRect.bottom,
    bottom: guideTopRect.bottom,
    left: 0,
    right: 0,
    width: 0,
    height: 0,
    x: 0,
    y: guideTopRect.bottom,
    toJSON: () => ({}),
    ...rects.guideContent,
  } as DOMRect;

  const guideRootRect =
    rects.guideRoot != null &&
    typeof (rects.guideRoot as DOMRect).toJSON === "function"
      ? (rects.guideRoot as DOMRect)
      : ({
          top: guideTopRect.bottom,
          bottom: guideTopRect.bottom,
          left: 0,
          right: 0,
          width: 0,
          height: 0,
          x: 0,
          y: guideTopRect.bottom,
          toJSON: () => ({}),
          ...rects.guideRoot,
        } as DOMRect);

  const stepRects = new Map(
    Object.entries(rects.steps ?? {}).map(([step, rect]) => [
      Number(step),
      {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
        ...rect,
      } as DOMRect,
    ]),
  );

  return vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    if (this.dataset.testid === "guide-top") {
      return guideTopRect;
    }

    if (this.dataset.testid === "guide-content") {
      return guideContentRect;
    }

    if (this.dataset.testid === "guide-root") {
      return guideRootRect;
    }

    const stepMatch = this.id.match(/^step-(\d+)$/);
    if (stepMatch != null) {
      return stepRects.get(Number(stepMatch[1])) ?? guideTopRect;
    }

    return guideTopRect;
  });
}

describe("useGuideStepUrlSync", () => {
  const scrollTo = vi.fn();
  let intersectionCallback: (() => void) | undefined;

  beforeEach(() => {
    intersectionCallback = undefined;
    scrollTo.mockReset();

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
      writable: true,
    });
    window.scrollTo = scrollTo;

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
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 0,
    });
    Object.defineProperty(document.body, "scrollHeight", {
      configurable: true,
      value: 0,
    });
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
      writable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 768,
      writable: true,
    });
  });

  it("smooth-scrolls to the guide overview when no step is in the URL", async () => {
    mockRects({ guideTop: { top: 200, bottom: 600, height: 400 } });

    render(<SyncHarness stepNumbers={[1, 2]} />);

    await waitFor(() => {
      expect(scrollTo).toHaveBeenCalledWith({ top: 200, behavior: "smooth" });
    });
  });

  it("applies the overview scroll margin when scrolling to the guide top", async () => {
    mockRects({ guideTop: { top: 200, bottom: 600, height: 400 } });

    render(<SyncHarness overviewScrollMarginTop={64} stepNumbers={[1, 2]} />);

    await waitFor(() => {
      expect(scrollTo).toHaveBeenCalledWith({ top: 136, behavior: "smooth" });
    });
  });

  it("falls back to the step list root when no guide top ref is provided", async () => {
    mockRects({ guideTop: { top: 120, bottom: 500, height: 380 } });

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
      expect(scrollTo).toHaveBeenCalled();
    });
  });

  it("instant-scrolls to the requested step on initial load", async () => {
    window.location.hash = "#step-2";
    mockRects({
      guideTop: { top: 0, bottom: 400, height: 400 },
      steps: {
        2: { top: 300, bottom: 600, height: 300 },
      },
    });

    render(<SyncHarness scrollMarginTop={64} stepNumbers={[1, 2]} />);

    await waitFor(() => {
      expect(scrollTo).toHaveBeenCalledWith({ top: 236, behavior: "auto" });
    });
  });

  it("smooth-scrolls to a step when the hash changes after initial load", async () => {
    mockRects({
      guideTop: { top: 0, bottom: 400, height: 400 },
      steps: {
        2: { top: 300, bottom: 600, height: 300 },
      },
    });

    render(<SyncHarness scrollMarginTop={64} stepNumbers={[1, 2]} />);

    await waitFor(() => {
      expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });

    scrollTo.mockClear();
    window.location.hash = "#step-2";
    window.dispatchEvent(new HashChangeEvent("hashchange"));

    await waitFor(() => {
      expect(scrollTo).toHaveBeenCalledWith({ top: 236, behavior: "smooth" });
    });
  });

  it("does nothing when disabled", async () => {
    window.location.hash = "#step-2";

    render(<SyncHarness stepNumbers={[1, 2]} enabled={false} />);

    await waitFor(() => {
      expect(scrollTo).not.toHaveBeenCalled();
    });
  });

  it("re-scrolls the requested step when scroll margins become available", async () => {
    vi.spyOn(window.history, "replaceState").mockImplementation(() => {});
    window.location.hash = "#step-2";
    window.location.href = "https://example.com/guide#step-2";
    mockRects({
      guideTop: { top: 0, bottom: 400, height: 400 },
      steps: {
        2: { top: 300, bottom: 600, height: 300 },
      },
    });

    function MarginHarness({ scrollMarginTop }: { scrollMarginTop: number }) {
      return (
        <SyncHarness scrollMarginTop={scrollMarginTop} stepNumbers={[1, 2]} />
      );
    }

    const { rerender } = render(<MarginHarness scrollMarginTop={0} />);

    await waitFor(() => {
      expect(scrollTo).toHaveBeenCalledWith({ top: 300, behavior: "auto" });
    });

    scrollTo.mockClear();
    rerender(<MarginHarness scrollMarginTop={64} />);

    await waitFor(() => {
      expect(scrollTo).toHaveBeenCalledWith({ top: 236, behavior: "auto" });
    });
  });

  it("re-scrolls the overview when the parent scroll margin becomes available", async () => {
    vi.spyOn(window.history, "replaceState").mockImplementation(() => {});
    mockRects({ guideTop: { top: 200, bottom: 600, height: 400 } });

    function MarginHarness({ overviewScrollMarginTop }: { overviewScrollMarginTop: number }) {
      return (
        <SyncHarness
          overviewScrollMarginTop={overviewScrollMarginTop}
          stepNumbers={[1, 2]}
        />
      );
    }

    const { rerender } = render(<MarginHarness overviewScrollMarginTop={0} />);

    await waitFor(() => {
      expect(scrollTo).toHaveBeenCalledWith({ top: 200, behavior: "smooth" });
    });

    scrollTo.mockClear();
    rerender(<MarginHarness overviewScrollMarginTop={64} />);

    await waitFor(() => {
      expect(scrollTo).toHaveBeenCalledWith({ top: 136, behavior: "smooth" });
    });
  });

  it("syncs the URL from scroll after initial programmatic scroll settles", async () => {
    vi.useFakeTimers();
    const replaceState = vi
      .spyOn(window.history, "replaceState")
      .mockImplementation(() => {});

    mockRects({
      guideTop: { top: -500, bottom: -100, height: 400 },
      guideContent: { top: -100, bottom: -100, height: 0 },
      steps: {
        1: { top: 100, bottom: 400, height: 300 },
      },
    });

    render(<SyncHarness scrollMarginTop={0} stepNumbers={[1, 2]} />);

    await vi.advanceTimersByTimeAsync(901);

    expect(replaceState).toHaveBeenCalledWith(
      window.history.state,
      "",
      "https://example.com/guide#step-1",
    );

    vi.useRealTimers();
  });

  it("keeps the step hash while scrolling to a deep-linked step", async () => {
    const replaceState = vi
      .spyOn(window.history, "replaceState")
      .mockImplementation(() => {});

    window.location.hash = "#step-1";
    window.location.href = "https://example.com/guide#step-1";

    mockRects({
      guideTop: { top: 64, bottom: 500, height: 436 },
      guideContent: { top: 500, bottom: 500, height: 0 },
      steps: {
        1: { top: 880, bottom: 1080, height: 200 },
        2: { top: 1200, bottom: 1400, height: 200 },
      },
    });

    render(
      <SyncHarness
        overviewScrollMarginTop={64}
        scrollMarginTop={144}
        stepNumbers={[1, 2]}
      />,
    );

    await waitFor(() => {
      expect(scrollTo).toHaveBeenCalledWith({ top: 736, behavior: "auto" });
    });

    intersectionCallback?.();

    expect(replaceState).not.toHaveBeenCalledWith(
      window.history.state,
      "",
      "https://example.com/guide",
    );
  });

  it("clears the step hash when the reader scrolls back to the overview", async () => {
    vi.useFakeTimers();
    const replaceState = vi
      .spyOn(window.history, "replaceState")
      .mockImplementation(() => {});

    mockRects({
      guideTop: { top: -500, bottom: -100, height: 400 },
      guideContent: { top: -100, bottom: -100, height: 0 },
      steps: {
        1: { top: 144, bottom: 344, height: 200 },
        2: { top: 1200, bottom: 1400, height: 200 },
      },
    });

    render(
      <SyncHarness
        overviewScrollMarginTop={64}
        scrollMarginTop={144}
        stepNumbers={[1, 2]}
      />,
    );

    await vi.advanceTimersByTimeAsync(901);
    intersectionCallback?.();

    expect(replaceState).toHaveBeenCalledWith(
      window.history.state,
      "",
      "https://example.com/guide#step-1",
    );

    window.location.hash = "#step-1";
    window.location.href = "https://example.com/guide#step-1";
    replaceState.mockClear();
    mockRects({
      guideTop: { top: 64, bottom: 500, height: 436 },
      guideContent: { top: 500, bottom: 500, height: 0 },
      steps: {
        1: { top: 880, bottom: 1080, height: 200 },
        2: { top: 1200, bottom: 1400, height: 200 },
      },
    });

    intersectionCallback?.();

    expect(replaceState).toHaveBeenCalledWith(
      window.history.state,
      "",
      "https://example.com/guide",
    );

    vi.useRealTimers();
  });

  it("does not promote step 1 when the overview is showing", async () => {
    vi.useFakeTimers();
    const replaceState = vi
      .spyOn(window.history, "replaceState")
      .mockImplementation(() => {});

    mockRects({
      guideTop: { top: 64, bottom: 500, height: 436 },
      guideContent: { top: 500, bottom: 500, height: 0 },
      steps: {
        1: { top: -200, bottom: 120, height: 320 },
        2: { top: 1200, bottom: 1400, height: 200 },
      },
    });

    render(
      <SyncHarness
        overviewScrollMarginTop={64}
        scrollMarginTop={144}
        stepNumbers={[1, 2]}
      />,
    );

    await vi.advanceTimersByTimeAsync(901);
    intersectionCallback?.();

    expect(replaceState).not.toHaveBeenCalledWith(
      window.history.state,
      "",
      "https://example.com/guide#step-1",
    );

    vi.useRealTimers();
  });

  it("keeps the final step in the URL after navigating to it directly", async () => {
    vi.useFakeTimers();
    const replaceState = vi
      .spyOn(window.history, "replaceState")
      .mockImplementation(() => {});

    window.location.hash = "#step-2";
    window.location.href = "https://example.com/guide#step-2";

    mockRects({
      guideTop: { top: -500, bottom: -100, height: 400 },
      guideContent: { top: -100, bottom: -100, height: 0 },
      steps: {
        1: { top: 200, bottom: 500, height: 300 },
        2: { top: 144, bottom: 344, height: 200 },
      },
    });

    render(
      <SyncHarness
        overviewScrollMarginTop={64}
        scrollMarginTop={144}
        stepNumbers={[1, 2]}
      />,
    );

    await vi.advanceTimersByTimeAsync(901);
    intersectionCallback?.();

    expect(replaceState).not.toHaveBeenCalledWith(
      window.history.state,
      "",
      "https://example.com/guide#step-1",
    );

    vi.useRealTimers();
  });

  it("syncs the final step when the reader scrolls to the page bottom", async () => {
    vi.useFakeTimers();
    const replaceState = vi
      .spyOn(window.history, "replaceState")
      .mockImplementation(() => {});

    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 2000,
    });
    Object.defineProperty(document.body, "scrollHeight", {
      configurable: true,
      value: 2000,
    });
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 1100,
      writable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 900,
      writable: true,
    });

    mockRects({
      guideTop: { top: -800, bottom: -400, height: 400 },
      guideContent: { top: -400, bottom: -400, height: 0 },
      steps: {
        1: { top: 200, bottom: 500, height: 300 },
        2: { top: 520, bottom: 720, height: 200 },
      },
    });

    render(
      <SyncHarness
        overviewScrollMarginTop={64}
        scrollMarginTop={144}
        stepNumbers={[1, 2]}
      />,
    );

    await vi.advanceTimersByTimeAsync(901);
    intersectionCallback?.();

    expect(replaceState).toHaveBeenCalledWith(
      window.history.state,
      "",
      "https://example.com/guide#step-2",
    );

    vi.useRealTimers();
  });

  it("syncs the final step from a scroll event when the page bottom is reached", async () => {
    const replaceState = vi
      .spyOn(window.history, "replaceState")
      .mockImplementation(() => {});

    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 2000,
    });
    Object.defineProperty(document.body, "scrollHeight", {
      configurable: true,
      value: 2000,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 900,
      writable: true,
    });
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
      writable: true,
    });

    mockRects({
      guideTop: { top: -800, bottom: -400, height: 400 },
      guideContent: { top: -400, bottom: -400, height: 0 },
      steps: {
        1: { top: 200, bottom: 500, height: 300 },
        2: { top: 520, bottom: 720, height: 200 },
      },
    });

    render(
      <SyncHarness
        overviewScrollMarginTop={64}
        scrollMarginTop={144}
        stepNumbers={[1, 2]}
      />,
    );

    await waitFor(() => {
      expect(scrollTo).toHaveBeenCalled();
    });

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 950);
    });
    replaceState.mockClear();

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 1100,
      writable: true,
    });
    window.dispatchEvent(new Event("scroll"));
    await waitFor(() => {
      expect(replaceState).toHaveBeenCalledWith(
        window.history.state,
        "",
        "https://example.com/guide#step-2",
      );
    });
  });
});
