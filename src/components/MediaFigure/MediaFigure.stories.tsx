import type { Meta, StoryObj } from "@storybook/react-vite";
import { MediaFigure } from "./MediaFigure";

const componentDocs = `An instructional image or video with an optional caption and overlaid
annotations. \`MediaFigure\` is the visual heart of a step — it shows *what* to do
and points at *where* to do it.

## Media

- \`src\` and \`alt\` — the media URL and its required accessible description.
- \`type\` — \`"image"\` (default) or \`"video"\` (renders a \`<video controls>\`).
- \`aspectRatio\` — any CSS aspect ratio such as \`"16/9"\`; defaults to \`"4/3"\`.
- \`caption\` — text beneath the frame. Inside a \`GuideStep\` the main image's
  caption is hidden so the bullets stay the focus — put that detail in a bullet.

## Annotations

Annotations are markers drawn on top of the media. Every annotation is positioned
with **percentages from 0 to 100**, where \`0,0\` is the top-left corner and
\`100,100\` is the bottom-right. Percentages keep markers aligned at any size or
aspect ratio. Pass them as an array to the \`annotations\` prop.

There are three shapes:

| Type | Required fields | Shows a label? | Use it for |
| --- | --- | --- | --- |
| \`point\` (default) | \`x\`, \`y\` | Yes, via \`label\` | A precise spot: a screw, connector, or pry point |
| \`circle\` | \`x\`, \`y\`, \`radius\` | No | An area, e.g. where to apply heat (\`radius\` is a % of width) |
| \`rectangle\` | \`x1\`, \`y1\`, \`x2\`, \`y2\` | No | A zone such as a row of clips or an adhesive strip |

Every annotation also accepts:

- \`color\` — the marker color from the guide palette (default
  \`GREY\`). Match it to the related step bullet to link the words to the spot.
- \`title\` — an accessible description / tooltip for the marker.
- \`id\` — a stable key (falls back to the array index).

Only \`point\` markers display a \`label\`. Circles and rectangles are outlines
that highlight a region.`;

const meta = {
  title: "Guide/MediaFigure",
  component: MediaFigure,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: componentDocs } },
  },
  argTypes: {
    type: { control: "inline-radio", options: ["image", "video"] },
    aspectRatio: { control: "text" },
  },
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
  parameters: {
    docs: {
      description: {
        story:
          "The base figure: an image with a caption and no annotations. Use the controls to try a different aspect ratio or switch to a video.",
      },
    },
  },
  render: (args) => (
    <div className="max-w-md">
      <MediaFigure {...args} />
    </div>
  ),
};

export const WithPointAnnotations: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Numbered point markers call out specific spots. In a real step, give each marker the same `label` number and `color` as its matching bullet so the reader can connect the instruction to the place on the photo.",
      },
    },
  },
  render: (args) => (
    <div className="max-w-md">
      <MediaFigure
        {...args}
        caption="Three points to find before you start prying."
        annotations={[
          { type: "point", x: 28, y: 35, color: "GREY", label: 1, title: "Pry point" },
          { type: "point", x: 64, y: 52, color: "ORANGE", label: 2, title: "Hidden clip" },
          { type: "point", x: 45, y: 78, color: "RED", label: 3, title: "Battery cable" },
        ]}
      />
    </div>
  ),
};

export const WithShapeAnnotations: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Circles highlight an area and rectangles mark a zone; both are unlabeled outlines. Mix in a point marker when you also need a precise, numbered callout.",
      },
    },
  },
  render: (args) => (
    <div className="max-w-md">
      <MediaFigure
        {...args}
        caption="Circle marks the heating area; rectangle marks the clip row."
        annotations={[
          {
            type: "circle",
            x: 35,
            y: 42,
            radius: 14,
            color: "ORANGE",
            title: "Heat this area evenly",
          },
          {
            type: "rectangle",
            x1: 58,
            y1: 28,
            x2: 82,
            y2: 62,
            color: "LIGHT_BLUE",
            title: "Plastic clip location",
          },
          {
            type: "point",
            x: 72,
            y: 78,
            color: "GREEN",
            label: 1,
            title: "Insert pry tool here",
          },
        ]}
      />
    </div>
  ),
};

export const Video: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `type="video"` to render a playable video with native controls instead of an image. Annotations are not shown on video.',
      },
    },
  },
  args: {
    type: "video",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    alt: "Short demonstration clip",
    caption: "A short clip can be clearer than a photo for motion-based steps.",
  },
  render: (args) => (
    <div className="max-w-md">
      <MediaFigure {...args} />
    </div>
  ),
};

export const WideAspectRatio: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The frame respects any CSS `aspectRatio`. Use a wide ratio such as `"16/9"` for benches, boards, or panoramas.',
      },
    },
  },
  args: {
    aspectRatio: "16/9",
    src: "https://placehold.co/1280x720/dbeafe/1e40af/png?text=Workbench+overview",
    alt: "Wide overview of the workbench layout",
    caption: "A 16/9 frame suits wide overview shots.",
  },
  render: (args) => (
    <div className="max-w-xl">
      <MediaFigure {...args} />
    </div>
  ),
};
