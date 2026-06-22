# DIY Guides UI — Agent Guide

React UI library for building **open-source, iFixit-style diy guides** that walk users through tasks step by step. This repository is infrastructure-first: React, Storybook, HeroUI v3, Vite library mode, and Vitest are configured so future work can focus on components.

## Quick reference

| Item | Value |
|------|-------|
| Package name | `@openpawlabs/diy-guides-ui` |
| Package manager | **pnpm** (required) |
| UI framework | **HeroUI v3** (`@heroui/react`, `@heroui/styles`) |
| Styling | **Tailwind CSS v4** (CSS-first config, no `tailwind.config.js`) |
| Dev environment | **Storybook** (`pnpm dev`) |
| Build | **Vite library mode** → ESM + CJS in `dist/` |
| Tests | **Vitest** + React Testing Library |

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Storybook on http://localhost:6006
pnpm build            # Typecheck + library bundle to dist/
pnpm build:storybook  # Static Storybook to storybook-static/
pnpm test             # Run unit tests once
pnpm test:watch       # Vitest in watch mode
pnpm typecheck        # TypeScript only
pnpm lint             # ESLint
```

## Repository layout

```
src/
  index.ts                 # Public API — re-export all published components
  styles/
    index.css              # Tailwind + HeroUI imports (required by consumers)
  components/
    <ComponentName>/
      <ComponentName>.tsx
      <ComponentName>.stories.tsx   # Storybook stories (co-located)
      <ComponentName>.test.tsx      # Unit tests (co-located)
      index.ts                      # Barrel export for the component
  hooks/
    useControlledState.ts  # Controlled/uncontrolled state bridge
  types/
    severity.ts            # GuideSeverity token + HeroUI color maps
  stories/
    Welcome.stories.tsx    # Foundation / onboarding stories only
  test/
    setup.ts               # Vitest global setup
.storybook/
  main.ts                  # Storybook config
  preview.tsx              # Global decorators, theme, CSS imports
  vite.config.ts           # Storybook-only Vite config (Tailwind; no library plugins)
