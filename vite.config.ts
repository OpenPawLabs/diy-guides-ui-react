import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const TAILWIND_UTILITIES_LAYER = "@layer utilities{";
const LOWER_PRIORITY_LAYER = "@layer components{";

export function demoteTailwindUtilitiesLayer(css: string) {
  return css.replaceAll(TAILWIND_UTILITIES_LAYER, LOWER_PRIORITY_LAYER);
}

function demoteGeneratedTailwindUtilities(): Plugin {
  return {
    name: "diy-guides-ui:demote-generated-tailwind-utilities",
    writeBundle(options, bundle) {
      const styleAsset = Object.values(bundle).find(
        (asset) => asset.type === "asset" && asset.fileName === "style.css",
      );
      const outputDir = options.dir ?? (options.file ? dirname(options.file) : undefined);

      if (styleAsset?.type !== "asset" || !outputDir) {
        return;
      }

      const stylePath = resolve(outputDir, styleAsset.fileName);
      const css = readFileSync(stylePath, "utf8");
      writeFileSync(stylePath, demoteTailwindUtilitiesLayer(css));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), demoteGeneratedTailwindUtilities()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "DiyGuidesUi",
      formats: ["es", "cjs"],
      fileName: (format) =>
        format === "es" ? "diy-guides-ui.js" : "diy-guides-ui.cjs",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "online-3d-viewer"],
      output: {
        assetFileNames: "style.css",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
