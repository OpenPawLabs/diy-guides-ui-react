import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GuideStepList } from "./GuideStepList";
import { GuideStep } from "../GuideStep";

describe("GuideStepList", () => {
  it("auto-numbers steps in order", () => {
    render(
      <GuideStepList showProgress={false}>
        <GuideStep title="First" />
        <GuideStep title="Second" />
        <GuideStep title="Third" />
      </GuideStepList>,
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("seeds progress from defaultCompleted steps", () => {
    render(
      <GuideStepList>
        <GuideStep title="Done" defaultCompleted />
        <GuideStep title="Todo" />
      </GuideStepList>,
    );
    expect(screen.getByText("1 / 2 steps")).toBeInTheDocument();
  });

  it("updates derived progress when a step is completed", async () => {
    const user = userEvent.setup();
    const onProgressChange = vi.fn();
    render(
      <GuideStepList onProgressChange={onProgressChange}>
        <GuideStep title="First" />
        <GuideStep title="Second" />
      </GuideStepList>,
    );
    expect(screen.getByText("0 / 2 steps")).toBeInTheDocument();

    const [firstCheckbox] = screen.getAllByRole("checkbox");
    await user.click(firstCheckbox);

    expect(screen.getByText("1 / 2 steps")).toBeInTheDocument();
    expect(onProgressChange).toHaveBeenLastCalledWith({ completed: 1, total: 2 });
  });
});
