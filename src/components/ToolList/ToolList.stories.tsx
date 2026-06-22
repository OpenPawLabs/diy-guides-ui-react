import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToolList } from "./ToolList";

const componentDocs = `The "what you need" panel for a guide — a titled card listing the tools and
parts a reader should gather before starting. Compose rows with
\`ToolList.Item\`.

A guide commonly shows two lists: one titled "Tools" and one titled "Parts".
Drop them into \`GuideLayout.Sidebar\` so they sit beside the intro on desktop and
stack on mobile.

## \`ToolList\`

- \`title\` — the section heading; defaults to "What you need". Pass \`null\` to omit it.

## \`ToolList.Item\`

| Prop | Purpose |
| --- | --- |
| \`name\` | Tool or part name (required) |
| \`thumbnail\` | Small image URL shown at the start of the row |
| \`href\` | Turns the name into a link (store page, info page) |
| \`quantity\` | Rendered as ×N on the right |
| \`price\` | Trailing price or cost note |
| \`children\` | A secondary detail line beneath the name |`;

const meta = {
  title: "Guide/ToolList",
  component: ToolList,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: componentDocs } },
  },
  args: { children: null },
} satisfies Meta<typeof ToolList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Tools: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A tools list with a mix of rows: a thumbnail and link, a linked row, and a plain row. Only `name` is required — every other field is optional.",
      },
    },
  },
  render: () => (
    <div className="max-w-sm">
      <ToolList title="Tools">
        <ToolList.Item
          name="Pro Tech Toolkit"
          thumbnail="https://placehold.co/96x96/e2e8f0/1e293b/png?text=Kit"
          href="#"
          price="$67.96"
        />
        <ToolList.Item name="Spudger" href="#" price="$2.99" />
        <ToolList.Item name="iOpener" price="$14.99" />
      </ToolList>
    </div>
  ),
};

export const Parts: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A parts list using `quantity` for counts and the row's children for a secondary detail line (here, a compatibility note).",
      },
    },
  },
  render: () => (
    <div className="max-w-sm">
      <ToolList title="Parts">
        <ToolList.Item name="Replacement battery" quantity={1} price="$29.99">
          Compatible with model A2342
        </ToolList.Item>
        <ToolList.Item name="Adhesive strips" quantity={2} price="$6.99" />
      </ToolList>
    </div>
  ),
};

export const WithoutTitle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass `title={null}` to drop the heading when the surrounding layout already provides context.",
      },
    },
  },
  render: () => (
    <div className="max-w-sm">
      <ToolList title={null}>
        <ToolList.Item name="Phillips #00 screwdriver" />
        <ToolList.Item name="Plastic opening picks" quantity={6} />
        <ToolList.Item name="Tweezers" />
      </ToolList>
    </div>
  ),
};