```

### Where to put new work

| Task | Location |
|------|----------|
| New guide component | `src/components/<Name>/` |
| Public export | Add to `src/index.ts` |
| Shared types / design tokens | `src/types/` (e.g. `severity.ts`) |
| Shared hooks | `src/hooks/` (e.g. `useControlledState.ts`) |
| Shared utilities | `src/utils/` (create when needed) |
| Design tokens / theme overrides | `src/styles/index.css` (`@theme` block) |

**Do not** add application routing, data fetching, or backend code here. This is a **component library**, not a full app.

## Adding a component (checklist)

1. Create `src/components/<ComponentName>/` with `.tsx`, `.stories.tsx`, `.test.tsx`, and `index.ts`.
2. Export the component from `src/index.ts`.
3. Use HeroUI primitives where they fit; wrap or compose for guide-specific UX.
4. Story title: `Components/<ComponentName>` (or `Guide/<Name>` for domain-specific groups).
5. Run `pnpm test`, `pnpm typecheck`, and verify in Storybook (`pnpm dev`).

## HeroUI v3 rules

HeroUI v3 differs from v2. Follow these strictly:

| Rule | Detail |
|------|--------|
| **No global Provider** | Do not add `HeroUIProvider`. Import components directly. |
| **No NextUI imports** | Never use `@nextui-org/*` — that is the old library. |
| **Tailwind v4 only** | Use `@import "tailwindcss"` in CSS. No `tailwind.config.js`. |
| **Import order** | Tailwind first, then `@import "@heroui/styles"` in `src/styles/index.css`. |
| **Compound components** | Use dot notation: `Card.Header`, `Modal.Dialog`. |
| **Events** | Prefer `onPress` over `onClick` on interactive HeroUI components. |
| **Client components** | Add `"use client"` only when using state, effects, or event handlers in files that will be consumed by RSC apps. |

Docs: https://heroui.com/docs/react/getting-started/quick-start

## Storybook conventions

- Co-locate `*.stories.tsx` with components.
- Use `tags: ["autodocs"]` for documented components.
- Story groups:
  - `Foundation/*` — setup, tokens, welcome content
  - `Components/*` — generic UI building blocks
  - `Guide/*` — iFixit-style guide primitives (steps, tools, warnings, media)
- Dark mode: `withThemeByClassName` is configured in `.storybook/preview.tsx`; use the `dark` class on `html`/`body`.

**Storybook Vite isolation:** Storybook uses `.storybook/vite.config.ts` (Tailwind only). Do **not** merge the root `vite.config.ts` library plugins into Storybook — `@storybook/react-vite` already registers `@vitejs/plugin-react`, and duplicating it causes `inWebWorker` / `prevRefreshReg` transform errors.

## Library build & consumption

The package builds to `dist/` with:

- `diy-guides-ui.js` (ESM)
- `diy-guides-ui.cjs` (CJS)
- `index.d.ts` (types, via `tsc` after Vite bundle)
- `style.css` (bundled styles)

Build command: `vite build && tsc -b tsconfig.app.json`. Do not add `vite-plugin-dts` alongside an empty entry — use `tsc` for declarations until components are exported.

Consumers install:

```bash
pnpm add @openpawlabs/diy-guides-ui @heroui/react @heroui/styles tailwindcss
```

They must import styles in their app entry:

```css
@import "tailwindcss";
@import "@heroui/styles";
@import "@openpawlabs/diy-guides-ui/styles";
```

React and React DOM are **peer dependencies** — the host app provides them.

## Testing standards

- One `*.test.tsx` per component, co-located.
- Use React Testing Library; query by role/label before `data-testid`.
- `data-testid` is acceptable for non-semantic containers.
- Run `pnpm test` before finishing any component task.

## Code style

- TypeScript strict mode; explicit prop interfaces exported alongside components.
- Functional components only.
- Prefer named exports; barrel through `index.ts` per component folder.
- Keep components focused — extract hooks for reusable logic.
- Match existing formatting; do not drive-by refactor unrelated files.
- Minimize scope: smallest correct change for the task at hand.

## Domain components

The `Guide/*` set is implemented under `src/components/` and exported from `src/index.ts`. They follow a **composition-first** API (compound components via dot notation) modeled on iFixit guide UX.

### Shared severity token

`src/types/severity.ts` defines `GuideSeverity` (`note · info · tip · caution · danger`) and maps it onto HeroUI semantic colors. It is the single source of tone for step bullets, image annotations, and callouts — reuse it instead of hardcoding colors.

| Severity | HeroUI color | Typical use |
|----------|--------------|-------------|
| `note` | default | neutral instruction |
| `info` | accent | reversible / informational |
| `tip` | success | helpful suggestion, reassembly |
| `caution` | warning | minor hazard |
| `danger` | danger | serious hazard |

### Components

- **DifficultyBadge** — `<DifficultyBadge difficulty="moderate" />`. Color-coded pill (easy → green, moderate → amber, difficult → red) with an optional gauge icon.
- **WarningCallout** — `<WarningCallout severity="danger" title="…">…</WarningCallout>`. Wraps HeroUI `Alert`; `severity` drives status, default icon, and default title.
- **MediaFigure** — `<MediaFigure src alt caption annotations={[{ x, y, severity, label }]} />`. Image/video with caption and percentage-positioned markers (colors come from severity).
- **ToolList** + **ToolList.Item** — titled card listing tools/parts (`name`, `thumbnail`, `href`, `quantity`, `price`).
- **GuideStep** + **GuideStep.Media** / **GuideStep.Bullets** / **GuideStep.Bullet** — a numbered step with a two-column body (main image left; hover thumbnails + bullets right). Up to **three** `MediaFigure`s in `.Media` share a thumbnail gallery — hover/focus a thumb to swap the main image. Stacks on viewports below `sm`. Completion is controllable (`isCompleted` / `onCompletedChange`) or uncontrolled (`defaultCompleted`).
- **GuideStepList** — wraps `GuideStep`s; auto-numbers them, owns their completion state, and renders a derived progress bar. Listen via `onProgressChange`.
- **GuideLayout** + **GuideLayout.Header** / **GuideLayout.Intro** / **GuideLayout.Sidebar** / **GuideLayout.Content** — responsive page shell: full-width header, then intro copy beside tools/parts, then full-width steps. On mobile the intro row stacks (intro first, sidebar second).

### Conventions for new guide components

- Compose HeroUI primitives; expose compound parts with `Object.assign(Root, { Part })`.
- Reuse `GuideSeverity` for any tone/color decision.
- Add `"use client"` only to components that use state, effects, or handlers (e.g. `GuideStep`, `GuideStepList`).
- Keep media/positional data as props (e.g. `annotations`); keep structure as composable children.

## What not to do

- Do not commit secrets or `.env` files.
- Do not add Next.js, Remix, or other full-framework app code to this repo.
- Do not downgrade to HeroUI v2 or Tailwind v3.
- Do not create commits unless the user explicitly asks.
- Do not expand scope beyond the requested task.

## Related files

- `CLAUDE.md` — same guidance formatted for Claude Code
- `README.md` — human-facing project overview
