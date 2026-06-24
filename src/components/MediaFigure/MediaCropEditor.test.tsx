import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MediaCropEditor } from "./MediaCropEditor";

/** Display box of the full image: 400×450 for an 800×900 source (uniform 2× scale). */
const rootRect = {
  width: 400,
  height: 450,
  top: 0,
  left: 0,
  right: 400,
  bottom: 450,
  x: 0,
  y: 0,
  toJSON: () => ({}),
} as DOMRect;

/** jsdom's PointerEvent drops coordinates; dispatch a MouseEvent under the pointer name. */
function firePointer(
  type: "pointerdown" | "pointermove" | "pointerup",
  target: Element,
  clientX = 0,
  clientY = 0,
) {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX, clientY });
  Object.defineProperty(event, "pointerId", { value: 1, configurable: true });
  fireEvent(target, event);
}

function loadSource(container: HTMLElement, width = 800, height = 900) {
  const img = container.querySelector("img")!;
  Object.defineProperty(img, "naturalWidth", { value: width, configurable: true });
  Object.defineProperty(img, "naturalHeight", { value: height, configurable: true });
  fireEvent.load(img);
}

describe("MediaCropEditor", () => {
  beforeEach(() => {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue(rootRect);
    Element.prototype.setPointerCapture = vi.fn();
    Element.prototype.releasePointerCapture = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function editor() {
    return screen.getByRole("application", { name: "Crop editor" });
  }

  it("shows the centered selection once the source loads", () => {
    const { container } = render(
      <MediaCropEditor src="/photo.jpg" onChange={vi.fn()} />,
    );
    expect(container.querySelector(".crop-region")).toBeNull();

    loadSource(container);
    expect(container.querySelector(".crop-region")).not.toBeNull();
  });

  it("resizes from a corner handle, locked to 4:3 in source pixels", () => {
    const onChange = vi.fn();
    const { container } = render(
      <MediaCropEditor src="/photo.jpg" onChange={onChange} />,
    );
    loadSource(container);

    const seHandle = container.querySelectorAll(".crop-handle")[3];
    firePointer("pointerdown", seHandle, 400, 375);
    firePointer("pointermove", editor(), 200, 375);
    firePointer("pointerup", editor());

    expect(onChange).toHaveBeenCalledWith({ x: 0, y: 150, width: 400 });
  });

  it("moves the selection by dragging its body, clamped to the source", () => {
    const onChange = vi.fn();
    const { container } = render(
      <MediaCropEditor src="/photo.jpg" onChange={onChange} />,
    );
    loadSource(container);

    const box = container.querySelector(".crop-region")!;
    firePointer("pointerdown", box, 100, 100);
    firePointer("pointermove", editor(), 100, 160);
    firePointer("pointerup", editor());

    expect(onChange).toHaveBeenCalledWith({ x: 0, y: 270, width: 800 });
  });

  it("clamps an out-of-bounds incoming region into view", () => {
    const { container } = render(
      <MediaCropEditor
        src="/photo.jpg"
        region={{ x: 9999, y: 9999, width: 99999 }}
        onChange={vi.fn()}
      />,
    );
    loadSource(container);

    const box = container.querySelector(".crop-region") as HTMLElement;
    // 800-wide source clamps to the full width; height 600 sits at the bottom.
    expect(box.style.width).toBe("100%");
    expect(box.style.top).toBe(`${(300 / 900) * 100}%`);
  });
});
