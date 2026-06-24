import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { COLORS } from "../../types/colors";
import { MediaFigureThumbnail } from "./MediaFigureThumbnail";

describe("MediaFigureThumbnail", () => {
  it("renders the source as an image by default", () => {
    const { container } = render(<MediaFigureThumbnail src="/photo.jpg" />);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "/photo.jpg");
    expect(container.textContent).toBe("");
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
    const image = render(<MediaFigureThumbnail src="/a.jpg" className="size-16" />);
    expect(image.container.querySelector("img")).toHaveClass("size-16");

    const model = render(
      <MediaFigureThumbnail src="/a.stl" type="model" className="size-16" />,
    );
    expect(model.container.firstChild).toHaveClass("size-16");
  });
});
