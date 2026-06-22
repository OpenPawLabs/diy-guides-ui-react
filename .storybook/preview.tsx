import type { Preview } from "@storybook/react-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../src/styles/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "padded",
    options: {
      storySort: {
        order: [
          "Getting Started",
          [
            "Overview",
            "Installation",
            "Anatomy of a Guide",
            "Colors & callouts",
            "Writing Great Guides",
          ],
          "Guide",
          [
            "GuideLayout",
            "GuideStepList",
            "GuideStep",
            "MediaFigure",
            "ToolList",
            "Callout",
            "DifficultyBadge",
          ],
        ],
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
    (Story) => (
      <div className="min-h-[200px] bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default preview;
