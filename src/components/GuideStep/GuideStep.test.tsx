import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { COLORS } from "../../types/colors";
import { GuideStep } from "./GuideStep";
import { MediaFigure } from "../MediaFigure";

const stepPhoto = {
  src: "https://placehold.co/800x600/png?text=Step",
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

  it("toggles completion when clicking the checkbox control inside the button", async () => {
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
    const markComplete = screen.getByRole("button", { name: /mark complete/i });
    const control = markComplete.querySelector('[data-slot="checkbox-control"]');
    expect(control).not.toBeNull();
    await user.click(control!);
    expect(onCompletedChange).toHaveBeenCalledWith(true);
    expect(markComplete).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles uncontrolled completion via the mark-complete control", async () => {
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
    const markComplete = screen.getByRole("button", { name: /mark complete/i });
    expect(markComplete).toHaveAttribute("aria-pressed", "false");
    await user.click(markComplete);
    expect(onCompletedChange).toHaveBeenCalledWith(true);
    expect(markComplete).toHaveAttribute("aria-pressed", "true");
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
    expect(screen.getByRole("button", { name: /mark complete/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
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
    expect(screen.getByRole("button", { name: /mark complete/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("hides the completion control when completable is false", () => {
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
    expect(
      screen.queryByRole("button", { name: /mark complete/i }),
    ).not.toBeInTheDocument();
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
    const { container } = render(
      <GuideStep number={1} title="Open the case">
        <GuideStep.Media>
          <MediaFigure src="https://placehold.co/800x600/png?text=Main" />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet>Pry along the seam.</GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>,
    );
    expect(container.querySelector(".aspect-\\[4\\/3\\] img")).toBeInTheDocument();
    expect(screen.getByText("Pry along the seam.")).toBeInTheDocument();
  });

  it("renders dot bullets with the selected color", () => {
    const { container } = render(
      <GuideStep.Bullets>
        <GuideStep.Bullet color="RED">Remove the red screw.</GuideStep.Bullet>
      </GuideStep.Bullets>,
    );
    const dot = container.querySelector("span[aria-hidden='true']");
    expect(dot).toHaveStyle({ backgroundColor: COLORS.RED });
    expect(screen.getByText("Remove the red screw.")).toBeInTheDocument();
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

  it("renders a button bullet as its children with no marker", () => {
    const { container } = render(
      <GuideStep.Bullets>
        <GuideStep.Bullet variant="button">
          <a href="./files/model.3mf">Download 3MF</a>
        </GuideStep.Bullet>
      </GuideStep.Bullets>,
    );
    expect(
      screen.getByRole("link", { name: "Download 3MF" }),
    ).toBeInTheDocument();
    expect(container.querySelector("span[aria-hidden='true']")).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Change bullet style" }),
    ).not.toBeInTheDocument();
  });

  it("renders a pressable marker for a button bullet when onMarkerPress is set", async () => {
    const user = userEvent.setup();
    const onMarkerPress = vi.fn();
    render(
      <GuideStep.Bullets>
        <GuideStep.Bullet variant="button" onMarkerPress={onMarkerPress}>
          <a href="./files/model.3mf">Download 3MF</a>
        </GuideStep.Bullet>
      </GuideStep.Bullets>,
    );
    await user.click(
      screen.getByRole("button", { name: "Change bullet style" }),
    );
    expect(onMarkerPress).toHaveBeenCalledTimes(1);
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
    const { container } = render(
      <GuideStep number={1} title="Gallery step">
        <GuideStep.Media>
          <MediaFigure src="https://placehold.co/800x600/png?text=Image+1" />
          <MediaFigure src="https://placehold.co/800x600/png?text=Image+2" />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet>Follow both views.</GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>,
    );

    const mainImage = container.querySelector(".aspect-\\[4\\/3\\] img");
    expect(mainImage).toHaveAttribute(
      "src",
      "https://placehold.co/800x600/png?text=Image+1",
    );

    const gallery = screen.getByRole("group", { name: "Step images" });
    const secondThumb = within(gallery).getByRole("button", {
      name: "Image 2",
    });
    await user.hover(secondThumb);

    expect(container.querySelector(".aspect-\\[4\\/3\\] img")).toHaveAttribute(
      "src",
      "https://placehold.co/800x600/png?text=Image+2",
    );
  });
});

describe("GuideStep editing affordances", () => {
  it("renders a plain marker by default and a marker button when onMarkerPress is set", async () => {
    const user = userEvent.setup();
    const onMarkerPress = vi.fn();
    const { rerender, container } = render(
      <GuideStep.Bullets>
        <GuideStep.Bullet color="RED">Edit me.</GuideStep.Bullet>
      </GuideStep.Bullets>,
    );
    expect(
      screen.queryByRole("button", { name: "Change bullet style" }),
    ).not.toBeInTheDocument();
    expect(container.querySelector("span[aria-hidden='true']")).not.toBeNull();

    rerender(
      <GuideStep.Bullets>
        <GuideStep.Bullet color="RED" onMarkerPress={onMarkerPress}>
          Edit me.
        </GuideStep.Bullet>
      </GuideStep.Bullets>,
    );
    const marker = screen.getByRole("button", { name: "Change bullet style" });
    expect(marker).toHaveStyle({ backgroundColor: COLORS.RED });
    await user.click(marker);
    expect(onMarkerPress).toHaveBeenCalledTimes(1);
  });

  it("makes the semantic bullet icon pressable when onMarkerPress is set", async () => {
    const user = userEvent.setup();
    const onMarkerPress = vi.fn();
    render(
      <GuideStep.Bullets>
        <GuideStep.Bullet variant="note" onMarkerPress={onMarkerPress}>
          Note body.
        </GuideStep.Bullet>
      </GuideStep.Bullets>,
    );
    await user.click(
      screen.getByRole("button", { name: "Change bullet style" }),
    );
    expect(onMarkerPress).toHaveBeenCalledTimes(1);
  });

  it("shows an add-image target and fires onAddImage when media is empty", async () => {
    const user = userEvent.setup();
    const onAddImage = vi.fn();
    render(
      <GuideStep
        number={1}
        title="New step"
        completable={false}
        mediaEditing={{ onAddImage }}
      >
        <GuideStep.Media />
        <GuideStep.Bullets>
          <GuideStep.Bullet>Instruction.</GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>,
    );
    await user.click(screen.getByRole("button", { name: /add image/i }));
    expect(onAddImage).toHaveBeenCalledTimes(1);
  });

  it("does not warn about missing media when mediaEditing is active", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <GuideStep
        number={1}
        title="New step"
        completable={false}
        mediaEditing={{ onAddImage: () => {} }}
      >
        <GuideStep.Media />
        <GuideStep.Bullets>
          <GuideStep.Bullet>Instruction.</GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>,
    );
    expect(warn).not.toHaveBeenCalledWith(
      "GuideStep requires at least one MediaFigure inside GuideStep.Media.",
    );
    warn.mockRestore();
  });

  it("supports select, replace, remove, and add affordances with images present", async () => {
    const user = userEvent.setup();
    const onSelectImage = vi.fn();
    const onReplaceImage = vi.fn();
    const onRemoveImage = vi.fn();
    const onAddImage = vi.fn();
    render(
      <GuideStep
        number={1}
        title="Gallery"
        completable={false}
        mediaEditing={{
          onSelectImage,
          onReplaceImage,
          onRemoveImage,
          onAddImage,
        }}
      >
        <GuideStep.Media>
          <MediaFigure src="https://placehold.co/800x600/png?text=Image+1" />
          <MediaFigure src="https://placehold.co/800x600/png?text=Image+2" />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet>Follow both views.</GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>,
    );

    const gallery = screen.getByRole("group", { name: "Step images" });
    await user.click(within(gallery).getByRole("button", { name: "Image 2" }));
    expect(onSelectImage).toHaveBeenCalledWith(1);

    await user.click(
      within(gallery).getByRole("button", { name: "Remove image 1" }),
    );
    expect(onRemoveImage).toHaveBeenCalledWith(0);

    await user.click(within(gallery).getByRole("button", { name: "Add image" }));
    expect(onAddImage).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Replace image" }));
    expect(onReplaceImage).toHaveBeenCalled();
  });

  it("reorders thumbnails via drag and drop when onReorderImage is set", () => {
    const onReorderImage = vi.fn();
    render(
      <GuideStep
        number={1}
        title="Gallery"
        completable={false}
        mediaEditing={{ onReorderImage }}
      >
        <GuideStep.Media>
          <MediaFigure src="https://placehold.co/800x600/png?text=Image+1" />
          <MediaFigure src="https://placehold.co/800x600/png?text=Image+2" />
          <MediaFigure src="https://placehold.co/800x600/png?text=Image+3" />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet>Follow each view.</GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>,
    );

    const gallery = screen.getByRole("group", { name: "Step images" });
    const first = within(gallery).getByRole("button", { name: "Image 1" })
      .parentElement!;
    const third = within(gallery).getByRole("button", { name: "Image 3" })
      .parentElement!;
    const dataTransfer = { effectAllowed: "", dropEffect: "" };

    fireEvent.dragStart(first, { dataTransfer });
    fireEvent.dragOver(third, { dataTransfer });
    fireEvent.drop(third, { dataTransfer });

    expect(onReorderImage).toHaveBeenCalledWith(0, 2);
  });

  it("does not make thumbnails draggable without onReorderImage", () => {
    render(
      <GuideStep
        number={1}
        title="Gallery"
        completable={false}
        mediaEditing={{ onSelectImage: vi.fn() }}
      >
        <GuideStep.Media>
          <MediaFigure src="https://placehold.co/800x600/png?text=Image+1" />
          <MediaFigure src="https://placehold.co/800x600/png?text=Image+2" />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet>Follow each view.</GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>,
    );

    const gallery = screen.getByRole("group", { name: "Step images" });
    const wrapper = within(gallery).getByRole("button", { name: "Image 1" })
      .parentElement!;
    expect(wrapper).not.toHaveAttribute("draggable", "true");
  });
});
