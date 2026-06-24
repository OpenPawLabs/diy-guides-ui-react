import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { LinkButton } from "./LinkButton";

beforeAll(() => {
  // RAC's popover positioning needs ResizeObserver, which jsdom lacks.
  if (!("ResizeObserver" in globalThis)) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }
});

describe("LinkButton (reader)", () => {
  it("renders a single link when there is one item", () => {
    render(
      <LinkButton>
        <LinkButton.Item href="./files/model.3mf" download>
          Download 3MF
        </LinkButton.Item>
      </LinkButton>,
    );
    const link = screen.getByRole("link", { name: "Download 3MF" });
    expect(link).toHaveAttribute("href", "./files/model.3mf");
    expect(link).toHaveAttribute("download");
    expect(
      screen.queryByRole("button", { name: /more download options/i }),
    ).not.toBeInTheDocument();
  });

  it("renders the first item as the primary action with a menu trigger for the rest", () => {
    render(
      <LinkButton>
        <LinkButton.Item href="/a.3mf" download>
          Download 3MF
        </LinkButton.Item>
        <LinkButton.Item href="/b.stl" download>
          Download STL
        </LinkButton.Item>
      </LinkButton>,
    );
    expect(screen.getByRole("link", { name: "Download 3MF" })).toHaveAttribute(
      "href",
      "/a.3mf",
    );
    expect(
      screen.getByRole("button", { name: /more download options/i }),
    ).toBeInTheDocument();
    // The secondary option lives behind the closed menu.
    expect(
      screen.queryByRole("link", { name: "Download STL" }),
    ).not.toBeInTheDocument();
  });

  it("reveals all options when the menu opens", async () => {
    const user = userEvent.setup();
    render(
      <LinkButton menuLabel="Other formats">
        <LinkButton.Item href="/a.3mf">Download 3MF</LinkButton.Item>
        <LinkButton.Item href="/b.stl">Download STL</LinkButton.Item>
        <LinkButton.Item href="https://example.com" external>
          View online
        </LinkButton.Item>
      </LinkButton>,
    );
    await user.click(screen.getByRole("button", { name: "Other formats" }));
    expect(
      await screen.findByRole("menuitem", { name: "Download 3MF" }),
    ).toHaveAttribute("href", "/a.3mf");
    expect(screen.getByRole("menuitem", { name: "Download STL" })).toHaveAttribute(
      "href",
      "/b.stl",
    );
    const external = screen.getByRole("menuitem", { name: "View online" });
    expect(external).toHaveAttribute("target", "_blank");
    expect(external).toHaveAttribute("rel", expect.stringContaining("noreferrer"));
  });

  it("warns and renders nothing without items", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { container } = render(<LinkButton>{null}</LinkButton>);
    expect(container).toBeEmptyDOMElement();
    expect(warn).toHaveBeenCalledWith(
      "LinkButton requires at least one LinkButton.Item.",
    );
    warn.mockRestore();
  });
});

describe("LinkButton (editing)", () => {
  it("does not navigate and exposes a primary link editor", async () => {
    const user = userEvent.setup();
    const onSelectItem = vi.fn();
    render(
      <LinkButton editing={{ onSelectItem }}>
        <LinkButton.Item href="/a.3mf" download>
          Download 3MF
        </LinkButton.Item>
        <LinkButton.Item href="/b.stl" download>
          Download STL
        </LinkButton.Item>
      </LinkButton>,
    );
    // Editing mode is presentational-only: no real anchors.
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Download 3MF")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Edit primary link" }));
    expect(onSelectItem).toHaveBeenCalledWith(0);
  });

  it("manages the secondary options through the panel", async () => {
    const user = userEvent.setup();
    const onAddItem = vi.fn();
    const onRemoveItem = vi.fn();
    const onReorderItem = vi.fn();
    const onSelectItem = vi.fn();
    render(
      <LinkButton
        editing={{ onAddItem, onRemoveItem, onReorderItem, onSelectItem }}
      >
        <LinkButton.Item href="/a.3mf">Download 3MF</LinkButton.Item>
        <LinkButton.Item href="/b.stl">Download STL</LinkButton.Item>
      </LinkButton>,
    );

    await user.click(
      screen.getByRole("button", { name: /more download options/i }),
    );
    expect(screen.getByText("Download STL")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Make default download" }));
    expect(onReorderItem).toHaveBeenCalledWith(1, 0);

    await user.click(screen.getByRole("button", { name: "Edit link" }));
    expect(onSelectItem).toHaveBeenCalledWith(1);

    await user.click(screen.getByRole("button", { name: "Remove option" }));
    expect(onRemoveItem).toHaveBeenCalledWith(1);

    await user.click(screen.getByRole("button", { name: "+ Add option" }));
    expect(onAddItem).toHaveBeenCalledTimes(1);
  });
});
