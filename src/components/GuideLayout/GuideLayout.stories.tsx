import type { Meta, StoryObj } from "@storybook/react-vite";
import { GuideLayout } from "./GuideLayout";
import { GuideStepList } from "../GuideStepList";
import { GuideStep } from "../GuideStep";
import { MediaFigure } from "../MediaFigure";
import { ToolList } from "../ToolList";
import { WarningCallout } from "../WarningCallout";

const meta = {
  title: "Guide/GuideLayout",
  component: GuideLayout,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: { children: null },
} satisfies Meta<typeof GuideLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FullGuide: Story = {
  render: () => (
    <div className="p-6">
      <GuideLayout>
        <GuideLayout.Header
          title="Replace a Smartphone Battery"
          difficulty="moderate"
          timeEstimate="20 – 30 minutes"
          meta="By the DIY Guides team · Updated Jun 2026"
        />

        <GuideLayout.Intro>
          A worn battery drains fast and can swell. This guide walks you through a
          safe replacement using basic tools.
        </GuideLayout.Intro>

        <GuideLayout.Sidebar>
          <ToolList title="Tools">
            <ToolList.Item name="Pro Tech Toolkit" href="#" price="$67.96" />
            <ToolList.Item name="iOpener" href="#" price="$14.99" />
            <ToolList.Item name="Plastic spudger" price="$2.99" />
          </ToolList>
          <ToolList title="Parts">
            <ToolList.Item name="Replacement battery" quantity={1} price="$29.99" />
          </ToolList>
        </GuideLayout.Sidebar>

        <GuideLayout.Content>
          <WarningCallout severity="danger" title="Battery safety">
            A swollen or punctured lithium battery can catch fire. Work slowly and
            never force a swollen cell.
          </WarningCallout>
          <div className="mt-8">
            <GuideStepList>
              <GuideStep title="Soften the adhesive and open the case">
                <GuideStep.Media>
                  <MediaFigure
                    src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Heat+edges"
                    alt="Heating the rear glass"
                    annotations={[{ x: 50, y: 45, severity: "caution", label: 1 }]}
                  />
                  <MediaFigure
                    src="https://placehold.co/800x600/dbeafe/1e40af/png?text=Pry+clips"
                    alt="Prying the rear glass"
                  />
                  <MediaFigure
                    src="https://placehold.co/800x600/fef3c7/b45309/png?text=Lift+cover"
                    alt="Lifting the rear cover"
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

              <GuideStep title="Disconnect and remove the battery">
                <GuideStep.Media>
                  <MediaFigure
                    src="https://placehold.co/800x600/fee2e2/b91c1c/png?text=Disconnect"
                    alt="Disconnecting the battery connector"
                  />
                </GuideStep.Media>
                <GuideStep.Bullets>
                  <GuideStep.Bullet severity="danger">
                    Disconnect the battery connector before anything else.
                  </GuideStep.Bullet>
                  <GuideStep.Bullet>
                    Pull the stretch-release adhesive tabs to lift the cell out.
                  </GuideStep.Bullet>
                </GuideStep.Bullets>
              </GuideStep>

              <GuideStep title="Install the new battery and reassemble">
                <GuideStep.Media>
                  <MediaFigure
                    src="https://placehold.co/800x600/dbeafe/1e40af/png?text=Reassemble"
                    alt="Reassembling the device"
                  />
                </GuideStep.Media>
                <GuideStep.Bullets>
                  <GuideStep.Bullet>
                    Seat the new battery and reconnect the connector.
                  </GuideStep.Bullet>
                  <GuideStep.Bullet severity="tip">
                    Reassemble by following these steps in reverse order.
                  </GuideStep.Bullet>
                </GuideStep.Bullets>
              </GuideStep>
            </GuideStepList>
          </div>
        </GuideLayout.Content>
      </GuideLayout>
    </div>
  ),
};
