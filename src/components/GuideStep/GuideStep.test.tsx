import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GuideStep } from "./GuideStep";
import { MediaFigure } from "../MediaFigure";

const stepPhoto = {
  src: "https://placehold.co/800x600/png?text=Step",
  alt: "Step photo",
} as const;

describe("GuideStep", () => {
  it("renders the number badge, title, and bullets", () => {
    render(
      <GuideStep number={2} title="Remove the screws">
        <GuideStep.Media>
          <MediaFigure {...stepPhoto} />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet>Undo the four corner screws.</GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>,
    );
    expect(
      screen.getByRole("heading", { name: "Remove the screws" }),
    ).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Undo the four corner screws.")).toBeInTheDocument();
  });

  it("toggles uncontrolled completion via the checkbox", async () => {
    const user = userEvent.setup();
    const onCompletedChange = vi.fn();
    render(
      <GuideStep number={1} title="Step" onCompletedChange={onCompletedChange}>
        <GuideStep.Media>
          <MediaFigure {...stepPhoto} />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet>Instruction.</GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>,
    );
    const checkbox = screen.getByRole("checkbox", { name: /mark complete/i });
    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(onCompletedChange).toHaveBeenCalledWith(true);
    expect(checkbox).toBeChecked();
  });

  it("respects controlled completion state", () => {
    const { rerender } = render(
      <GuideStep number={1} title="Step" isCompleted={false}>
        <GuideStep.Media>
          <MediaFigure {...stepPhoto} />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet>Instruction.</GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>,
    );
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    rerender(
      <GuideStep number={1} title="Step" isCompleted>
        <GuideStep.Media>
          <MediaFigure {...stepPhoto} />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet>Instruction.</GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>,
    );
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("hides the completion checkbox when completable is false", () => {
    render(
      <GuideStep number={1} title="Step" completable={false}>
        <GuideStep.Media>
          <MediaFigure {...stepPhoto} />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet>Instruction.</GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>,
    );
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("warns in development when media or bullets are missing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <GuideStep number={1} title="Incomplete step">
        <GuideStep.Bullets>
          <GuideStep.Bullet>Only bullets.</GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>,
    );
    expect(warn).toHaveBeenCalledWith(
      "GuideStep requires at least one MediaFigure inside GuideStep.Media.",
    );
    warn.mockClear();
    render(
      <GuideStep number={1} title="Incomplete step">
        <GuideStep.Media>
          <MediaFigure {...stepPhoto} />
        </GuideStep.Media>
      </GuideStep>,
    );
    expect(warn).toHaveBeenCalledWith(
      "GuideStep requires at least one GuideStep.Bullet inside GuideStep.Bullets.",
    );
    warn.mockRestore();
  });

  it("renders a two-column body with main image and bullets", () => {
    render(
      <GuideStep number={1} title="Open the case">
        <GuideStep.Media>
          <MediaFigure
            src="https://placehold.co/800x600/png?text=Main"
            alt="Main step photo"
          />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet>Pry along the seam.</GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>,
    );
    expect(screen.getByRole("img", { name: "Main step photo" })).toBeInTheDocument();
    expect(screen.getByText("Pry along the seam.")).toBeInTheDocument();
  });

  it("renders semantic caution bullets with a label", () => {
    render(
      <GuideStep.Bullets>
        <GuideStep.Bullet variant="caution">
          Disconnect power before servicing.
        </GuideStep.Bullet>
      </GuideStep.Bullets>,
    );
    expect(screen.getByText(/Caution:/)).toBeInTheDocument();
    expect(
      screen.getByText("Disconnect power before servicing."),
    ).toBeInTheDocument();
  });

  it("renders reminder and note bullet variants", () => {
    render(
      <GuideStep.Bullets>
        <GuideStep.Bullet variant="reminder">
          Reconnect the display cable.
        </GuideStep.Bullet>
        <GuideStep.Bullet variant="note">
          Adhesive strips are single-use.
        </GuideStep.Bullet>
      </GuideStep.Bullets>,
    );
    expect(screen.getByText(/Reminder:/)).toBeInTheDocument();
    expect(screen.getByText(/Note:/)).toBeInTheDocument();
  });

  it("switches the main image when hovering a thumbnail", async () => {
    const user = userEvent.setup();
    render(
      <GuideStep number={1} title="Gallery step">
        <GuideStep.Media>
          <MediaFigure
            src="https://placehold.co/800x600/png?text=Image+1"
            alt="First angle"
          />
          <MediaFigure
            src="https://placehold.co/800x600/png?text=Image+2"
            alt="Second angle"
          />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet>Follow both views.</GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>,
    );

    const mainImage = screen.getByRole("img", { name: "First angle" });
    expect(mainImage).toHaveAttribute(
      "src",
      "https://placehold.co/800x600/png?text=Image+1",
    );

    const gallery = screen.getByRole("group", { name: "Step images" });
    const secondThumb = within(gallery).getByRole("button", {
      name: "Second angle",
    });
    await user.hover(secondThumb);

    expect(screen.getByRole("img", { name: "Second angle" })).toHaveAttribute(
      "src",
      "https://placehold.co/800x600/png?text=Image+2",
    );
  });
});
