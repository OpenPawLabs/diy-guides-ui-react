import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

/** Storybook-only Vite config — keeps library build settings out of Storybook. */
export default defineConfig({
  plugins: [tailwindcss()],
});
