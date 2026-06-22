import type { Meta, StoryObj } from "@storybook/react-vite";
import { WarningCallout } from "./WarningCallout";

const meta = {
  title: "Guide/WarningCallout",
  component: WarningCallout,
  tags: ["autodocs"],
  argTypes: {
    severity: {
      control: "inline-radio",
      options: ["note", "info", "tip", "caution", "danger"],
    },
  },
  args: {
    severity: "caution",
    children:
      "Disconnect the battery before removing any internal components to avoid a short circuit.",
  },
} satisfies Meta<typeof WarningCallout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Danger: Story = {
  args: {
    severity: "danger",
    title: "High voltage",
    children:
      "The capacitor can hold a lethal charge. Do not touch the board until it is fully discharged.",
  },
};

export const AllSeverities: Story = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-3">
      <WarningCallout severity="note">
        Keep screws organized — they are not all the same length.
      </WarningCallout>
      <WarningCallout severity="info">
        This step is reversible; you can stop here and reassemble.
      </WarningCallout>
      <WarningCallout severity="tip">
        A guitar pick works well to release the clips without scratching.
      </WarningCallout>
      <WarningCallout severity="caution">
        The adhesive is strong. Apply gentle, even heat before prying.
      </WarningCallout>
      <WarningCallout severity="danger" title="Fire risk">
        Do not puncture the battery. A damaged cell can ignite.
      </WarningCallout>
    </div>
  ),
};
