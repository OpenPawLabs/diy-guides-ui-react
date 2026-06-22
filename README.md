# @openpawlabs/diy-guides-ui

Open-source React UI library for building **iFixit-style DIY guides** — step-by-step instructions with tools, warnings, and media.

## Status

Active development. The core guide component set is implemented, tested, and documented in Storybook:

| Component | Purpose |
|-----------|---------|
| `GuideLayout` | Responsive page shell: header, intro + tools row, full-width steps |
| `GuideStepList` | Auto-numbered step sequence with a derived progress bar |
| `GuideStep` | A single step — number badge, completion checkbox, media, and bulleted instructions |
| `MediaFigure` | Image/video with caption and percentage-positioned annotation markers |
| `ToolList` | Titled card of required tools and parts |
| `WarningCallout` | Safety / informational callout (note → danger) |
| `DifficultyBadge` | Color-coded difficulty pill (easy / moderate / difficult) |

All tone is driven by a shared `GuideSeverity` token (`note · info · tip · caution · danger`) that maps onto HeroUI semantic colors, so step bullets, image annotations, and callouts stay visually consistent.

## Tech stack

- [React](https://react.dev/) 19 + TypeScript
- [HeroUI v3](https://heroui.com/) for accessible UI primitives
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Storybook](https://storybook.js.org/) for component development
- [Vite](https://vite.dev/) library mode for publishing
- [Vitest](https://vitest.dev/) + React Testing Library

## Getting started (development)

Requires [pnpm](https://pnpm.io/) 9+.

```bash
pnpm install
pnpm dev        # Storybook at http://localhost:6006
pnpm test       # Run tests
pnpm build      # Build library to dist/
```

## Project structure

```
src/
  components/     # One folder per component (tsx, stories, tests, index)
  hooks/          # Shared hooks (e.g. useControlledState)
  types/          # Shared design tokens (severity) and types
  styles/         # Tailwind + HeroUI CSS entry
  index.ts        # Public API exports
.storybook/       # Storybook configuration
```

See [AGENTS.md](./AGENTS.md) for contributor and AI agent conventions.

## Using in another app

```bash
pnpm add @openpawlabs/diy-guides-ui @heroui/react @heroui/styles tailwindcss
```

Import styles in your app CSS:

```css
@import "tailwindcss";
@import "@heroui/styles";
@import "@openpawlabs/diy-guides-ui/styles";
```

```tsx
import "@openpawlabs/diy-guides-ui/styles";
import {
  GuideLayout,
  GuideStepList,
  GuideStep,
  MediaFigure,
  ToolList,
  WarningCallout,
} from "@openpawlabs/diy-guides-ui";

export function BatteryGuide() {
  return (
    <GuideLayout>
      <GuideLayout.Header
        title="Replace a Smartphone Battery"
        difficulty="moderate"
        timeEstimate="20 – 30 minutes"
      />

      <GuideLayout.Intro>
        A worn battery drains fast and can swell. This guide covers a safe swap.
      </GuideLayout.Intro>

      <GuideLayout.Sidebar>
        <ToolList title="Tools">
          <ToolList.Item name="Pro Tech Toolkit" href="#" price="$67.96" />
        </ToolList>
      </GuideLayout.Sidebar>

      <GuideLayout.Content>
        <WarningCallout severity="danger" title="Battery safety">
          A punctured lithium battery can catch fire. Work slowly.
        </WarningCallout>
        <GuideStepList>
          <GuideStep title="Open the case">
            <GuideStep.Media>
              <MediaFigure
                src="/step-1.jpg"
                alt="Opening the case"
                annotations={[{ x: 50, y: 45, severity: "caution", label: 1 }]}
              />
            </GuideStep.Media>
            <GuideStep.Bullets>
              <GuideStep.Bullet severity="caution">
                Soften the adhesive with even heat before prying.
              </GuideStep.Bullet>
            </GuideStep.Bullets>
          </GuideStep>
        </GuideStepList>
      </GuideLayout.Content>
    </GuideLayout>
  );
}
```

## License

MIT — see [LICENSE](./LICENSE).
