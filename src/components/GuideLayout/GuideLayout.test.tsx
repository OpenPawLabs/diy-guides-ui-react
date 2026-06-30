import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { computeGuideOverviewScrollMarginTop } from "../../context/guideScrollMargin";
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

  it("renders a hero image with alt text when heroImage is provided", () => {
    render(
      <GuideLayout>
        <GuideLayout.Header
          title="Tracker Assembly"
          heroImage="https://example.com/hero.jpg"
          heroImageAlt="Assembled trackers on a dock"
          difficulty="moderate"
          timeEstimate="45 minutes"
        />
      </GuideLayout>,
    );
    const image = screen.getByRole("img", { name: "Assembled trackers on a dock" });
    expect(image).toHaveAttribute("src", "https://example.com/hero.jpg");
    expect(
      screen.getByRole("heading", { level: 1, name: "Tracker Assembly" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Moderate")).toBeInTheDocument();
    expect(screen.getByText("45 minutes")).toBeInTheDocument();
  });

  it("does not render a hero image when heroImage is omitted", () => {
    render(
      <GuideLayout>
        <GuideLayout.Header title="No Hero Guide" difficulty="easy" />
      </GuideLayout>,
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "No Hero Guide" }),
    ).toBeInTheDocument();
  });

  it("applies overview scroll margin for fixed site chrome", () => {
    const { container } = render(
      <GuideLayout scrollMarginTop={64}>
        <GuideLayout.Header title="Offset Guide" />
      </GuideLayout>,
    );

    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveStyle({
      scrollMarginTop: `${computeGuideOverviewScrollMarginTop({ parentScrollMarginTop: 64 })}px`,
    });
  });
});
