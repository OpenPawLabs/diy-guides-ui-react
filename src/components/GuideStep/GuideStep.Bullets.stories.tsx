import type { Meta, StoryObj } from "@storybook/react-vite";
import { GuideStep } from "./GuideStep";
import { MediaFigure } from "../MediaFigure";

const meta = {
  title: "Guide/GuideStep/Bullets",
  component: GuideStep.Bullets,
  tags: ["autodocs"],
  args: { children: null },
  parameters: {
    docs: {
      description: {
        component:
          "Ordered list container for `GuideStep.Bullet` children. Required on every `GuideStep` alongside `GuideStep.Media` — on wider viewports bullets render in the right column beside the main image.",
      },
    },
  },
} satisfies Meta<typeof GuideStep.Bullets>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="max-w-xl">
      <GuideStep number={1} title="Release the clips">
        <GuideStep.Media>
          <MediaFigure
            src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Heat"
            alt="Heating the adhesive"
          />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet severity="caution">
            Apply heat evenly for about a minute.
          </GuideStep.Bullet>
          <GuideStep.Bullet>
            Slide a pick under the rear glass and free the clips.
          </GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>
    </div>
  ),
};

export const MixedSemanticBullets: Story = {
  name: "Mixed semantic bullets",
  render: () => (
    <div className="max-w-xl">
      <GuideStep number={2} title="Disconnect the battery">
        <GuideStep.Media>
          <MediaFigure
            src="https://placehold.co/800x600/fee2e2/b91c1c/png?text=Battery"
            alt="Battery connector"
          />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet variant="caution">
            Power off the device before disconnecting any cables.
          </GuideStep.Bullet>
          <GuideStep.Bullet variant="reminder">
            Note screw positions — they may differ in length.
          </GuideStep.Bullet>
          <GuideStep.Bullet variant="note">
            A plastic opening tool reduces the risk of scratching connectors.
          </GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>
    </div>
  ),
};
