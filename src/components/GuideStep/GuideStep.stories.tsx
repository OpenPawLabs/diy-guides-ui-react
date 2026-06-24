import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { GuideStep } from "./GuideStep";
import { MediaFigure } from "../MediaFigure";
import type { GuideColor } from "../../types/colors";

const componentDocs = `A single numbered step: a header (number badge, title, and an optional
"mark complete" checkbox) above a two-column body — the main image on the left,
thumbnails and instructions on the right. Below the \`sm\` breakpoint the columns
stack.

A step is built from two required slots:

\`\`\`tsx
<GuideStep title="Soften the adhesive">
  <GuideStep.Media>
    <MediaFigure src="..." />
  </GuideStep.Media>
  <GuideStep.Bullets>
    <GuideStep.Bullet>Heat the edge for a minute.</GuideStep.Bullet>
  </GuideStep.Bullets>
</GuideStep>
\`\`\`

## GuideStep.Media

Holds **one to three** \`MediaFigure\` elements. The first is the main image; any
others become hover/focus thumbnails that swap the main view.

## GuideStep.Bullets and GuideStep.Bullet

\`Bullets\` is the instruction list; each \`Bullet\` is one line. Bullets come in two
styles, chosen with \`variant\`:

**Dot bullets** (\`variant="dot"\`, the default) show a small colored dot set by
\`color\`. Match a bullet's color to a \`MediaFigure\` annotation's color to
visually link the words to the spot on the image.

**Semantic bullets** mirror iFixit's labeled bullet styles:

| Variant | Renders | Use it for |
| --- | --- | --- |
| \`caution\` | red triangle, "Caution:" | A risky action in line with the steps |
| \`reminder\` | bell, "Reminder:" | Something easy to forget later |
| \`note\` | info circle, "Note:" | Extra detail or context |

Override the auto label with \`label\`, or hide it with \`hideLabel\`.

## Completion

A step tracks whether it is done. Use it uncontrolled with \`defaultCompleted\`, or
control it with \`isCompleted\` + \`onCompletedChange\`. Hide the checkbox with
\`completable={false}\`. Inside \`GuideStepList\` completion is managed for you — see
that component.

## Editing affordances

\`GuideStep\` is presentational by default. Two optional, off-by-default props let an
external editor drive it without changing reader output. Pass \`mediaEditing\` to make
the media area editable — an empty add target, click-to-replace on the main image, a
remove control per thumbnail, and a "+" tile to append (up to three). Pass
\`onMarkerPress\` on a \`GuideStep.Bullet\` to turn its marker into a button, e.g. to open
a color or variant picker. See the "Editing affordances" story.`;

const meta = {
  title: "Guide/GuideStep",
  component: GuideStep,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: componentDocs } },
  },
  args: {
    number: 1,
    title: "Remove the back cover",
    completable: true,
  },
} satisfies Meta<typeof GuideStep>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Anatomy: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A complete step: numbered header, a main image with point annotations, and dot bullets whose colors match the markers. Toggle the controls to change the number, title, or completion checkbox.",
      },
    },
  },
  render: (args) => (
    <div className="max-w-4xl">
      <GuideStep {...args}>
        <GuideStep.Media>
          <MediaFigure
            src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Heat+cover"
            annotations={[
              { x: 30, y: 40, color: "ORANGE", label: 1 },
              { x: 70, y: 60, color: "BLUE", label: 2 },
            ]}
          />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet color="ORANGE">
            Apply heat evenly for about a minute to soften the adhesive.
          </GuideStep.Bullet>
          <GuideStep.Bullet color="BLUE">
            Insert a pry tool and run it along the seam to release the clips.
          </GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>
    </div>
  ),
};

export const MultipleImages: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Add up to three `MediaFigure`s to `GuideStep.Media`. The first is the main view; the others become thumbnails — hover or focus one to swap it in.",
      },
    },
  },
  args: { number: 1, title: "Document each layer" },
  render: (args) => (
    <div className="max-w-4xl">
      <GuideStep {...args}>
        <GuideStep.Media>
          <MediaFigure
            src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Overview"
          />
          <MediaFigure
            src="https://placehold.co/800x600/dbeafe/1e40af/png?text=Connector"
          />
          <MediaFigure
            src="https://placehold.co/800x600/fef3c7/b45309/png?text=Screws"
          />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet>
            Hover or focus a thumbnail to swap the main image.
          </GuideStep.Bullet>
          <GuideStep.Bullet variant="note">
            Photograph each layer before moving to the next.
          </GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>
    </div>
  ),
};

export const DotBullets: Story = {
  name: "Dot bullets",
  parameters: {
    docs: {
      description: {
        story:
          "Dot bullets are the default. Their dot color comes from `color` and is meant to match a marker on the image, linking each instruction to a spot — for example, different connector locations.",
      },
    },
  },
  args: { number: 2, title: "Identify the connectors" },
  render: (args) => (
    <div className="max-w-4xl">
      <GuideStep {...args}>
        <GuideStep.Media>
          <MediaFigure
            src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Board"
            annotations={[
              { x: 30, y: 35, color: "RED", label: 1 },
              { x: 60, y: 45, color: "ORANGE", label: 2 },
              { x: 45, y: 70, color: "GREEN", label: 3 },
            ]}
          />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet color="RED">
            Battery connector — disconnect this first.
          </GuideStep.Bullet>
          <GuideStep.Bullet color="ORANGE">
            Display cable — lift it straight up, not at an angle.
          </GuideStep.Bullet>
          <GuideStep.Bullet color="GREEN">
            Antenna cable — easiest to reconnect last.
          </GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>
    </div>
  ),
};

