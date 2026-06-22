# DIY Guides UI — Claude Code Guide

This file orients Claude (and other AI assistants) to the **@openpawlabs/diy-guides-ui** repository. For the full agent playbook, see [AGENTS.md](./AGENTS.md).

## Mission

Build an open-source React component library for **iFixit-style DIY guides**: step-by-step instructions, tool lists, safety warnings, and rich media. This repo is the **UI layer only** — consuming apps handle routing, auth, and data.

## Stack (do not change without explicit request)

- **pnpm** — package manager
- **React 19** + **TypeScript** (strict)
- **HeroUI v3** — `@heroui/react`, `@heroui/styles` (not NextUI v2)
- **Tailwind CSS v4** — CSS imports only, no `tailwind.config.js`
- **Vite** — library build (ESM + CJS)
- **Storybook 9** — component development (`pnpm dev`)
- **Vitest** + **RTL** — unit tests

## Before you code

1. Read [AGENTS.md](./AGENTS.md) for structure and conventions.
2. Run `pnpm install` if `node_modules` is missing.
3. Use `pnpm dev` to develop in Storybook, not a standalone app.

## Component workflow

```
src/components/MyComponent/
  MyComponent.tsx
  MyComponent.stories.tsx    # title: "Components/MyComponent" or "Guide/MyComponent"
  MyComponent.test.tsx
  index.ts
```

Then export from `src/index.ts`.

## HeroUI v3 essentials

```tsx
import { Button, Card } from "@heroui/react";

// Compound components
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Content>Body</Card.Content>
</Card>

// Prefer onPress, not onClick
<Button onPress={() => {}}>Action</Button>
```

- **No** `HeroUIProvider`
- **No** `@nextui-org/*`
- CSS entry: `src/styles/index.css` (Tailwind → HeroUI order matters)

## Verification before done

```bash
pnpm typecheck
pnpm test
pnpm build
```

Manually confirm new stories render in Storybook when UI changes are involved.

## Scope discipline

- Add only what the task requires.
- No app framework, API routes, or database code.
- No commits unless the user asks.

## `Guide/*` components (implemented)

GuideLayout, GuideStepList, GuideStep, MediaFigure, ToolList, Callout, DifficultyBadge — all built, tested, and documented in Storybook. They use a composition-first (compound) API. Guide colors live in `src/types/colors.ts`; callout types in `src/types/callout.ts`. See AGENTS.md for the full API reference and conventions before extending them.
