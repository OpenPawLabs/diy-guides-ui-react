import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Callout } from "./Callout";

describe("Callout", () => {
  it("renders body content and a default title from the type", () => {
    render(<Callout type="danger">Lethal charge</Callout>);
    expect(screen.getByText("Danger")).toBeInTheDocument();
    expect(screen.getByText("Lethal charge")).toBeInTheDocument();
  });

  it("uses a custom title when provided", () => {
    render(
      <Callout type="caution" title="Hot surface">
        Let it cool
      </Callout>,
    );
    expect(screen.getByText("Hot surface")).toBeInTheDocument();
    expect(screen.queryByText("Caution")).not.toBeInTheDocument();
  });

  it("omits the title when explicitly set to null", () => {
    render(
      <Callout type="note" title={null}>
        No heading here
      </Callout>,
    );
    expect(screen.queryByText("Note")).not.toBeInTheDocument();
    expect(screen.getByText("No heading here")).toBeInTheDocument();
  });
});