export const SemanticBullets: Story = {
  name: "Semantic bullets",
  parameters: {
    docs: {
      description: {
        story:
          "Semantic bullets carry an icon and a bold label. Use `caution` for risks in line with the steps, `reminder` for things easy to forget, and `note` for extra context. `label` overrides the text; `hideLabel` removes it.",
      },
    },
  },
  args: { number: 3, title: "Disconnect the battery" },
  render: (args) => (
    <div className="max-w-4xl">
      <GuideStep {...args}>
        <GuideStep.Media>
          <MediaFigure
            src="https://placehold.co/800x600/fee2e2/b91c1c/png?text=Battery"
          />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet variant="caution">
            Do not pry near the battery — it can puncture and ignite.
          </GuideStep.Bullet>
          <GuideStep.Bullet variant="reminder">
            Keep track of screw lengths — they are not interchangeable.
          </GuideStep.Bullet>
          <GuideStep.Bullet variant="note">
            Replacement adhesive loses tack after the first removal.
          </GuideStep.Bullet>
          <GuideStep.Bullet variant="caution" label="High voltage">
            Discharge the capacitor before touching the board.
          </GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>
    </div>
  ),
};

export const Completed: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A step starts completed via `defaultCompleted`. Completed steps show a check in the number badge and dim slightly. Use the checkbox to toggle it.",
      },
    },
  },
  args: { defaultCompleted: true },
  render: (args) => (
    <div className="max-w-4xl">
      <GuideStep {...args}>
        <GuideStep.Media>
          <MediaFigure
            src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Done"
          />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet>This step is already marked complete.</GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>
    </div>
  ),
};

export const EditingAffordances: Story = {
  name: "Editing affordances",
  parameters: {
    docs: {
      description: {
        story:
          "Optional, editor-only affordances. Passing `mediaEditing` turns the media area into an editor (empty add target, click-to-replace, a remove control per thumbnail, and a \"+\" tile). Passing `onMarkerPress` on a bullet turns its marker into a button — here it cycles the dot color. These are off by default, so the reader output is unchanged.",
      },
    },
  },
  args: { number: 1, title: "Document each layer", completable: false },
  render: function EditingAffordancesStory(args) {
    const palette: GuideColor[] = [
      "GREY",
      "RED",
      "ORANGE",
      "GREEN",
      "BLUE",
      "MAGENTA",
    ];
    const [images, setImages] = useState<string[]>([
      "https://placehold.co/800x600/e2e8f0/1e293b/png?text=Overview",
    ]);
    const [active, setActive] = useState(0);
    const [colorIndex, setColorIndex] = useState(0);
    const [seq, setSeq] = useState(2);
    const nextImage = () => {
      const src = `https://placehold.co/800x600/dbeafe/1e40af/png?text=Image+${seq}`;
      setSeq((value) => value + 1);
      return src;
    };

    return (
      <div className="max-w-4xl">
        <GuideStep
          {...args}
          mediaEditing={{
            activeIndex: Math.min(active, Math.max(images.length - 1, 0)),
            onSelectImage: setActive,
            onAddImage: () => setImages((prev) => [...prev, nextImage()]),
            onReplaceImage: (index) =>
              setImages((prev) =>
                prev.map((src, i) => (i === index ? nextImage() : src)),
              ),
            onRemoveImage: (index) =>
              setImages((prev) => prev.filter((_, i) => i !== index)),
          }}
        >
          <GuideStep.Media>
            {images.map((src, index) => (
              <MediaFigure key={`${index}-${src}`} src={src} />
            ))}
          </GuideStep.Media>
          <GuideStep.Bullets>
            <GuideStep.Bullet
              color={palette[colorIndex]}
              onMarkerPress={() =>
                setColorIndex((prev) => (prev + 1) % palette.length)
              }
            >
              Click the dot to cycle its color.
            </GuideStep.Bullet>
            <GuideStep.Bullet variant="note">
              Click a thumbnail to select it, then replace or remove it; use the
              "+" tile to add more (up to three).
            </GuideStep.Bullet>
          </GuideStep.Bullets>
        </GuideStep>
      </div>
    );
  },
};

export const WithoutCompletion: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Set `completable={false}` to hide the checkbox — useful for an intro or wrap-up step that has no “done” state.",
      },
    },
  },
  args: { completable: false, number: 4, title: "Reassemble the device" },
  render: (args) => (
    <div className="max-w-4xl">
      <GuideStep {...args}>
        <GuideStep.Media>
          <MediaFigure
            src="https://placehold.co/800x600/dbeafe/1e40af/png?text=Reassemble"
          />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet variant="note">
            To reassemble, follow these steps in reverse order.
          </GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>
    </div>
  ),
};
