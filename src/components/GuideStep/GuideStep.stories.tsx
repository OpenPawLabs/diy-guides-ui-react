import type { Meta, StoryObj } from "@storybook/react-vite";
import { GuideStep } from "./GuideStep";
import { MediaFigure } from "../MediaFigure";

const meta = {
  title: "Guide/GuideStep",
  component: GuideStep,
  tags: ["autodocs"],
  args: {
    number: 1,
    title: "Remove the back cover",
    completable: true,
  },
} satisfies Meta<typeof GuideStep>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-4xl">
      <GuideStep {...args}>
        <GuideStep.Media>
          <MediaFigure
            src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Heat+cover"
            alt="Heating the back cover"
            annotations={[
              { x: 30, y: 40, severity: "caution", label: 1 },
              { x: 70, y: 60, severity: "note", label: 2 },
            ]}
          />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet severity="caution">
            Apply heat evenly for about a minute to soften the adhesive.
          </GuideStep.Bullet>
          <GuideStep.Bullet>
            Insert a pry tool and run it along the seam to release the clips.
          </GuideStep.Bullet>
          <GuideStep.Bullet variant="caution">
            Do not pry near the battery — it can puncture and ignite.
          </GuideStep.Bullet>
          <GuideStep.Bullet variant="reminder">
            Keep track of screw lengths — they are not interchangeable.
          </GuideStep.Bullet>
          <GuideStep.Bullet variant="note">
            Replacement adhesive loses tack after the first removal.
          </GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>
    </div>
  ),
};

export const MultiImageGallery: Story = {
  args: {
    number: 1,
    title: "How to Create a Teardown",
  },
  render: (args) => (
    <div className="max-w-4xl">
      <GuideStep {...args}>
        <GuideStep.Media>
          <MediaFigure
            src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Overview"
            alt="Decide what to take apart"
          />
          <MediaFigure
            src="https://placehold.co/800x600/dbeafe/1e40af/png?text=Photo+setup"
            alt="Set up lighting and camera"
          />
          <MediaFigure
            src="https://placehold.co/800x600/fef3c7/b45309/png?text=Document"
            alt="Document each layer"
          />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet>
            Decide what you want to take apart and gather your tools.
          </GuideStep.Bullet>
          <GuideStep.Bullet severity="info">
            Set up consistent lighting before you remove any screws.
          </GuideStep.Bullet>
          <GuideStep.Bullet severity="tip">
            Photograph each layer before moving to the next.
          </GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>
    </div>
  ),
};

export const Completed: Story = {
  args: { defaultCompleted: true },
  render: (args) => (
    <div className="max-w-4xl">
      <GuideStep {...args}>
        <GuideStep.Media>
          <MediaFigure
            src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Done"
            alt="Completed step"
          />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet>This step is already marked complete.</GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>
    </div>
  ),
};

export const WithoutCompletion: Story = {
  args: { completable: false, number: 3, title: "Reassemble the device" },
  render: (args) => (
    <div className="max-w-4xl">
      <GuideStep {...args}>
        <GuideStep.Media>
          <MediaFigure
            src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Reassemble"
            alt="Reassembling the device"
          />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet severity="tip">
            To reassemble, follow these steps in reverse order.
          </GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>
    </div>
  ),
};
