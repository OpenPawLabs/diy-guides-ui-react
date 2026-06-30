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
    index.css              # Public design tokens + component CSS
    dev.css                # Storybook/dev Tailwind + HeroUI entry
  components/
    <ComponentName>/
      <ComponentName>.tsx
      <ComponentName>.stories.tsx   # Storybook stories (co-located)
      <ComponentName>.test.tsx      # Unit tests (co-located)
      index.ts                      # Barrel export for the component
  hooks/
    useControlledState.ts  # Controlled/uncontrolled state bridge
  types/
    colors.ts              # GuideColor palette (hex-backed)
    callout.ts             # CalloutType token + HeroUI color maps
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
| Shared types / design tokens | `src/types/` (e.g. `colors.ts`, `callout.ts`) |
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
| **Tailwind v4 only** | Use CSS-first config. No `tailwind.config.js`. |
| **Import order** | Consumer apps import Tailwind, `@source` the UI package, HeroUI styles, then `@openpawlabs/diy-guides-ui/styles`. Storybook imports `src/styles/dev.css`. |
| **Compound components** | Use dot notation: `Card.Header`, `Modal.Dialog`. |
| **Events** | Prefer `onPress` over `onClick` on interactive HeroUI components. |
| **Client components** | Add `"use client"` only when using state, effects, or event handlers in files that will be consumed by RSC apps. |

Docs: https://heroui.com/docs/react/getting-started/quick-start

## Storybook conventions

- Co-locate `*.stories.tsx` with components.
- Use `tags: ["autodocs"]` for documented components.
- Story groups (sidebar order is set by `storySort` in `.storybook/preview.tsx`):
  - `Getting Started/*` — narrative docs (Overview, Installation, Anatomy of a Guide, Severity, Writing Great Guides), authored as full-screen rendered pages in `src/stories/Welcome.stories.tsx`.
  - `Guide/*` — the guide components, each with a live API reference page.
- Dark mode: `withThemeByClassName` is configured in `.storybook/preview.tsx`; use the `dark` class on `html`/`body`.

### Documentation conventions

The autodocs prop tables come from prop JSDoc, but the human-facing explanation lives in story parameters. When adding or changing a component:

