import type { Meta, StoryObj } from "@storybook/react-vite";
import { GuideLayout } from "./GuideLayout";
import { GuideStepList } from "../GuideStepList";
import { GuideStep } from "../GuideStep";
import { MediaFigure } from "../MediaFigure";
import { ToolList } from "../ToolList";
import { Callout } from "../Callout";

const componentDocs = `The responsive page shell for a complete guide. It arranges four regions, each a
compound part:

- \`GuideLayout.Header\` — the title plus optional difficulty, time estimate, and a
  byline/metadata line. Difficulty renders as a \`DifficultyBadge\` and the time
  estimate as a chip.
- \`GuideLayout.Intro\` — the overview paragraph(s).
- \`GuideLayout.Sidebar\` — "what you need", typically one or two \`ToolList\`s.
- \`GuideLayout.Content\` — the full-width body, usually a \`Callout\` and a
  \`GuideStepList\`.

On desktop the header spans the top, the intro sits beside the sidebar, and the
content runs full width below. On mobile everything stacks in source order:
header, intro, sidebar, then content.

## Header props

\`title\` is required; \`difficulty\`, \`timeEstimate\`, and \`meta\` are optional and
only render when provided.`;

const meta = {
  title: "Guide/GuideLayout",
  component: GuideLayout,
  parameters: {
    layout: "fullscreen",
    docs: { description: { component: componentDocs } },
  },
  tags: ["autodocs"],
  args: { children: null },
} satisfies Meta<typeof GuideLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FullGuide: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A complete page: header with difficulty and time, an intro beside the tools/parts sidebar, then a warning and the numbered steps in the content column.",
      },
    },
  },
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
          <Callout type="danger" title="Battery safety">
            A swollen or punctured lithium battery can catch fire. Work slowly and
            never force a swollen cell.
          </Callout>
          <div className="mt-8">
            <GuideStepList>
              <GuideStep title="Soften the adhesive and open the case">
                <GuideStep.Media>
                  <MediaFigure
                    src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Heat+edges"
                    annotations={[{ x: 50, y: 45, color: "ORANGE", label: 1 }]}
                  />
                  <MediaFigure
                    src="https://placehold.co/800x600/dbeafe/1e40af/png?text=Pry+clips"
                  />
                  <MediaFigure
                    src="https://placehold.co/800x600/fef3c7/b45309/png?text=Lift+cover"
                  />
                </GuideStep.Media>
                <GuideStep.Bullets>
                  <GuideStep.Bullet color="ORANGE">
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
                  />
                </GuideStep.Media>
                <GuideStep.Bullets>
                  <GuideStep.Bullet variant="caution">
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
                  />
                </GuideStep.Media>
                <GuideStep.Bullets>
                  <GuideStep.Bullet>
                    Seat the new battery and reconnect the connector.
                  </GuideStep.Bullet>
                  <GuideStep.Bullet variant="note">
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

export const WithoutSidebar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The sidebar is optional. Omit `GuideLayout.Sidebar` and the intro and content span the full width — useful for guides that need no tools or parts.",
      },
    },
  },
  render: () => (
    <div className="p-6">
      <GuideLayout>
        <GuideLayout.Header
          title="Calibrate the Display"
          difficulty="easy"
          timeEstimate="5 minutes"
        />

        <GuideLayout.Intro>
          A quick, tool-free calibration to get accurate colors. No parts
          required.
        </GuideLayout.Intro>

        <GuideLayout.Content>
          <GuideStepList>
            <GuideStep title="Open display settings">
              <GuideStep.Media>
                <MediaFigure
                  src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Settings"
                />
              </GuideStep.Media>
              <GuideStep.Bullets>
                <GuideStep.Bullet>
                  Open Settings and choose Display, then Calibrate.
                </GuideStep.Bullet>
              </GuideStep.Bullets>
            </GuideStep>
            <GuideStep title="Follow the on-screen targets">
              <GuideStep.Media>
                <MediaFigure
                  src="https://placehold.co/800x600/dbeafe/1e40af/png?text=Calibrate"
                />
              </GuideStep.Media>
              <GuideStep.Bullets>
                <GuideStep.Bullet variant="note">
                  Sit at your normal viewing distance for the best result.
                </GuideStep.Bullet>
              </GuideStep.Bullets>
            </GuideStep>
          </GuideStepList>
        </GuideLayout.Content>
      </GuideLayout>
    </div>
  ),
};
