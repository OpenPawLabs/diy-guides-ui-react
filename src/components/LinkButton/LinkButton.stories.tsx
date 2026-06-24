import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LinkButton } from "./LinkButton";

const componentDocs = `A button that links to a destination or downloads a file, with an optional
dropdown of alternatives — for example, the same 3D model offered as 3MF, STL, and
STEP.

Options are declared as \`LinkButton.Item\` children; each takes an \`href\` and the
visible label as its content:

\`\`\`tsx
<LinkButton>
  <LinkButton.Item href="./files/model.3mf" download>Download 3MF</LinkButton.Item>
  <LinkButton.Item href="./files/model.stl" download>Download STL</LinkButton.Item>
</LinkButton>
\`\`\`

## One option vs. many

With a **single** item it renders one plain button. With **two or more** it becomes a
**split button**: the first item is the primary action, a thin separator follows, and a
chevron opens a menu listing the remaining options.

## Links and downloads

Each item is a real anchor. Omit \`download\` to navigate (set \`external\` to open in a new
tab); add \`download\` to download the file — pass a string to rename it. Use relative
paths (e.g. \`./files/...\`) for assets shipped alongside the guide, or absolute URLs.

## Theming

\`variant\` and \`size\` map to HeroUI button tokens (\`primary\` by default), so the button
matches the rest of your UI. Pass an \`icon\` for a leading glyph on the primary action.

## Editing affordances

\`LinkButton\` is presentational by default. Pass \`editing\` (a set of intent callbacks —
\`onAddItem\` / \`onRemoveItem\` / \`onReorderItem\` / \`onSelectItem\`) to drive it from an
authoring tool: the primary action stops navigating so its label can be edited in place,
and the chevron opens a panel for adding, removing, reordering, promoting, and editing the
links. The library performs no file or link logic — that belongs to the consumer (see the
authoring tool's link editor). Omit \`editing\` for the reader experience.`;

const meta = {
  title: "Guide/LinkButton",
  component: LinkButton,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: componentDocs } },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "tertiary",
        "outline",
        "ghost",
        "danger",
        "danger-soft",
      ],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  args: {
    variant: "primary",
    size: "md",
    children: (
      <>
        <LinkButton.Item href="./files/model.3mf" download>
          Download 3MF
        </LinkButton.Item>
        <LinkButton.Item href="./files/model.stl" download>
          Download STL
        </LinkButton.Item>
      </>
    ),
  },
} satisfies Meta<typeof LinkButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Single: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A single `LinkButton.Item` renders one button — here a download. There is no separator or chevron until a second option exists.",
      },
    },
  },
  args: { variant: "primary", size: "md" },
  render: (args) => (
    <LinkButton {...args}>
      <LinkButton.Item href="./files/model.3mf" download>
        Download 3MF
      </LinkButton.Item>
    </LinkButton>
  ),
};

export const Split: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "With multiple items the primary action sits on the left and the chevron opens the rest. Open the menu to download the other formats.",
      },
    },
  },
  args: { variant: "primary", size: "md" },
  render: (args) => (
    <LinkButton {...args}>
      <LinkButton.Item href="./files/model.3mf" download>
        Download 3MF
      </LinkButton.Item>
      <LinkButton.Item href="./files/model.stl" download>
        Download STL
      </LinkButton.Item>
      <LinkButton.Item href="./files/model.step" download>
        Download STEP
      </LinkButton.Item>
    </LinkButton>
  ),
};

export const Navigation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Without `download`, items navigate. Mark a destination `external` to open it in a new tab.",
      },
    },
  },
  args: { variant: "secondary", size: "md" },
  render: (args) => (
    <LinkButton {...args}>
      <LinkButton.Item href="https://example.com/docs" external>
        Open documentation
      </LinkButton.Item>
      <LinkButton.Item href="https://example.com/repo" external>
        View source
      </LinkButton.Item>
    </LinkButton>
  ),
};

export const EditingAffordances: Story = {
  name: "Editing affordances",
  parameters: {
    docs: {
      description: {
        story:
          "Passing `editing` turns the button into an editor: the primary label is editable in place, and the chevron opens a panel to add, remove, reorder, promote, and edit links. These callbacks are off by default, so the reader output is unchanged.",
      },
    },
  },
  args: { variant: "primary", size: "md" },
  render: function EditingStory(args) {
    const [items, setItems] = useState([
      { label: "Download 3MF", href: "./files/model.3mf" },
      { label: "Download STL", href: "./files/model.stl" },
    ]);
    const [seq, setSeq] = useState(3);

    return (
      <LinkButton
        {...args}
        editing={{
          onAddItem: () => {
            setItems((prev) => [
              ...prev,
              { label: `Download option ${seq}`, href: `./files/option-${seq}` },
            ]);
            setSeq((value) => value + 1);
          },
          onRemoveItem: (index) =>
            setItems((prev) => prev.filter((_, i) => i !== index)),
          onReorderItem: (from, to) =>
            setItems((prev) => {
              const next = [...prev];
              const [moved] = next.splice(from, 1);
              next.splice(to, 0, moved);
              return next;
            }),
          onSelectItem: (index) =>
            setItems((prev) =>
              prev.map((item, i) =>
                i === index
                  ? { ...item, label: window.prompt("Label", item.label) ?? item.label }
                  : item,
              ),
            ),
        }}
      >
        {items.map((item, index) => (
          <LinkButton.Item key={index} href={item.href} download>
            {item.label}
          </LinkButton.Item>
        ))}
      </LinkButton>
    );
  },
};
