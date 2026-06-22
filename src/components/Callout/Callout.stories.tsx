import type { Meta, StoryObj } from "@storybook/react-vite";
import { Callout } from "./Callout";

const componentDocs = `A callout box for safety information and important context in a guide —
battery hazards, high voltage, heat, ESD, fragile parts, or a helpful reminder.

A single \`type\` prop drives everything: the color, the default icon, and the
default title. Callout types are separate from the guide color palette used to
link step bullets to image markers. (See **Getting Started → Colors & callouts**.)

## Choosing a type

| Type | Use it for |
| --- | --- |
| \`note\` | Neutral detail worth calling out |
| \`info\` | Context that changes how a step is understood; reversible actions |
| \`tip\` | A shortcut, reassembly hint, or optional improvement |
| \`caution\` | A moderate hazard: adhesive, sharp edges, fragile clips |
| \`danger\` | A serious hazard: fire, shock, chemicals, or injury |

## Customizing

- \`title\` — override the auto-generated title, or pass \`null\` to hide it and
  show only the body.
- \`icon\` — replace the default type glyph with your own node.`;

const meta = {
  title: "Guide/Callout",
  component: Callout,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: componentDocs } },
  },
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["note", "info", "tip", "caution", "danger"],
    },
  },
  args: {
    type: "caution",
    children:
      "Disconnect the battery before removing any internal components to avoid a short circuit.",
  },
} satisfies Meta<typeof Callout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Change the `type` control to see how the color, icon, and default title update together. With no `title`, the type's label is used.",
      },
    },
  },
};

export const AllTypes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The five types side by side. Use the lighter tones for guidance and reserve `danger` for genuine hazards so it keeps its weight.",
      },
    },
  },
  render: () => (
    <div className="flex max-w-xl flex-col gap-3">
      <Callout type="note">
        Keep screws organized — they are not all the same length.
      </Callout>
      <Callout type="info">
        This step is reversible; you can stop here and reassemble.
      </Callout>
      <Callout type="tip">
        A guitar pick works well to release the clips without scratching.
      </Callout>
      <Callout type="caution">
        The adhesive is strong. Apply gentle, even heat before prying.
      </Callout>
      <Callout type="danger" title="Fire risk">
        Do not puncture the battery. A damaged cell can ignite.
      </Callout>
    </div>
  ),
};

export const CustomTitle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass `title` to replace the default type label with something specific to the hazard.",
      },
    },
  },
  args: {
    type: "danger",
    title: "High voltage",
    children:
      "The capacitor can hold a lethal charge. Do not touch the board until it is fully discharged.",
  },
};

export const TitleHidden: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass `title={null}` for a compact, single-line callout that shows only the body text.",
      },
    },
  },
  args: {
    type: "info",
    title: null,
    children: "You can pause here and come back later — nothing is time-sensitive.",
  },
};
