import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WarningCallout } from "./WarningCallout";

describe("WarningCallout", () => {
  it("renders body content and a default title from the severity", () => {
    render(<WarningCallout severity="danger">Lethal charge</WarningCallout>);
    expect(screen.getByText("Danger")).toBeInTheDocument();
    expect(screen.getByText("Lethal charge")).toBeInTheDocument();
  });

  it("uses a custom title when provided", () => {
    render(
      <WarningCallout severity="caution" title="Hot surface">
        Let it cool
      </WarningCallout>,
    );
    expect(screen.getByText("Hot surface")).toBeInTheDocument();
    expect(screen.queryByText("Caution")).not.toBeInTheDocument();
  });

  it("omits the title when explicitly set to null", () => {
    render(
      <WarningCallout severity="note" title={null}>
        No heading here
      </WarningCallout>,
    );
    expect(screen.queryByText("Note")).not.toBeInTheDocument();
    expect(screen.getByText("No heading here")).toBeInTheDocument();
  });
});