- Give the `meta` a `parameters.docs.description.component` string (Markdown) that covers **what it is, when to use it, key props/concepts** (tables welcome), and how it relates to other components. Reference the `Getting Started → Colors & callouts` page instead of re-explaining colors and callout types.
- Give each story a `parameters.docs.description.story` explaining what that example demonstrates.
- Keep one autodocs page per component. Document compound parts (e.g. `GuideStep.Media`, `GuideStep.Bullet`) **within** the parent component's page and example stories — do not create separate `*.Part.stories.tsx` files.
- Markdown in description strings is written in template literals, so escape backticks (`` \` ``) used for inline code and fenced examples.

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
@source "../node_modules/@openpawlabs/diy-guides-ui/dist";
@import "@heroui/styles";
@import "@openpawlabs/diy-guides-ui/styles";
```

`@openpawlabs/diy-guides-ui/styles` contains only library tokens and component
CSS. The consuming app owns Tailwind utility generation and must point
`@source` at the installed package `dist/` path relative to its stylesheet.

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

### Guide colors

`src/types/colors.ts` defines `COLORS` — a fixed palette of eight named hex values (`GREY`, `RED`, `ORANGE`, `YELLOW`, `GREEN`, `LIGHT_BLUE`, `BLUE`, `MAGENTA`) used to visually link `GuideStep.Bullet` dot markers to `MediaFigure` annotation markers. Colors are labels for parts/locations, not warning levels.

### Callout types

`src/types/callout.ts` defines `CalloutType` (`note · info · tip · caution · danger`) and maps each type to a `GuideColor` accent from the shared palette for the `Callout` component.

| Type | Guide color | Typical use |
|----------|-------------|-------------|
| `note` | `GREY` | neutral detail |
| `info` | `LIGHT_BLUE` | reversible / informational |
| `tip` | `GREEN` | helpful suggestion, reassembly |
| `caution` | `ORANGE` | minor hazard |
| `danger` | `RED` | serious hazard |

### Components

- **DifficultyBadge** — `<DifficultyBadge difficulty="moderate" />`. Color-coded pill (`GREEN` / `ORANGE` / `RED` from the guide palette) with an optional gauge icon.
- **Callout** — `<Callout type="danger" title="…">…</Callout>`. Wraps HeroUI `Alert`; `type` drives palette accent, default icon, and default title.
- **MediaFigure** — `<MediaFigure src annotations={[…]} />`. Fixed **4:3** frame; non-4:3 sources are center-cropped unless `displayRegion={{ x, y, width }}` selects a source-pixel 4:3 rect (height derived as `round(width × 3 / 4)`). Image/video with frame-percentage overlays. Put instructional copy in `GuideStep.Bullet` content, not on the figure. Annotation types: `point` (`x`, `y`, optional `label`), `circle` (`x`, `y`, `radius`), `rectangle` (`x1`, `y1`, `x2`, `y2`). Only `point` markers show a label; all types accept `color` and `title`. Image figures are `zoomable` by default — clicking opens the full-size source in a HeroUI `Modal` lightbox; set `zoomable={false}` to opt out (`GuideStep` does this in edit mode so the click opens the annotation editor instead). Pass `annotationEditing` (a `MediaAnnotationEditing` — controlled `tool` (`AnnotationTool`: `select` · `point` · `circle` · `rectangle`) and `color`, controlled `selectedId`, plus intent callbacks `onSelect` / `onAdd` / `onChange` / `onRemove`) to turn the figure into an interactive annotation canvas: click/drag to draw, click to select, drag the body to move, drag handles to resize, and `Delete` to remove (the lightbox is disabled while editing). The library owns all frame-percentage geometry and reports intent; it performs **no tool, color-picker, or persistence logic**, and editing relies on stable annotation `id`s. Its companion **MediaFigureThumbnail** (`<MediaFigureThumbnail src type />`) renders the source as a square image, or — for `video` / `model` sources, which have no still image — a colored placeholder (a play icon or "3D"); `GuideStep` uses it for gallery thumbnails so non-image media never appears broken. A second companion, **MediaCropEditor** (`<MediaCropEditor src region onChange />`), is the authoring counterpart to `displayRegion`: it shows the **full** source with a draggable, 4:3-locked selection and reports the chosen region in source pixels (defaulting to the centered region — i.e. the current center-crop — when none is set). Because `displayRegion` lives in source-pixel space while annotations are frame percentages, cropping is a separate tool, not part of `annotationEditing`. Pixel↔region math lives in `src/utils/mediaCrop.ts` (`displayRegionHeight`, `clampDisplayRegion`, `centeredDisplayRegion`, `MIN_REGION_WIDTH`, `DISPLAY_REGION_ASPECT`).
- **ToolList** + **ToolList.Item** — titled card listing tools/parts (`name`, `thumbnail`, `href`, `quantity`, `price`).
- **LinkButton** + **LinkButton.Item** — a download / navigation button with an optional dropdown of alternatives. Each `LinkButton.Item` carries `href`, optional `download` (a string renames the file), and `external`, with its label as `children`. One item renders a single button; multiple items render a split button — the first is the primary action and the rest sit behind a chevron (a `MediaFigure`-free reader experience). Pass an `editing` object of intent callbacks (`onAddItem` / `onRemoveItem` / `onReorderItem` / `onSelectItem`) to drive it from an authoring tool — the primary stops navigating, its label becomes editable in place, and the chevron opens an options panel. The library performs **no file or menu logic**.
- **GuideStep** + **GuideStep.Media** / **GuideStep.Bullets** / **GuideStep.Bullet** — a numbered step with a two-column body (main image left; hover thumbnails + bullets right). Bullets use `variant="dot"` with a `color` to link to image markers, semantic variants (`caution`, `reminder`, `note`) for inline warnings and notes, or `variant="button"` to drop the marker and render their children (typically a `LinkButton`) as a standalone download/link action. Up to **three** `MediaFigure`s in `.Media` share a fluid three-column thumbnail gallery — hover/focus a thumb to swap the main image. Stacks on viewports below `sm`. Completion is controllable (`isCompleted` / `onCompletedChange`) or uncontrolled (`defaultCompleted`).
  - **Editing affordances (optional, off by default):** the component stays presentational for readers, but three opt-in props let an external editor drive it without changing reader output. `GuideStep`'s `mediaEditing` (a `GuideStepMediaEditing` of intent callbacks — `onAddImage` / `onAddMediaFiles` / `onEditAnnotations` / `onEditCrop` / `onRemoveImage` / `onReorderImage` / `onSelectImage`, plus optional `activeIndex` / `canAddImage`) turns the media area into an editor: empty add target, an "Edit annotations" / "Adjust crop" overlay on the main image (firing `onEditAnnotations(index)` / `onEditCrop(index)` — the consumer opens the annotation or crop editor; "Adjust crop" only appears when `onEditCrop` is set), a remove control per thumbnail, drag-to-reorder thumbnails (when `onReorderImage` is set), and a "+" tile (the empty target and "+" tile accept file drag-and-drop when `onAddMediaFiles` is set). `GuideStep.Bullets`' `editing` (a `GuideStepBulletsEditing` of intent callbacks — `onAddBullet` / `onRemoveBullet` / `onReorderBullet`) turns the bullet list into an editor: a grip handle to drag-reorder (when `onReorderBullet` is set and more than one bullet exists), a remove control per bullet (hidden on the last remaining bullet to preserve the ≥1-bullet invariant), and a "+ New bullet" button. `GuideStep.Bullet`'s `onMarkerPress` turns the dot/semantic/button marker into a button (e.g. to open a color/variant picker). The library performs **no file or menu logic** — those belong to the consumer (see the authoring tool's step editor).
