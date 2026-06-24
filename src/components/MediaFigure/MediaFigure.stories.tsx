import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { COLORS, type GuideColor } from "../../types/colors";
import {
  MediaFigure,
  type AnnotationTool,
  type MediaAnnotation,
} from "./MediaFigure";

const componentDocs = `An instructional image or video with overlaid annotations.
\`MediaFigure\` is the visual heart of a step — it shows *what* to do and points at
*where* to do it. Put instructional copy in \`GuideStep.Bullet\` content, not on the
figure itself.

## Media

- \`src\` — the media URL.
- \`type\` — \`"image"\` (default), \`"video"\` (renders a \`<video controls>\`), or \`"model"\` (interactive 3D viewer via [online-3d-viewer](https://www.npmjs.com/package/online-3d-viewer) with Z-up, free orbit, and orthographic camera). In a multi-image \`GuideStep\`, the \`MediaFigureThumbnail\` companion renders a colored placeholder (a play icon or "3D") for \`video\` and \`model\` sources so they never appear broken in the gallery.
- **Fixed 4:3 frame** — every figure uses the same aspect ratio for consistent step
  layout. Non-4:3 uploads are center-cropped to fit.
- \`displayRegion\` — optional \`{ x, y, width }\` in **source pixels** for an exact
  4:3 crop or zoom without re-encoding the image. Height is always
  \`round(width × 3 / 4)\`. Authoring tools can set it visually with the sibling
  \`MediaCropEditor\` (see \`Guide/MediaCropEditor\`).
- \`zoomable\` — image figures open the full-size source in a modal lightbox on
  click (default \`true\`). It applies only to \`type="image"\`; set it to \`false\`
  in editing contexts where the click drives another action (\`GuideStep\` does this
  automatically in edit mode).

## Annotations

Annotations are markers drawn on top of the media. Every annotation is positioned
with **percentages from 0 to 100 of the visible frame**, where \`0,0\` is the
top-left corner and \`100,100\` is the bottom-right — independent of
\`displayRegion\`. Pass them as an array to the \`annotations\` prop.

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
that highlight a region.

## Editing

Pass \`annotationEditing\` to turn the figure into an interactive annotation canvas
(the lightbox is disabled while editing). It is a controlled, callback-driven
affordance: the consumer owns the active \`tool\`, the \`color\` for new shapes, the
\`selectedId\`, and persistence. With a drawing tool, click to drop a \`point\` or drag
to draw a \`circle\` / \`rectangle\`; with \`select\`, click a marker to select it, drag its
body to move, drag the handles to resize, and press \`Delete\` to remove it. The library
computes all frame-percentage geometry and reports intent through \`onAdd\`, \`onChange\`,
\`onRemove\`, and \`onSelect\` — it performs no tool, color-picker, or persistence logic
(see the authoring tool's annotation modal for that chrome).

Annotations are positioned in frame percentages, **independent of \`displayRegion\`**,
so the crop is a separate concern with its own tool. To pick a \`displayRegion\`
visually, use the sibling \`MediaCropEditor\` (see \`Guide/MediaCropEditor\`), which
reports the region in source pixels.`;

const meta = {
  title: "Guide/MediaFigure",
  component: MediaFigure,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: componentDocs } },
  },
  argTypes: {
    type: { control: "inline-radio", options: ["image", "video", "model"] },
    zoomable: { control: "boolean" },
  },
  args: {
    src: "https://placehold.co/800x600/e2e8f0/1e293b/png?text=Guide+photo",
  },
} satisfies Meta<typeof MediaFigure>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The base figure: an image with no annotations. Use the controls to switch to a video.",
      },
    },
  },
  render: (args) => (
    <div className="max-w-md">
      <MediaFigure {...args} />
    </div>
  ),
};

export const Lightbox: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Image figures are zoomable by default — click the image to open the full-size source in a modal lightbox, then dismiss it with the close button, the backdrop, or `Esc`. Set `zoomable={false}` to opt out.",
      },
    },
  },
  args: {
    src: "https://placehold.co/1600x1200/dbeafe/1e40af/png?text=Click+to+zoom",
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
  },
  render: (args) => (
    <div className="max-w-md">
      <MediaFigure {...args} />
    </div>
  ),
};

