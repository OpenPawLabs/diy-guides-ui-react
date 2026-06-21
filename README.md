# @openpawlabs/diy-guides-ui

Open-source React UI library for building **iFixit-style DIY guides** — step-by-step instructions with tools, warnings, and media.

## Status

Early infrastructure setup. Storybook, HeroUI, Vite library mode, and Vitest are configured. Guide components will be added in future tasks.

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
// Components will be exported from this package as they are implemented.
import "@openpawlabs/diy-guides-ui/styles";
```

## License

MIT — see [LICENSE](./LICENSE).
