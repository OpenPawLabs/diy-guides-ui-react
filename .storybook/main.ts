import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-themes"],
  framework: {
    name: "@storybook/react-vite",
    options: {
      viteConfigPath: ".storybook/vite.config.ts",
    },
  },
  docs: {
    autodocs: "tag",
  },
};

export default config;
