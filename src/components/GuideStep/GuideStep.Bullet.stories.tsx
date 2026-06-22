import type { Meta, StoryObj } from "@storybook/react-vite";
import { GuideStep } from "./GuideStep";
import { MediaFigure } from "../MediaFigure";

const meta = {
  title: "Guide/GuideStep/Bullet",
  component: GuideStep.Bullet,
  tags: ["autodocs"],
  args: {
    children: "Instruction text goes here.",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A single instruction line inside `GuideStep.Bullets`. Every `GuideStep` requires both `GuideStep.Media` and at least one bullet. Use `variant=\"color\"` with `severity` to match `MediaFigure` annotation markers, or `caution`, `reminder`, and `note` for iFixit-style semantic bullets.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <GuideStep number={1} title="Bullet examples" completable={false}>
          <GuideStep.Media>
            <MediaFigure
              src="https://placehold.co/800x600/e2e8f0/1e293b/png?text=Step"
              alt="Step illustration"
            />
          </GuideStep.Media>
          <GuideStep.Bullets>
            <Story />
          </GuideStep.Bullets>
        </GuideStep>
      </div>
    ),
  ],
} satisfies Meta<typeof GuideStep.Bullet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ColorBullets: Story = {
  name: "Color (severity dots)",
  render: () => (
    <>
      <GuideStep.Bullet severity="danger">
        Red marker — links to a danger annotation on the step image.
      </GuideStep.Bullet>
      <GuideStep.Bullet severity="caution">
        Amber marker — links to a caution annotation.
      </GuideStep.Bullet>
      <GuideStep.Bullet severity="tip">
        Green marker — links to a tip annotation.
      </GuideStep.Bullet>
      <GuideStep.Bullet severity="info">
        Accent marker — links to an info annotation.
      </GuideStep.Bullet>
      <GuideStep.Bullet>
        Default note marker — neutral grey dot.
      </GuideStep.Bullet>
    </>
  ),
};

export const Caution: Story = {
  render: () => (
    <GuideStep.Bullet variant="caution">
      Do not pry near the battery — it can puncture and ignite.
    </GuideStep.Bullet>
  ),
};

export const Reminder: Story = {
  render: () => (
    <GuideStep.Bullet variant="reminder">
      Reconnect the display cable before closing the case.
    </GuideStep.Bullet>
  ),
};

export const Note: Story = {
  render: () => (
    <GuideStep.Bullet variant="note">
      The adhesive will lose tack after the first removal — order replacements
      before reassembly.
    </GuideStep.Bullet>
  ),
};

export const AllVariants: Story = {
  name: "All variants",
  render: () => (
    <>
      <GuideStep.Bullet severity="danger">
        These are colored bullets that correspond with the markers in the media
        figure.
      </GuideStep.Bullet>
      <GuideStep.Bullet variant="caution">
        This bullet is used to indicate when something is particularly important
        or dangerous.
      </GuideStep.Bullet>
      <GuideStep.Bullet variant="reminder">
        This bullet reminds workers of something in the process that they might
        otherwise forget.
      </GuideStep.Bullet>
      <GuideStep.Bullet variant="note">
        This bullet indicates information that is additional noteworthy
        information.
      </GuideStep.Bullet>
    </>
  ),
};

export const CustomLabel: Story = {
  render: () => (
    <GuideStep.Bullet variant="caution" label="High voltage">
      Disconnect the power supply before opening the enclosure.
    </GuideStep.Bullet>
  ),
};

export const HiddenLabel: Story = {
  render: () => (
    <GuideStep.Bullet variant="note" hideLabel>
      Supplemental detail without the auto-generated &ldquo;Note:&rdquo; prefix.
    </GuideStep.Bullet>
  ),
};
