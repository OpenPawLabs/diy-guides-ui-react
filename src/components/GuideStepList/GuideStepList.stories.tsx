import type { Meta, StoryObj } from "@storybook/react-vite";
import { GuideStepList } from "./GuideStepList";
import { GuideStep } from "../GuideStep";
import { MediaFigure } from "../MediaFigure";

const meta = {
  title: "Guide/GuideStepList",
  component: GuideStepList,
  tags: ["autodocs"],
  args: { children: null },
} satisfies Meta<typeof GuideStepList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-4xl">
      <GuideStepList {...args}>
        <GuideStep title="Power down and open the case">
          <GuideStep.Media>
            <MediaFigure
              src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Open+case"
              alt="Opening the case"
            />
          </GuideStep.Media>
          <GuideStep.Bullets>
            <GuideStep.Bullet severity="caution">
              Unplug the device and discharge any stored power first.
            </GuideStep.Bullet>
            <GuideStep.Bullet>Remove the four base screws.</GuideStep.Bullet>
          </GuideStep.Bullets>
        </GuideStep>
        <GuideStep title="Disconnect the battery">
          <GuideStep.Media>
            <MediaFigure
              src="https://placehold.co/800x600/fee2e2/b91c1c/png?text=Battery"
              alt="Disconnecting the battery"
            />
          </GuideStep.Media>
          <GuideStep.Bullets>
            <GuideStep.Bullet severity="danger">
              Always disconnect the battery before touching the board.
            </GuideStep.Bullet>
          </GuideStep.Bullets>
        </GuideStep>
        <GuideStep title="Replace the component">
          <GuideStep.Media>
            <MediaFigure
              src="https://placehold.co/800x600/dbeafe/1e40af/png?text=Install"
              alt="Installing the new part"
            />
          </GuideStep.Media>
          <GuideStep.Bullets>
            <GuideStep.Bullet>Swap in the new part.</GuideStep.Bullet>
            <GuideStep.Bullet severity="tip">
              Reassemble by following these steps in reverse.
            </GuideStep.Bullet>
          </GuideStep.Bullets>
        </GuideStep>
      </GuideStepList>
    </div>
  ),
};

export const WithStartingProgress: Story = {
  render: (args) => (
    <div className="max-w-4xl">
      <GuideStepList {...args}>
        <GuideStep title="Already done" defaultCompleted>
          <GuideStep.Media>
            <MediaFigure
              src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Done"
              alt="Completed step"
            />
          </GuideStep.Media>
          <GuideStep.Bullets>
            <GuideStep.Bullet>This step starts completed.</GuideStep.Bullet>
          </GuideStep.Bullets>
        </GuideStep>
        <GuideStep title="Up next">
          <GuideStep.Media>
            <MediaFigure
              src="https://placehold.co/800x600/dbeafe/1e40af/png?text=Next"
              alt="Next step"
            />
          </GuideStep.Media>
          <GuideStep.Bullets>
            <GuideStep.Bullet>Continue here.</GuideStep.Bullet>
          </GuideStep.Bullets>
        </GuideStep>
      </GuideStepList>
    </div>
  ),
};
