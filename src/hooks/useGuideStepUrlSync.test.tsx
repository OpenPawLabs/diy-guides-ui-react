import { render, waitFor } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useGuideStepUrlSync } from "./useGuideStepUrlSync";

function SyncHarness({
  stepNumbers,
  enabled = true,
}: {
  stepNumbers: number[];
  enabled?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGuideStepUrlSync({
    enabled,
    rootRef,
    stepNumbers,
  });

  return (
    <div ref={rootRef} data-testid="guide-root">
      {stepNumbers.map((step) => (
        <section key={step} id={`step-${step}`}>
          Step {step}
        </section>
      ))}
    </div>
  );
}

describe("useGuideStepUrlSync", () => {
  const scrollIntoView = vi.fn();

  beforeEach(() => {
    scrollIntoView.mockReset();
    Element.prototype.scrollIntoView = scrollIntoView;

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

  it("smooth-scrolls to the guide top when no step is in the URL", async () => {
    render(<SyncHarness stepNumbers={[1, 2]} />);

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "start",
      });
    });
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
  });

  it("does nothing when disabled", async () => {
    window.location.hash = "#step-2";

    render(<SyncHarness stepNumbers={[1, 2]} enabled={false} />);

    await waitFor(() => {
      expect(scrollIntoView).not.toHaveBeenCalled();
    });
  });
});
