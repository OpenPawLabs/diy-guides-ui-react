import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { MediaDisplayRegion } from "../../utils/mediaCrop";
import { MediaCropEditor } from "./MediaCropEditor";
import { MediaFigure } from "./MediaFigure";

const componentDocs = `An interactive tool for choosing a \`MediaFigure\` \`displayRegion\`.

\`MediaFigure\` always renders a fixed **4:3** frame and center-crops non-4:3 sources.
\`MediaCropEditor\` lets an author override that center-crop by selecting the exact
4:3 rectangle to show — useful for a tall photo where the subject is off-center.

It shows the **full source image** with a draggable, 4:3-locked selection:

- Drag the box body to move it.
- Drag a corner handle to resize (the box stays 4:3 and inside the image).
- The selection maps directly to a \`displayRegion\` \`{ x, y, width }\` in **source
  pixels** (height is always \`round(width × 3 / 4)\`), the same value \`MediaFigure\`
  consumes — so nothing is re-encoded.

The component is controlled and presentational: pass the current \`region\` and an
\`onChange\` callback, and it reports the chosen region when a drag ends. When
\`region\` is omitted it starts from the largest centered region (matching the
current center-crop). It performs **no** persistence or chrome — the consumer owns
the modal, a "reset to center crop" action, and saving (see the authoring tool's
crop modal).`;

const SRC = "https://placehold.co/900x1200/dbeafe/1e40af/png?text=Tall+source";

const meta = {
  title: "Guide/MediaCropEditor",
  component: MediaCropEditor,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: componentDocs } },
  },
  args: { src: SRC, onChange: () => {} },
} satisfies Meta<typeof MediaCropEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Drag the box or its handles on the left to pick a 4:3 region of this tall source. The figure on the right previews exactly how `MediaFigure` will crop to the chosen `displayRegion`.",
      },
    },
  },
  render: function CropEditorStory(args) {
    const [region, setRegion] = useState<MediaDisplayRegion | undefined>(undefined);

    return (
      <div className="flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-start">
        <div className="flex-1">
          <MediaCropEditor {...args} region={region} onChange={setRegion} />
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-64">
          <MediaFigure src={args.src} displayRegion={region} zoomable={false} />
          <div className="flex items-center justify-between gap-2 text-sm text-default-600">
            <code className="truncate">
              {region
                ? `{ x: ${region.x}, y: ${region.y}, width: ${region.width} }`
                : "center crop (no region)"}
            </code>
            <button
              type="button"
              onClick={() => setRegion(undefined)}
              className="shrink-0 rounded-md border border-default px-2 py-1 transition hover:border-accent hover:text-accent"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    );
  },
};
