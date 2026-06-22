import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GuideLayout } from "./GuideLayout";

describe("GuideLayout", () => {
  it("renders the header with title, difficulty, and time estimate", () => {
    render(
      <GuideLayout>
        <GuideLayout.Header
          title="Replace a Battery"
          difficulty="moderate"
          timeEstimate="30 minutes"
        />
        <GuideLayout.Intro>An overview of the task.</GuideLayout.Intro>
      </GuideLayout>,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Replace a Battery" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Moderate")).toBeInTheDocument();
    expect(screen.getByText("30 minutes")).toBeInTheDocument();
    expect(screen.getByText("An overview of the task.")).toBeInTheDocument();
  });

  it("places content in main and sidebar in a complementary region", () => {
    render(
      <GuideLayout>
        <GuideLayout.Intro>Guide overview</GuideLayout.Intro>
        <GuideLayout.Sidebar>Tools go here</GuideLayout.Sidebar>
        <GuideLayout.Content>Steps go here</GuideLayout.Content>
      </GuideLayout>,
    );
    expect(screen.getByRole("main")).toHaveTextContent("Steps go here");
    expect(screen.getByRole("complementary")).toHaveTextContent("Tools go here");
    expect(screen.getByText("Guide overview")).toBeInTheDocument();
  });
});
