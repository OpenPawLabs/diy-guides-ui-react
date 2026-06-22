import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToolList } from "./ToolList";

const meta = {
  title: "Guide/ToolList",
  component: ToolList,
  tags: ["autodocs"],
  args: { children: null },
} satisfies Meta<typeof ToolList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Tools: Story = {
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
