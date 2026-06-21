import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@heroui/react";

const meta = {
  title: "Foundation/Welcome",
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const GettingStarted: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold">DIY Guides UI</h1>
      <p className="text-default-500">
        Open-source React components for iFixit-style step-by-step DIY
        guides. HeroUI, Storybook, and Vite are configured — add components
        under <code>src/components/</code>.
      </p>
      <Button variant="primary" onPress={() => undefined}>
        Ready to build
      </Button>
    </div>
  ),
};
