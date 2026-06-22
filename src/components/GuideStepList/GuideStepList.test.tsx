import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GuideStepList } from "./GuideStepList";
import { GuideStep, type GuideStepProps } from "../GuideStep";
import { MediaFigure } from "../MediaFigure";

function Step({ title, ...props }: GuideStepProps) {
  return (
    <GuideStep title={title} {...props}>
      <GuideStep.Media>
        <MediaFigure
          src="https://placehold.co/800x600/png?text=Step"
        />
      </GuideStep.Media>
      <GuideStep.Bullets>
        <GuideStep.Bullet>Instruction for {title}.</GuideStep.Bullet>
      </GuideStep.Bullets>
    </GuideStep>
  );
}

describe("GuideStepList", () => {
  it("auto-numbers steps in order", () => {
    render(
      <GuideStepList showProgress={false}>
        <Step title="First" />
        <Step title="Second" />
        <Step title="Third" />
      </GuideStepList>,
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders a separator between steps", () => {
    render(
      <GuideStepList showProgress={false}>
        <Step title="First" />
        <Step title="Second" />
        <Step title="Third" />
      </GuideStepList>,
    );
    expect(screen.getAllByRole("separator")).toHaveLength(2);
  });

  it("seeds progress from defaultCompleted steps", () => {
    render(
      <GuideStepList>
        <Step title="Done" defaultCompleted />
        <Step title="Todo" />
      </GuideStepList>,
    );
    expect(screen.getByText("1 / 2 steps")).toBeInTheDocument();
  });

  it("updates derived progress when a step is completed", async () => {
    const user = userEvent.setup();
    const onProgressChange = vi.fn();
    render(
      <GuideStepList onProgressChange={onProgressChange}>
        <Step title="First" />
        <Step title="Second" />
      </GuideStepList>,
    );
    expect(screen.getByText("0 / 2 steps")).toBeInTheDocument();

    const [firstMarkComplete] = screen.getAllByRole("button", {
      name: /mark complete/i,
    });
    await user.click(firstMarkComplete);

    expect(screen.getByText("1 / 2 steps")).toBeInTheDocument();
    expect(onProgressChange).toHaveBeenLastCalledWith({ completed: 1, total: 2 });
  });
});