- **GuideStepList** — wraps `GuideStep`s; auto-numbers them, owns their completion state, and renders a derived progress bar. Listen via `onProgressChange`. By default keeps the page URL in sync with the visible step (`#step-N` hash, smooth scroll on load / hash change; scrolls to the guide top when no step is set). Opt out with `syncStepUrl={false}`. Scroll offsets split into a **parent** offset (`GuideLayout.scrollMarginTop`, plus optional `scrollMarginTop` on the list) and a **library** offset (measured sticky progress bar height, applied to steps only). The overview and steps share one visibility picker: `activeStepMinVisibleRatio` applies to the overview region (header, intro, sidebar) and each step alike, using each section's own content inset. Tune slug hand-off while scrolling with `activeStepMinVisibleRatio` (default `0.2`). The final step also wins when the reader reaches the **document** bottom (including any pager, footer, or other content below the guide) or has scrolled it into the primary reading position (its top at or above the step scroll margin). Scroll-driven sync listens to both `IntersectionObserver` and `scroll` events so the document-bottom rule still applies when intersection ratios stop changing.
- **GuideLayout** — page shell; pass `scrollMarginTop` (px) for fixed site chrome above the guide overview, sticky progress bar, and step deep links.
- **GuideLayout** + **GuideLayout.Header** / **GuideLayout.Intro** / **GuideLayout.Sidebar** / **GuideLayout.Content** — responsive page shell: full-width header (optional 4:3 `heroImage` left of the title on desktop), then intro copy beside tools/parts, then full-width steps. On mobile the intro row stacks (intro first, sidebar second).

### Conventions for new guide components

- Compose HeroUI primitives; expose compound parts with `Object.assign(Root, { Part })`.
- Reuse `GuideColor` for bullet/annotation linking and `CalloutType` for callout tone.
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
