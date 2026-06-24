import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MediaFigure } from "./MediaFigure";

const mockDestroy = vi.fn();
const mockLoadModelFromUrlList = vi.fn();
const mockResize = vi.fn();
const mockSetNavigationMode = vi.fn();
const mockSetUpVector = vi.fn();
const mockGetBoundingSphere = vi.fn(() => ({}));
const mockFitSphereToWindow = vi.fn();

vi.mock("online-3d-viewer", () => ({
  EmbeddedViewer: vi.fn(function EmbeddedViewer(
    _container: HTMLElement,
    parameters: { onModelLoaded?: () => void },
  ) {
    const instance = {
      LoadModelFromUrlList: mockLoadModelFromUrlList,
      Resize: mockResize,
      Destroy: mockDestroy,
      GetViewer: () => ({
        SetNavigationMode: mockSetNavigationMode,
        SetUpVector: mockSetUpVector,
        GetBoundingSphere: mockGetBoundingSphere,
        FitSphereToWindow: mockFitSphereToWindow,
      }),
    };

    queueMicrotask(() => {
      parameters.onModelLoaded?.();
    });

    return instance;
  }),
  ProjectionMode: { Orthographic: 2 },
  NavigationMode: { FreeOrbit: 2 },
  Direction: { Z: 3 },
  RGBAColor: vi.fn(function RGBAColor() {}),
  RGBColor: vi.fn(function RGBColor() {}),
}));

describe("MediaFigure", () => {
  beforeEach(() => {
    mockDestroy.mockClear();
    mockLoadModelFromUrlList.mockClear();
    mockResize.mockClear();
    mockSetNavigationMode.mockClear();
    mockSetUpVector.mockClear();
    mockGetBoundingSphere.mockClear();
    mockFitSphereToWindow.mockClear();
  });

  it("uses a fixed 4:3 frame", () => {
    const { container } = render(<MediaFigure src="/photo.jpg" />);
    expect(container.querySelector(".aspect-\\[4\\/3\\]")).toBeInTheDocument();
  });

  it("renders a labeled point annotation marker", () => {
    render(
      <MediaFigure
        src="/photo.jpg"
        annotations={[{ type: "point", x: 50, y: 50, label: 1, title: "Connector" }]}
      />,
    );
    expect(screen.getByRole("img", { name: "Connector" })).toHaveTextContent("1");
  });

  it("defaults omitted type to point", () => {
    render(
      <MediaFigure
        src="/photo.jpg"
        annotations={[{ x: 50, y: 50, label: "A", title: "Screw" }]}
      />,
    );
    expect(screen.getByRole("img", { name: "Screw" })).toHaveTextContent("A");
  });

  it("renders a circle annotation", () => {
    render(
      <MediaFigure
        src="/photo.jpg"
        annotations={[{ type: "circle", x: 40, y: 60, radius: 12, title: "Heat zone" }]}
      />,
    );
    const marker = screen.getByRole("img", { name: "Heat zone" });
    expect(marker).toHaveClass("rounded-full");
    expect(marker).toHaveStyle({ left: "40%", top: "60%", width: "24%" });
  });

  it("renders a rectangle annotation from opposite corners", () => {
    render(
      <MediaFigure
        src="/photo.jpg"
        annotations={[
          {
            type: "rectangle",
            x1: 20,
            y1: 30,
            x2: 55,
            y2: 70,
            title: "Clip area",
          },
        ]}
      />,
    );
    const marker = screen.getByRole("img", { name: "Clip area" });
    expect(marker).toHaveStyle({
      left: "20%",
      top: "30%",
      width: "35%",
      height: "40%",
    });
  });

  it("opens a full-size lightbox when an image is clicked", async () => {
    render(<MediaFigure src="/photo.jpg" />);

    const trigger = screen.getByRole("button", { name: "View image full size" });
    fireEvent.click(trigger);

    const dialog = await screen.findByRole("dialog", { name: "Full size image" });
    expect(dialog.querySelector("img")).toHaveAttribute("src", "/photo.jpg");
  });

  it("is not zoomable when zoomable is false", () => {
    render(<MediaFigure src="/photo.jpg" zoomable={false} />);
    expect(
      screen.queryByRole("button", { name: "View image full size" }),
    ).not.toBeInTheDocument();
  });

  it("does not make non-image media zoomable", () => {
    render(<MediaFigure src="/clip.mp4" type="video" />);
    expect(
      screen.queryByRole("button", { name: "View image full size" }),
    ).not.toBeInTheDocument();
  });

  it("renders a video element when type is video", () => {
    const { container } = render(
      <MediaFigure src="/clip.mp4" type="video" />,
    );
    expect(container.querySelector("video")).toBeInTheDocument();
  });

  it("renders a 3D model viewer when type is model", async () => {
    render(<MediaFigure src="/part.stl" type="model" />);

    await waitFor(() => {
      expect(mockLoadModelFromUrlList).toHaveBeenCalledWith(["/part.stl"]);
    });

    expect(
      screen.getByRole("img", { name: "Interactive 3D model" }),
    ).toBeInTheDocument();
    expect(mockSetNavigationMode).toHaveBeenCalledWith(2);
    expect(mockSetUpVector).toHaveBeenCalledWith(3, false);
    expect(mockFitSphereToWindow).toHaveBeenCalled();
  });

  describe("displayRegion", () => {
    const boundingRect = {
      width: 400,
      height: 300,
      top: 0,
      left: 0,
      right: 400,
      bottom: 300,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    };

    beforeEach(() => {
      vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue(
        boundingRect as DOMRect,
      );
      vi.stubGlobal(
        "ResizeObserver",
        class {
          private readonly callback: ResizeObserverCallback;

          constructor(callback: ResizeObserverCallback) {
            this.callback = callback;
          }

          observe() {
            this.callback([], this);
          }

          disconnect() {}
          unobserve() {}
        },
      );
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.unstubAllGlobals();
    });

    it("applies crop styles after the image loads", async () => {
      const { container } = render(
        <MediaFigure
          src="/photo.jpg"
          displayRegion={{ x: 320, y: 90, width: 640 }}
        />,
      );

      const img = container.querySelector("img");
      expect(img).not.toBeNull();
      Object.defineProperty(img!, "naturalWidth", { value: 1280, configurable: true });
      Object.defineProperty(img!, "naturalHeight", { value: 720, configurable: true });
      fireEvent.load(img!);

      await waitFor(() => {
        expect(img).toHaveStyle({
          left: "-200px",
          top: "-56.25px",
          width: "800px",
          height: "450px",
        });
      });
    });
  });
});
