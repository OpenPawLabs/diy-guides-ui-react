import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { COLORS, hexToRgba } from "../../types/colors";
import { DifficultyBadge } from "./DifficultyBadge";

describe("DifficultyBadge", () => {
  it("renders the default label for the level", () => {
    render(<DifficultyBadge difficulty="moderate" />);
    expect(screen.getByText("Moderate")).toBeInTheDocument();
  });

  it("renders a custom label when provided", () => {
    render(<DifficultyBadge difficulty="difficult" label="Expert only" />);
    expect(screen.getByText("Expert only")).toBeInTheDocument();
    expect(screen.queryByText("Difficult")).not.toBeInTheDocument();
  });

  it("hides the icon when showIcon is false", () => {
    const { container } = render(
      <DifficultyBadge difficulty="easy" showIcon={false} />,
    );
    expect(container.querySelector("svg")).toBeNull();
  });

  it("applies the guide palette accent for the level", () => {
    const { container } = render(<DifficultyBadge difficulty="difficult" />);
    const chip = container.firstElementChild as HTMLElement;
    expect(chip).toHaveStyle({
      color: COLORS.RED,
      backgroundColor: hexToRgba(COLORS.RED, 0.15),
    });
  });
});
