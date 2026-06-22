import type { Meta, StoryObj } from "@storybook/react-vite";
import { MediaFigure } from "./MediaFigure";

const meta = {
  title: "Guide/MediaFigure",
  component: MediaFigure,
  tags: ["autodocs"],
  args: {
    src: "https://placehold.co/800x600/e2e8f0/1e293b/png?text=Guide+photo",
    alt: "Opening the device with a plastic pry tool",
    aspectRatio: "4/3",
    caption: "Insert the pry tool into the seam along the bottom edge.",
  },
} satisfies Meta<typeof MediaFigure>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-md">
      <MediaFigure {...args} />
    </div>
  ),
};

export const WithAnnotations: Story = {
  render: (args) => (
    <div className="max-w-md">
      <MediaFigure
        {...args}
        annotations={[
          { x: 28, y: 35, severity: "note", label: 1, title: "Pry point" },
          { x: 64, y: 52, severity: "caution", label: 2, title: "Hidden clip" },
          { x: 45, y: 78, severity: "danger", label: 3, title: "Battery cable" },
        ]}
      />
    </div>
  ),
};
