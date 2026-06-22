import type { Meta, StoryObj } from "@storybook/react-vite";
import { DifficultyBadge } from "./DifficultyBadge";

const componentDocs = `A compact, color-coded pill that signals how hard a guide is, built on HeroUI
\`Chip\`. It mirrors the iFixit difficulty scale.

| Difficulty | Color | Meaning |
| --- | --- | --- |
| \`easy\` | \`GREEN\` | Minimal tools or risk; fine for first-timers |
| \`moderate\` | \`ORANGE\` | Some disassembly, care, or specific tools needed |
| \`difficult\` | \`RED\` | Significant skill, special tools, or higher risk |

\`GuideLayout.Header\` renders this automatically from its \`difficulty\` prop, so
you usually only use \`DifficultyBadge\` directly in custom layouts.

## Props

- \`difficulty\` — required; sets the color and default label.
- \`label\` — override the text (e.g. "Expert only").
- \`showIcon\` — toggle the leading gauge icon (default \`true\`).
- \`size\` — \`"sm"\`, \`"md"\` (default), or \`"lg"\`.`;

const meta = {
  title: "Guide/DifficultyBadge",
  component: DifficultyBadge,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: componentDocs } },
  },
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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the controls to switch difficulty, size, and the icon. The label follows the difficulty unless you override it.",
      },
    },
  },
};

export const AllLevels: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The three levels and their colors. Pick the level that matches the riskiest or most demanding part of the guide.",
      },
    },
  },
  render: (args) => (
    <div className="flex items-center gap-3">
      <DifficultyBadge {...args} difficulty="easy" />
      <DifficultyBadge {...args} difficulty="moderate" />
      <DifficultyBadge {...args} difficulty="difficult" />
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Three sizes for different contexts — `sm` for dense lists, `lg` for a prominent header.",
      },
    },
  },
  render: (args) => (
    <div className="flex items-center gap-3">
      <DifficultyBadge {...args} size="sm" />
      <DifficultyBadge {...args} size="md" />
      <DifficultyBadge {...args} size="lg" />
    </div>
  ),
};

export const WithoutIcon: Story = {
  parameters: {
    docs: {
      description: {
        story: "Set `showIcon={false}` for a plain text pill.",
      },
    },
  },
  args: { showIcon: false },
};

export const CustomLabel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Override the label with `label` while keeping the difficulty color — useful for phrases like “Expert only”.",
      },
    },
  },
  args: { difficulty: "difficult", label: "Expert only" },
};