export const Model3D: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `type="model"` to embed an interactive 3D model. The viewer uses Z axis up, free orbit navigation, and an orthographic camera. Drag to rotate, scroll to zoom.',
      },
    },
  },
  args: {
    type: "model",
    src: "https://raw.githubusercontent.com/kovacsv/Online3DViewer/master/test/testfiles/stl/stl_ascii.stl",
  },
  render: (args) => (
    <div className="max-w-md">
      <MediaFigure {...args} />
    </div>
  ),
};

export const TallImageCenterCrop: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Without `displayRegion`, a non-4:3 source is center-cropped to the fixed 4:3 frame.",
      },
    },
  },
  args: {
    src: "https://placehold.co/600x900/fef3c7/b45309/png?text=Tall+photo",
  },
  render: (args) => (
    <div className="max-w-md">
      <MediaFigure {...args} />
    </div>
  ),
};

export const DisplayRegion: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`displayRegion` zooms to a 4:3 source-pixel rect (`{ x: 320, y: 90, width: 640 }` → 640×480 on a 1280×720 image) without re-encoding.",
      },
    },
  },
  args: {
    src: "https://placehold.co/1280x720/dbeafe/1e40af/png?text=Workbench+overview",
    displayRegion: { x: 320, y: 90, width: 640 },
  },
  render: (args) => (
    <div className="max-w-xl">
      <MediaFigure {...args} />
    </div>
  ),
};

const TOOLS: AnnotationTool[] = ["select", "point", "circle", "rectangle"];
const PALETTE = Object.keys(COLORS) as GuideColor[];

export const AnnotationEditor: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "An interactive editor driven by `annotationEditing`. Pick a tool and color, then click or drag on the image to draw. Switch to `select` to move a marker, drag its handles to resize, or press `Delete` to remove the selected one. The toolbar and color swatches here are the consumer's responsibility — the figure only reports geometry.",
      },
    },
  },
  render: function AnnotationEditorStory(args) {
    const [tool, setTool] = useState<AnnotationTool>("point");
    const [color, setColor] = useState<GuideColor>("RED");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [seq, setSeq] = useState(1);
    const [annotations, setAnnotations] = useState<MediaAnnotation[]>([]);

    return (
      <div className="flex max-w-xl flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {TOOLS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTool(option)}
              aria-pressed={tool === option}
              className={`rounded-md border px-2.5 py-1 text-sm capitalize transition ${
                tool === option
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-default hover:border-accent"
              }`}
            >
              {option}
            </button>
          ))}
          <span className="mx-1 h-5 w-px bg-default" />
          {PALETTE.map((option) => (
            <button
              key={option}
              type="button"
              aria-label={option}
              aria-pressed={color === option}
              onClick={() => {
                setColor(option);
                if (selectedId) {
                  setAnnotations((prev) =>
                    prev.map((a) =>
                      a.id === selectedId ? { ...a, color: option } : a,
                    ),
                  );
                }
              }}
              className={`size-5 rounded-full transition ${
                color === option ? "ring-2 ring-accent ring-offset-2" : ""
              }`}
              style={{ backgroundColor: COLORS[option] }}
            />
          ))}
        </div>
        <MediaFigure
          {...args}
          annotations={annotations}
          annotationEditing={{
            tool,
            color,
            selectedId,
            onSelect: setSelectedId,
            onAdd: (annotation) => {
              const id = `a${seq}`;
              const next: MediaAnnotation =
                annotation.type === "point"
                  ? { ...annotation, id, label: seq }
                  : { ...annotation, id };
              setSeq((value) => value + 1);
              setAnnotations((prev) => [...prev, next]);
              setSelectedId(id);
              setTool("select");
            },
            onChange: (id, annotation) =>
              setAnnotations((prev) =>
                prev.map((a) => (a.id === id ? { ...annotation, id } : a)),
              ),
            onRemove: (id) => {
              setAnnotations((prev) => prev.filter((a) => a.id !== id));
              setSelectedId(null);
            },
          }}
        />
      </div>
    );
  },
};
