import type { Meta, StoryObj } from "@storybook/react-vite";
import { GuideStep } from "./GuideStep";
import { MediaFigure } from "../MediaFigure";

const meta = {
  title: "Guide/GuideStep/Media",
  component: GuideStep.Media,
  tags: ["autodocs"],
  args: { children: null },
  parameters: {
    docs: {
      description: {
        component:
          "Slot for up to three `MediaFigure` children. Required on every `GuideStep` alongside `GuideStep.Bullets`. The parent renders the first image as the main view and shows hover/focus thumbnails when multiple figures are provided. Captions are hidden on the main image in the two-column layout.",
      },
    },
  },
} satisfies Meta<typeof GuideStep.Media>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleImage: Story = {
  render: () => (
    <div className="max-w-4xl">
      <GuideStep number={1} title="Heat the adhesive">
        <GuideStep.Media>
          <MediaFigure
            src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Heat+cover"
            alt="Heating the back cover with an iOpener"
            caption="Keep the iOpener moving — do not let it rest in one spot."
            annotations={[
              { x: 35, y: 45, severity: "caution", label: 1 },
              { x: 68, y: 55, severity: "note", label: 2 },
            ]}
          />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet severity="caution">
            Apply heat along the edges for about a minute.
          </GuideStep.Bullet>
          <GuideStep.Bullet>
            Slide a pick under the rear glass and free the clips.
          </GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>
    </div>
  ),
};

export const ImageGallery: Story = {
  name: "Multi-image gallery",
  render: () => (
    <div className="max-w-4xl">
      <GuideStep number={1} title="Document each layer">
        <GuideStep.Media>
          <MediaFigure
            src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Overview"
            alt="Top-down view of the opened device"
          />
          <MediaFigure
            src="https://placehold.co/800x600/dbeafe/1e40af/png?text=Connector"
            alt="Battery connector close-up"
          />
          <MediaFigure
            src="https://placehold.co/800x600/fef3c7/b45309/png?text=Screws"
            alt="Screw locations highlighted"
          />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet>
            Hover or focus a thumbnail to swap the main image.
          </GuideStep.Bullet>
          <GuideStep.Bullet variant="note">
            Up to three images are supported per step.
          </GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>
    </div>
  ),
};
