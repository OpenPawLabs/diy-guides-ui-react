import { render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useElementSize } from "./useElementSize";

function SizeProbe() {
  const { ref, size } = useElementSize<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-testid="probe"
      style={{ width: 320, height: 240 }}
      data-width={size?.width ?? 0}
      data-height={size?.height ?? 0}
    />
  );
}

describe("useElementSize", () => {
  beforeEach(() => {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      width: 320,
      height: 240,
      top: 0,
      left: 0,
      right: 320,
      bottom: 240,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("measures the element on mount", async () => {
    const { getByTestId } = render(<SizeProbe />);

    await waitFor(() => {
      expect(getByTestId("probe")).toHaveAttribute("data-width", "320");
      expect(getByTestId("probe")).toHaveAttribute("data-height", "240");
    });
  });
});
