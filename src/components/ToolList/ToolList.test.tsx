import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ToolList } from "./ToolList";

describe("ToolList", () => {
  it("renders the title and items", () => {
    render(
      <ToolList title="Tools">
        <ToolList.Item name="Spudger" price="$2.99" />
        <ToolList.Item name="iOpener" />
      </ToolList>,
    );
    expect(screen.getByText("Tools")).toBeInTheDocument();
    expect(screen.getByText("Spudger")).toBeInTheDocument();
    expect(screen.getByText("$2.99")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("links the name when href is provided", () => {
    render(
      <ToolList>
        <ToolList.Item name="Pro Tech Toolkit" href="https://example.com/kit" />
      </ToolList>,
    );
    expect(
      screen.getByRole("link", { name: "Pro Tech Toolkit" }),
    ).toHaveAttribute("href", "https://example.com/kit");
  });

  it("shows quantity as ×N", () => {
    render(
      <ToolList>
        <ToolList.Item name="Adhesive strips" quantity={2} />
      </ToolList>,
    );
    expect(screen.getByText("×2")).toBeInTheDocument();
  });
});
