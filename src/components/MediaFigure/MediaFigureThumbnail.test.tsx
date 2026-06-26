import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { COLORS } from "../../types/colors";
import { MediaFigureThumbnail } from "./MediaFigureThumbnail";

describe("MediaFigureThumbnail", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the source as an image by default", () => {
    const { container } = render(<MediaFigureThumbnail src="/photo.jpg" />);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "/photo.jpg");
    expect(container.textContent).toBe("");
  });

  it("renders annotations in a clip frame for image thumbnails", () => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
        unobserve() {}
      },
    );

    render(
      <MediaFigureThumbnail
        src="/photo.jpg"
        className="w-16"
        displayRegion={{ x: 10, y: 20, width: 400 }}
        annotations={[{ type: "point", x: 50, y: 50, label: 2, title: "Pin" }]}
      />,
    );
    expect(screen.getByRole("img", { name: "Pin" })).toHaveTextContent("2");
    expect(screen.getByRole("img", { name: "Pin" })).toHaveClass(
      "media-figure-point-marker",
    );
    expect(screen.getByRole("img", { name: "Pin" }).parentElement).toHaveClass(
      "@container",
    );
  });

  it("renders a '3D' placeholder for models instead of a broken image", () => {
    const { container } = render(
      <MediaFigureThumbnail src="/part.stl" type="model" />,
    );
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toBe("3D");
    expect(container.firstChild).toHaveStyle({ backgroundColor: COLORS.BLUE });
  });

  it("renders a play-icon placeholder for videos in a distinct color", () => {
    const { container } = render(
      <MediaFigureThumbnail src="/clip.mp4" type="video" />,
    );
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.firstChild).toHaveStyle({ backgroundColor: COLORS.MAGENTA });
  });

  it("forwards className to both image and placeholder", () => {
    const image = render(
      <MediaFigureThumbnail src="/a.jpg" className="w-16" />,
    );
    expect(image.container.firstChild).toHaveClass("w-16");

    const model = render(
      <MediaFigureThumbnail src="/a.stl" type="model" className="w-16" />,
    );
    expect(model.container.firstChild).toHaveClass("w-16");
  });
});
