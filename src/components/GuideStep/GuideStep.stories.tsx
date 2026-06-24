import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { GuideStep } from "./GuideStep";
import { MediaFigure } from "../MediaFigure";
import { LinkButton } from "../LinkButton";
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
others become hover/focus thumbnails that swap the main view. Video and 3D-model
figures have no still image, so their thumbnails render a colored placeholder (a
play icon or "3D") rather than a broken image — see the "Mixed media thumbnails" story.

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

**Button bullets** (\`variant="button"\`) drop the marker entirely and render their children
as a standalone action — typically a \`LinkButton\` offering a download or link (and a
dropdown of alternative files). Use one when a step hands the reader a file or destination.

## Completion

A step tracks whether it is done. Use it uncontrolled with \`defaultCompleted\`, or
control it with \`isCompleted\` + \`onCompletedChange\`. Hide the checkbox with
\`completable={false}\`. Inside \`GuideStepList\` completion is managed for you — see
that component.

## Editing affordances

\`GuideStep\` is presentational by default. Three optional, off-by-default props let an
external editor drive it without changing reader output. Pass \`mediaEditing\` to make
the media area editable — an empty add target, click-to-annotate on the main image, a
remove control per thumbnail, drag-to-reorder thumbnails (when \`onReorderImage\` is set),
and a "+" tile to append (up to three). Pass \`editing\` to \`GuideStep.Bullets\` to manage
the bullet list — a drag handle to reorder (when \`onReorderBullet\` is set and more than
one bullet exists), a remove control per bullet (hidden on the last remaining bullet), and
a "+ New bullet" button. Pass \`onMarkerPress\` on a \`GuideStep.Bullet\` to turn its marker
into a button, e.g. to open a color or variant picker. See the "Editing affordances" story.`;

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

export const MixedMedia: Story = {
  name: "Mixed media thumbnails",
  parameters: {
    docs: {
      description: {
        story:
          'A step can mix images, videos, and 3D models. Videos and models have no still image, so their thumbnails render a colored placeholder — a play icon for `type="video"` and "3D" for `type="model"` — instead of a broken image. Hover or focus a thumbnail to view it full size.',
      },
    },
  },
  args: { number: 1, title: "Print and assemble the bracket" },
  render: (args) => (
    <div className="max-w-4xl">
      <GuideStep {...args}>
        <GuideStep.Media>
          <MediaFigure
            type="video"
            src="https://www.w3schools.com/html/mov_bbb.mp4"
          />
          <MediaFigure src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Printed+bracket" />
          <MediaFigure
            type="model"
            src="https://raw.githubusercontent.com/kovacsv/Online3DViewer/master/test/testfiles/stl/stl_ascii.stl"
          />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet>
            Review the photo, then watch the clip and inspect the 3D model.
          </GuideStep.Bullet>
          <GuideStep.Bullet variant="note">
            Video and model thumbnails show a placeholder.
          </GuideStep.Bullet>
          <GuideStep.Bullet variant="button">
            <LinkButton>
              <LinkButton.Item href="./files/enclosure.3mf" download>
                Download 3MF
              </LinkButton.Item>
              <LinkButton.Item href="./files/enclosure.stl" download>
                Download STL
              </LinkButton.Item>
              <LinkButton.Item href="./files/enclosure.step" download>
                Download STEP
              </LinkButton.Item>
            </LinkButton>
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

export const ButtonBullet: Story = {
  name: "Button bullet",
  parameters: {
    docs: {
      description: {
        story:
          "A `button` bullet renders no marker and hosts a `LinkButton`, handing the reader a download (with a dropdown of alternative formats) directly inside the step.",
      },
    },
  },
  args: { number: 2, title: "Print the enclosure", completable: false },
  render: (args) => (
    <div className="max-w-4xl">
      <GuideStep {...args}>
        <GuideStep.Media>
          <MediaFigure src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Enclosure" />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet>
            Print at 0.2&nbsp;mm layer height with supports off.
          </GuideStep.Bullet>
          <GuideStep.Bullet variant="button">
            <LinkButton>
              <LinkButton.Item href="./files/enclosure.3mf" download>
                Download 3MF
              </LinkButton.Item>
              <LinkButton.Item href="./files/enclosure.stl" download>
                Download STL
              </LinkButton.Item>
              <LinkButton.Item href="./files/enclosure.step" download>
                Download STEP
              </LinkButton.Item>
            </LinkButton>
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
          "Optional, editor-only affordances. Passing `mediaEditing` turns the media area into an editor (empty add target, an \"Edit annotations\" / \"Adjust crop\" overlay on the main image, a remove control per thumbnail, drag-to-reorder thumbnails, and a \"+\" tile). Passing `editing` to `GuideStep.Bullets` manages the bullet list — drag a bullet's grip to reorder, remove with the x, or append with \"+ New bullet\". Passing `onMarkerPress` on a bullet turns its marker into a button — here it cycles the dot color. These are off by default, so the reader output is unchanged.",
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
    const [annotatingIndex, setAnnotatingIndex] = useState<number | null>(null);
    const [croppingIndex, setCroppingIndex] = useState<number | null>(null);
    const [colorIndex, setColorIndex] = useState(0);
    const [seq, setSeq] = useState(2);
    const [bullets, setBullets] = useState([
      { id: "b1", text: "Drag the grip to reorder; remove with the x." },
      { id: "b2", text: "Append more with the \u201c+ New bullet\u201d button." },
    ]);
    const [bulletSeq, setBulletSeq] = useState(3);
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
            onEditAnnotations: (index) => setAnnotatingIndex(index),
            onEditCrop: (index) => setCroppingIndex(index),
            onRemoveImage: (index) =>
              setImages((prev) => prev.filter((_, i) => i !== index)),
            onReorderImage: (from, to) =>
              setImages((prev) => {
                const next = [...prev];
                const [moved] = next.splice(from, 1);
                next.splice(to, 0, moved);
                return next;
              }),
          }}
        >
          <GuideStep.Media>
            {images.map((src, index) => (
              <MediaFigure key={`${index}-${src}`} src={src} />
            ))}
          </GuideStep.Media>
          <GuideStep.Bullets
            editing={{
              onAddBullet: () => {
                setBullets((prev) => [
                  ...prev,
                  { id: `b${bulletSeq}`, text: "New instruction." },
                ]);
                setBulletSeq((value) => value + 1);
              },
              onRemoveBullet: (index) =>
                setBullets((prev) => prev.filter((_, i) => i !== index)),
              onReorderBullet: (from, to) =>
                setBullets((prev) => {
                  const next = [...prev];
                  const [moved] = next.splice(from, 1);
                  next.splice(to, 0, moved);
                  return next;
                }),
            }}
          >
            {bullets.map((bullet, index) =>
              index === 0 ? (
                <GuideStep.Bullet
                  key={bullet.id}
                  color={palette[colorIndex]}
                  onMarkerPress={() =>
                    setColorIndex((prev) => (prev + 1) % palette.length)
                  }
                >
                  {bullet.text} Click the dot to cycle its color.
                </GuideStep.Bullet>
              ) : (
                <GuideStep.Bullet key={bullet.id}>
                  {bullet.text}
                </GuideStep.Bullet>
              ),
            )}
          </GuideStep.Bullets>
        </GuideStep>
        {annotatingIndex !== null && (
          <p className="mt-3 text-sm text-default-500">
            Editing annotations for image {annotatingIndex + 1}. In a real editor this
            opens the annotation modal; see <code>Guide/MediaFigure</code> for the
            interactive canvas.
          </p>
        )}
        {croppingIndex !== null && (
          <p className="mt-3 text-sm text-default-500">
            Adjusting the crop for image {croppingIndex + 1}. In a real editor this
            opens the crop modal; see <code>Guide/MediaCropEditor</code> for the
            interactive tool.
          </p>
        )}
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
