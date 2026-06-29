import type { Meta, StoryObj } from "@storybook/react-vite";
import { GuideStepList } from "./GuideStepList";
import { GuideStep } from "../GuideStep";
import { MediaFigure } from "../MediaFigure";

const componentDocs = `Wraps a sequence of \`GuideStep\`s and handles the bookkeeping so you can focus on
the instructions. Drop your steps in and it:

- **Numbers them** in order — you don't pass \`number\` to each step yourself.
- **Owns completion state** — each step's starting value comes from its own
  \`defaultCompleted\` / \`isCompleted\` prop, and toggling a checkbox updates the list.
- **Shows progress** — a bar derived from how many steps are complete.
- **Syncs the URL** — keeps \`#step-N\` (or \`?step=N\`) aligned with the step in
  view so readers can copy the address bar to share a deep link. Smooth-scrolls on
  load when the URL names a step; scrolls to the top of the guide when it does not.

## Props

- \`showProgress\` — toggle the progress bar (default \`true\`).
- \`onProgressChange\` — fires with \`{ completed, total }\` whenever the count
  changes. Use it to drive your app's own progress UI, persistence, or analytics.
- \`syncStepUrl\` — keep the page URL aligned with the visible step (default \`true\`).
- \`stepUrlMode\` — \`"hash"\` (\`#step-2\`) or \`"search"\` (\`?step=2\`); default \`"hash"\`.
- \`scrollMarginTop\` — extra top inset (px) beyond \`GuideLayout.stepScrollMarginTop\` and the measured sticky progress bar.
- \`activeStepMinVisibleRatio\` — fraction of step height that must remain visible to stay active (default \`0.2\`).
- \`onActiveStepChange\` — fires with the visible step number, or \`null\` at the guide top.`;

const meta = {
  title: "Guide/GuideStepList",
  component: GuideStepList,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: componentDocs } },
  },
  args: { children: null },
} satisfies Meta<typeof GuideStepList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Three steps, auto-numbered, with a progress bar above them. Check a step off to watch the bar update — the list owns that state.",
      },
    },
  },
  render: (args) => (
    <div className="max-w-4xl">
      <GuideStepList {...args}>
        <GuideStep title="Power down and open the case">
          <GuideStep.Media>
            <MediaFigure
              src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Open+case"
            />
            <MediaFigure
              src="https://raw.githubusercontent.com/kovacsv/Online3DViewer/master/test/testfiles/stl/stl_ascii.stl"
              type="model"
            />
          </GuideStep.Media>
          <GuideStep.Bullets>
            <GuideStep.Bullet variant="caution">
              Unplug the device and discharge any stored power first.
            </GuideStep.Bullet>
            <GuideStep.Bullet>Remove the four base screws.</GuideStep.Bullet>
          </GuideStep.Bullets>
        </GuideStep>
        <GuideStep title="Disconnect the battery">
          <GuideStep.Media>
            <MediaFigure
              src="https://placehold.co/800x600/fee2e2/b91c1c/png?text=Battery"
            />
          </GuideStep.Media>
          <GuideStep.Bullets>
            <GuideStep.Bullet variant="caution">
              Always disconnect the battery before touching the board.
            </GuideStep.Bullet>
          </GuideStep.Bullets>
        </GuideStep>
        <GuideStep title="Replace the component">
          <GuideStep.Media>
            <MediaFigure
              src="https://placehold.co/800x600/dbeafe/1e40af/png?text=Install"
            />
          </GuideStep.Media>
          <GuideStep.Bullets>
            <GuideStep.Bullet>Swap in the new part.</GuideStep.Bullet>
            <GuideStep.Bullet variant="note">
              Reassemble by following these steps in reverse.
            </GuideStep.Bullet>
          </GuideStep.Bullets>
        </GuideStep>
      </GuideStepList>
    </div>
  ),
};

export const WithStartingProgress: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Mark a step `defaultCompleted` and the list reflects it in the initial progress — handy when restoring a reader's place from saved state.",
      },
    },
  },
  render: (args) => (
    <div className="max-w-4xl">
      <GuideStepList {...args}>
        <GuideStep title="Already done" defaultCompleted>
          <GuideStep.Media>
            <MediaFigure
              src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Done"
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

export const WithoutProgressBar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Set `showProgress={false}` to hide the bar while keeping auto-numbering and completion. Pair it with `onProgressChange` to render progress your own way.",
      },
    },
  },
  render: (args) => (
    <div className="max-w-4xl">
      <GuideStepList {...args} showProgress={false}>
        <GuideStep title="First step">
          <GuideStep.Media>
            <MediaFigure
              src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Step+1"
            />
          </GuideStep.Media>
          <GuideStep.Bullets>
            <GuideStep.Bullet>No progress bar is shown here.</GuideStep.Bullet>
          </GuideStep.Bullets>
        </GuideStep>
        <GuideStep title="Second step">
          <GuideStep.Media>
            <MediaFigure
              src="https://placehold.co/800x600/dbeafe/1e40af/png?text=Step+2"
            />
          </GuideStep.Media>
          <GuideStep.Bullets>
            <GuideStep.Bullet>Steps are still numbered in order.</GuideStep.Bullet>
          </GuideStep.Bullets>
        </GuideStep>
      </GuideStepList>
    </div>
  ),
};
