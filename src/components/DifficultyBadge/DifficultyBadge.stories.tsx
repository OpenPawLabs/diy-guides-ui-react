import type { Meta, StoryObj } from "@storybook/react-vite";
import { DifficultyBadge } from "./DifficultyBadge";

const meta = {
  title: "Guide/DifficultyBadge",
  component: DifficultyBadge,
  tags: ["autodocs"],
  argTypes: {
    difficulty: {
      control: "inline-radio",
      options: ["easy", "moderate", "difficult"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  args: {
    difficulty: "moderate",
    showIcon: true,
    size: "md",
  },
} satisfies Meta<typeof DifficultyBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllLevels: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <DifficultyBadge {...args} difficulty="easy" />
      <DifficultyBadge {...args} difficulty="moderate" />
      <DifficultyBadge {...args} difficulty="difficult" />
    </div>
  ),
};

export const WithoutIcon: Story = {
  args: { showIcon: false },
};

export const CustomLabel: Story = {
  args: { difficulty: "difficult", label: "Expert only" },
};
