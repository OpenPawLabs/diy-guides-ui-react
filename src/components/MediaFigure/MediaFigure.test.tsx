import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MediaFigure } from "./MediaFigure";

describe("MediaFigure", () => {
  it("renders an image with its alt text and caption", () => {
    render(
      <MediaFigure src="/photo.jpg" alt="Removing the screw" caption="Step photo" />,
    );
    expect(screen.getByRole("img", { name: "Removing the screw" })).toBeInTheDocument();
    expect(screen.getByText("Step photo")).toBeInTheDocument();
  });

  it("renders a labeled annotation marker", () => {
    render(
      <MediaFigure
        src="/photo.jpg"
        alt="Board overview"
        annotations={[{ x: 50, y: 50, label: 1, title: "Connector" }]}
      />,
    );
    expect(screen.getByRole("img", { name: "Connector" })).toHaveTextContent("1");
  });

  it("renders a video element when type is video", () => {
    const { container } = render(
      <MediaFigure src="/clip.mp4" alt="Reassembly clip" type="video" />,
    );
    expect(container.querySelector("video")).toBeInTheDocument();
  });
});
