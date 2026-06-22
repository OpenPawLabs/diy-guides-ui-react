import type { Meta, StoryObj } from "@storybook/react-vite";
import LinkTo from "@storybook/addon-links/react";
import type { ReactNode } from "react";
import { Callout } from "../components/Callout";
import { COLORS, type GuideColor } from "../types/colors";
import { calloutTypeLabel, type CalloutType } from "../types/callout";

const GETTING_STARTED = "Getting Started";

const gettingStartedPages = [
  { story: "Overview", label: "Overview" },
  { story: "Installation", label: "Installation" },
  { story: "Anatomy of a Guide", label: "Anatomy of a Guide" },
  { story: "Colors & callouts", label: "Colors & callouts" },
  { story: "WritingGreatGuides", label: "Writing Great Guides" },
] as const;

const guideComponentLinks = [
  {
    kind: "Guide/GuideLayout",
    story: "FullGuide",
    name: "GuideLayout",
    description: "Page shell with header, intro, sidebar, and content regions.",
  },
  {
    kind: "Guide/GuideStepList",
    story: "Default",
    name: "GuideStepList",
    description: "Numbered steps, completion tracking, and a progress bar.",
  },
  {
    kind: "Guide/GuideStep",
    story: "Anatomy",
    name: "GuideStep",
    description: "One step with media, thumbnails, and bulleted instructions.",
  },
  {
    kind: "Guide/MediaFigure",
    story: "WithPointAnnotations",
    name: "MediaFigure",
    description: "Annotated images and video in a fixed 4:3 frame.",
  },
  {
    kind: "Guide/ToolList",
    story: "Tools",
    name: "ToolList",
    description: "Tools and parts lists for the sidebar.",
  },
  {
    kind: "Guide/Callout",
    story: "AllTypes",
    name: "Callout",
    description: "Safety and context callouts by type.",
  },
  {
    kind: "Guide/DifficultyBadge",
    story: "AllLevels",
    name: "DifficultyBadge",
    description: "Easy, moderate, and difficult difficulty pills.",
  },
] as const;

/**
 * Narrative documentation for the library. These pages explain what DIY Guides
 * UI is, how to install it, how a guide is composed, the guide color palette
 * and callout types, and how to write guides people can actually follow.
 * Component-level API reference lives under the "Guide" section.
 */
const meta = {
  title: "Getting Started",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const installExample = `pnpm add @openpawlabs/diy-guides-ui @heroui/react @heroui/styles tailwindcss`;

const stylesExample = `@import "tailwindcss";
@import "@heroui/styles";
@import "@openpawlabs/diy-guides-ui/styles";`;

const importsExample = `import "@openpawlabs/diy-guides-ui/styles";
import {
  GuideLayout,
  GuideStepList,
  GuideStep,
  MediaFigure,
  ToolList,
  Callout,
} from "@openpawlabs/diy-guides-ui";`;

const guideExample = `<GuideLayout>
  <GuideLayout.Header
    title="Replace a Smartphone Battery"
    difficulty="moderate"
    timeEstimate="20-30 minutes"
    meta="Updated Jun 2026"
  />

  <GuideLayout.Intro>
    A worn battery drains fast and can swell. This guide walks through a
    safe replacement using common repair tools.
  </GuideLayout.Intro>

  <GuideLayout.Sidebar>
    <ToolList title="Tools">
      <ToolList.Item name="Pro Tech Toolkit" href="#" price="$67.96" />
      <ToolList.Item name="iOpener" price="$14.99" />
    </ToolList>
    <ToolList title="Parts">
      <ToolList.Item name="Replacement battery" quantity={1} />
    </ToolList>
  </GuideLayout.Sidebar>

  <GuideLayout.Content>
    <Callout type="danger" title="Battery safety">
      Do not puncture or bend the battery. A damaged lithium cell can ignite.
    </Callout>

    <GuideStepList>
      <GuideStep title="Soften the adhesive">
        <GuideStep.Media>
          <MediaFigure
            src="/guides/battery-heat.jpg"
            annotations={[{ x: 54, y: 42, color: "ORANGE", label: 1 }]}
          />
        </GuideStep.Media>
        <GuideStep.Bullets>
          <GuideStep.Bullet color="ORANGE">
            Heat the edge evenly for about a minute before prying.
          </GuideStep.Bullet>
          <GuideStep.Bullet>
            Slide a pick under the back cover and release the clips.
          </GuideStep.Bullet>
        </GuideStep.Bullets>
      </GuideStep>
    </GuideStepList>
  </GuideLayout.Content>
</GuideLayout>`;

const layers = [
  {
    group: "The shell",
    items: [
      {
        name: "GuideLayout",
        description:
          "The page frame: header, intro, a tools/parts sidebar, and the full-width content column. Start here.",
        kind: "Guide/GuideLayout",
        story: "FullGuide",
      },
    ],
  },
  {
    group: "The step sequence",
    items: [
      {
        name: "GuideStepList",
        description:
          "Wraps your steps. Numbers them in order, tracks completion, and shows a progress bar — automatically.",
        kind: "Guide/GuideStepList",
        story: "Default",
      },
      {
        name: "GuideStep",
        description:
          "One step: a numbered header, a main image with optional thumbnails, and bulleted instructions beside it.",
        kind: "Guide/GuideStep",
        story: "Anatomy",
      },
      {
        name: "MediaFigure",
        description:
          "The image or video for a step, with markers that point at the exact spot to work on.",
        kind: "Guide/MediaFigure",
        story: "WithPointAnnotations",
      },
    ],
  },
  {
    group: "Supporting blocks",
    items: [
      {
        name: "ToolList",
        description:
          "The \u201cwhat you need\u201d card. Use one list for tools and another for parts.",
        kind: "Guide/ToolList",
        story: "Tools",
      },
      {
        name: "Callout",
        description:
          "Safety and context callouts, styled by type, for moments that need extra attention.",
        kind: "Guide/Callout",
        story: "AllTypes",
      },
      {
        name: "DifficultyBadge",
        description:
          "A small easy / moderate / difficult pill. GuideLayout.Header renders one for you.",
        kind: "Guide/DifficultyBadge",
        story: "AllLevels",
      },
    ],
  },
];

const calloutTypes: {
  type: CalloutType;
  usedFor: string;
  example: string;
}[] = [
  {
    type: "note",
    usedFor: "Neutral detail worth calling out.",
    example: "Keep screws grouped — they are not all the same length.",
  },
  {
    type: "info",
    usedFor: "Context that changes how a step is understood; reversible actions.",
    example: "This step is reversible — you can stop here and reassemble.",
  },
  {
    type: "tip",
    usedFor: "A shortcut, reassembly hint, or optional improvement.",
    example: "A guitar pick releases the clips without scratching the case.",
  },
  {
    type: "caution",
    usedFor: "A moderate hazard: adhesive, sharp edges, fragile clips.",
    example: "The adhesive is strong. Apply gentle, even heat before prying.",
  },
  {
    type: "danger",
    usedFor: "A serious hazard: fire, shock, chemicals, or injury.",
    example: "Do not puncture the battery. A damaged cell can ignite.",
  },
];

const guideColors = Object.entries(COLORS) as [GuideColor, string][];

function Page({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-10 sm:px-8 lg:px-10">
        {children}
      </div>
    </main>
  );
}

function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <header className="flex max-w-3xl flex-col gap-4">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">
        {eyebrow}
      </p>
      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
      <p className="text-lg leading-8 text-default-600">{children}</p>
    </header>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="max-w-3xl text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="max-w-3xl text-base leading-7 text-default-600">
        {children}
      </div>
    </section>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-default bg-default-soft p-4 text-sm leading-6 text-foreground">
      <code>{children}</code>
    </pre>
  );
}

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-default-soft px-1.5 py-0.5 text-[0.9em] text-foreground">
      {children}
    </code>
  );
}

const storyLinkAnchorClass =
  "[&>a]:font-medium [&>a]:text-accent [&>a]:underline-offset-2 [&>a]:hover:underline [&>a]:focus-visible:outline-none [&>a]:focus-visible:ring-2 [&>a]:focus-visible:ring-accent";

function StoryLink({
  kind,
  story,
  children,
  className,
}: {
  kind: string;
  story: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={className ?? storyLinkAnchorClass}>
      <LinkTo kind={kind} story={story}>
        {children}
      </LinkTo>
    </span>
  );
}

function GettingStartedNav({ current }: { current: (typeof gettingStartedPages)[number]["story"] }) {
  return (
    <nav aria-label="Getting Started" className="flex flex-wrap gap-2">
      {gettingStartedPages.map(({ story, label }) =>
        story === current ? (
          <span
            key={story}
            aria-current="page"
            className="rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent"
          >
            {label}
          </span>
        ) : (
          <StoryLink
            key={story}
            kind={GETTING_STARTED}
            story={story}
            className="rounded-full border border-default bg-content1 px-3 py-1 text-sm font-medium transition-colors [&>a]:text-foreground [&>a]:no-underline hover:border-accent hover:bg-accent-soft [&>a]:hover:text-accent"
          >
            {label}
          </StoryLink>
        ),
      )}
    </nav>
  );
}

function PageFooter({ current }: { current: (typeof gettingStartedPages)[number]["story"] }) {
  const index = gettingStartedPages.findIndex((page) => page.story === current);
  const previous = index > 0 ? gettingStartedPages[index - 1] : null;
  const next = index < gettingStartedPages.length - 1 ? gettingStartedPages[index + 1] : null;

  if (!previous && !next) return null;

  return (
    <footer className="flex flex-col gap-3 border-t border-default pt-8 sm:flex-row sm:items-center sm:justify-between">
      {previous ? (
        <StoryLink
          kind={GETTING_STARTED}
          story={previous.story}
          className="text-sm [&>a]:text-default-600 [&>a]:no-underline [&>a]:hover:text-accent [&>a]:hover:underline"
        >
          ← {previous.label}
        </StoryLink>
      ) : (
        <span />
      )}
      {next ? (
        <StoryLink
          kind={GETTING_STARTED}
          story={next.story}
          className="text-sm sm:text-right [&>a]:text-default-600 [&>a]:no-underline [&>a]:hover:text-accent [&>a]:hover:underline"
        >
          {next.label} →
        </StoryLink>
      ) : null}
    </footer>
  );
}

function GuideComponentIndex() {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="max-w-3xl text-2xl font-semibold tracking-tight">
        Explore the components
      </h2>
      <p className="max-w-3xl text-base leading-7 text-default-600">
        Each component has live examples and a props reference under the{" "}
        <span className="font-medium text-foreground">Guide</span> section.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {guideComponentLinks.map(({ kind, story, name, description }) => (
          <article
            key={name}
            className="rounded-lg border border-default bg-content1 p-4 transition-colors hover:border-accent"
          >
            <h3 className="font-semibold">
              <StoryLink kind={kind} story={story}>
                {name}
              </StoryLink>
            </h3>
            <p className="mt-2 text-sm leading-6 text-default-600">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export const Overview: Story = {
  render: () => (
    <Page>
      <GettingStartedNav current="Overview" />

      <header className="flex max-w-3xl flex-col gap-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">
          DIY Guides UI
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          React components for clear, step-by-step DIY guides.
        </h1>
        <p className="text-lg leading-8 text-default-600">
          DIY Guides UI gives repair and maker projects the UI pieces to teach a
          real task: guide pages, tool lists, safety callouts, annotated media,
          numbered steps, and progress. It is the presentation layer only —
          your app keeps routing, data, auth, search, and publishing.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-default bg-content1 p-5">
          <h2 className="font-semibold">Human first</h2>
          <p className="mt-2 text-sm leading-6 text-default-600">
            Components follow how someone actually works through a guide:
            prepare, understand the risks, look at the picture, then act.
          </p>
        </article>
        <article className="rounded-xl border border-default bg-content1 p-5">
          <h2 className="font-semibold">Composition first</h2>
          <p className="mt-2 text-sm leading-6 text-default-600">
            Guides are written with dot-notation parts like{" "}
            <InlineCode>GuideStep.Media</InlineCode> and{" "}
            <InlineCode>ToolList.Item</InlineCode>, so the markup reads like the
            finished page.
          </p>
        </article>
        <article className="rounded-xl border border-default bg-content1 p-5">
          <h2 className="font-semibold">App agnostic</h2>
          <p className="mt-2 text-sm leading-6 text-default-600">
            Built on React, TypeScript, HeroUI, and Tailwind CSS. Drop it into
            any React app that can load the package styles.
          </p>
        </article>
      </div>

      <Section title="How to read these docs">
        <p>Work through this section top to bottom:</p>
        <ol className="mt-4 list-decimal space-y-2 pl-5">
          <li>
            <StoryLink kind={GETTING_STARTED} story="Installation">
              Installation
            </StoryLink>{" "}
            — add the package and load its styles.
          </li>
          <li>
            <StoryLink kind={GETTING_STARTED} story="Anatomy of a Guide">
              Anatomy of a Guide
            </StoryLink>{" "}
            — see how the components nest into a full page.
          </li>
          <li>
            <StoryLink kind={GETTING_STARTED} story="Colors & callouts">
              Colors &amp; callouts
            </StoryLink>{" "}
            — guide colors for linking bullets to images, and callout types for
            safety tone.
          </li>
          <li>
            <StoryLink kind={GETTING_STARTED} story="WritingGreatGuides">
              Writing Great Guides
            </StoryLink>{" "}
            — practical advice for clear, trustworthy steps.
          </li>
        </ol>
        <p className="mt-4">
          Then explore each component under the{" "}
          <span className="font-medium text-foreground">Guide</span> section for
          live examples and a full props reference — or jump straight to the{" "}
          <StoryLink kind="Guide/GuideLayout" story="FullGuide">
            full guide example
          </StoryLink>
          .
        </p>
      </Section>

      <Section title="When to use it">
        <p>
          Reach for DIY Guides UI when the UI itself has to teach: instructions
          that mix explanation, media, safety, tools, and a specific order. It
          fits hardware repair, maintenance, maker projects, teardown notes, and
          internal service procedures. It is not a CMS, router, or database —
          store guide data wherever your app already does and render it through
          these components.
        </p>
      </Section>

      <GuideComponentIndex />
      <PageFooter current="Overview" />
    </Page>
  ),
};

export const Installation: Story = {
  render: () => (
    <Page>
      <GettingStartedNav current="Installation" />

      <PageHeader eyebrow="Installation" title="Add the library to a React app.">
        The package ships components, TypeScript types, and bundled styles. React
        and React DOM are peer dependencies, so your app provides them.
      </PageHeader>

      <Section title="1. Install the package and its UI dependencies">
        <CodeBlock>{installExample}</CodeBlock>
        <p className="mt-3">
          HeroUI and Tailwind CSS power the components&apos; look and behavior,
          so they install alongside the library.
        </p>
      </Section>

      <Section title="2. Load styles once, in the right order">
        <p>
          In your app&apos;s global stylesheet, import Tailwind first, then
          HeroUI, then the library. Order matters — HeroUI&apos;s tokens build on
          Tailwind, and the library builds on both.
        </p>
        <div className="mt-4">
          <CodeBlock>{stylesExample}</CodeBlock>
        </div>
        <p className="mt-3">
          There is no provider to add. Import components directly and they work.
        </p>
      </Section>

      <Section title="3. Import the components you need">
        <CodeBlock>{importsExample}</CodeBlock>
        <p className="mt-4">
          Next, see how those pieces fit together in{" "}
          <StoryLink kind={GETTING_STARTED} story="Anatomy of a Guide">
            Anatomy of a Guide
          </StoryLink>
          , or open the{" "}
          <StoryLink kind="Guide/GuideLayout" story="FullGuide">
            full guide example
          </StoryLink>
          .
        </p>
      </Section>

      <PageFooter current="Installation" />
    </Page>
  ),
};

export const AnatomyOfAGuide: Story = {
  name: "Anatomy of a Guide",
  render: () => (
    <Page>
      <GettingStartedNav current="Anatomy of a Guide" />

      <PageHeader eyebrow="Anatomy" title="A guide is built from readable parts.">
        The API mirrors the finished page, so a guide reads like an outline:
        title, context, what you need, warnings, then the steps. Here is a
        complete page and the role each piece plays.
      </PageHeader>

      <CodeBlock>{guideExample}</CodeBlock>

      <Section title="The pieces, by role">
        <div className="flex flex-col gap-6">
          {layers.map((layer) => (
            <div key={layer.group} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">
                {layer.group}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {layer.items.map((item) => (
                  <article
                    key={item.name}
                    className="rounded-lg border border-default bg-content1 p-4 transition-colors hover:border-accent"
                  >
                    <h4 className="font-semibold">
                      <StoryLink kind={item.kind} story={item.story}>
                        {item.name}
                      </StoryLink>
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-default-600">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <p className="max-w-3xl text-base leading-7 text-default-600">
        See the pieces working together in{" "}
        <StoryLink kind="Guide/GuideLayout" story="FullGuide">
          GuideLayout → Full guide
        </StoryLink>
        . For color linking and safety tone, continue to{" "}
        <StoryLink kind={GETTING_STARTED} story="Colors & callouts">
          Colors &amp; callouts
        </StoryLink>
        .
      </p>

      <PageFooter current="Anatomy of a Guide" />
    </Page>
  ),
};

export const ColorsAndCallouts: Story = {
  name: "Colors & callouts",
  render: () => (
    <Page>
      <GettingStartedNav current="Colors & callouts" />

      <PageHeader
        eyebrow="Shared language"
        title="Two systems: colors for linking, types for tone."
      >
        Guide colors link step bullet dots to image annotation markers — useful
        when several parts or locations share one photo. Callout types express
        safety and informational tone in standalone callout boxes. They are
        separate on purpose.
      </PageHeader>

      <Section title="Guide colors">
        <p>
          Use a <InlineCode>color</InlineCode> on both a{" "}
          <StoryLink kind="Guide/MediaFigure" story="WithPointAnnotations">
            MediaFigure
          </StoryLink>{" "}
          annotation and its matching{" "}
          <StoryLink kind="Guide/GuideStep" story="Dot bullets">
            GuideStep.Bullet
          </StoryLink>{" "}
          so the reader connects the instruction to the spot on the photo. Pick any name from the palette —
          the color is a label, not a warning level.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {guideColors.map(([name, hex]) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-lg border border-default bg-content1 p-3"
            >
              <span
                aria-hidden="true"
                className="size-6 shrink-0 rounded-full"
                style={{ backgroundColor: hex }}
              />
              <div className="flex flex-col">
                <span className="font-semibold">{name}</span>
                <code className="text-xs text-default-500">{hex}</code>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4">
          Example: three screw lengths in one image might use{" "}
          <InlineCode>RED</InlineCode>, <InlineCode>BLUE</InlineCode>, and{" "}
          <InlineCode>GREEN</InlineCode> — each bullet dot matches its marker.
        </p>
      </Section>

      <Section title="Callout types">
        <p>
          <StoryLink kind="Guide/Callout" story="AllTypes">
            Callout
          </StoryLink>{" "}
          uses a <InlineCode>type</InlineCode> prop for safety and informational tone. Each type maps to a palette
          accent color and default title.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          {calloutTypes.map(({ type, usedFor, example }) => (
            <div
              key={type}
              className="grid gap-4 rounded-lg border border-default bg-content1 p-4 md:grid-cols-[10rem_1fr]"
            >
              <div className="flex flex-col">
                <span className="font-semibold">{calloutTypeLabel[type]}</span>
                <code className="text-xs text-default-500">{type}</code>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-sm leading-6 text-default-600">{usedFor}</p>
                <Callout type={type}>{example}</Callout>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Why the split matters">
        <p>
          A red dot on a screw is not necessarily a danger warning — it might
          just mean &ldquo;this is the 4 mm screw.&rdquo; Reserve callout types
          for moments that need a safety or context box, and use guide colors
          when you need the reader to match words to a place on the image.
        </p>
        <p className="mt-4">
          For inline warnings inside a step, use semantic bullet variants —{" "}
          <InlineCode>variant="caution"</InlineCode>,{" "}
          <InlineCode>variant="reminder"</InlineCode>, or{" "}
          <InlineCode>variant="note"</InlineCode> — instead of a colored dot. See{" "}
          <StoryLink kind="Guide/GuideStep" story="Semantic bullets">
            GuideStep → Semantic bullets
          </StoryLink>
          .
        </p>
      </Section>

      <PageFooter current="Colors & callouts" />
    </Page>
  ),
};

export const WritingGreatGuides: Story = {
  render: () => (
    <Page>
      <GettingStartedNav current="WritingGreatGuides" />

      <PageHeader
        eyebrow="Authoring"
        title="Make each step easy to trust and easy to follow."
      >
        The components provide structure; clear writing does the rest. Keep each
        step focused, connect the words to the picture, and save strong warnings
        for the moments that change what the reader does.
      </PageHeader>

      <Section title="Step structure">
        <ul className="list-disc space-y-3 pl-5">
          <li>Use one step for one meaningful action or decision.</li>
          <li>
            Lead with the action, then the detail: &ldquo;Disconnect the battery
            before&hellip;&rdquo; rather than burying it mid-sentence.
          </li>
          <li>
            Prefer concrete verbs — lift, slide, disconnect, remove, inspect,
            align, tighten.
          </li>
        </ul>
      </Section>

      <Section title="Media and annotations">
        <ul className="list-disc space-y-3 pl-5">
          <li>
            Write bullets that describe what the reader should look for in each
            image.
          </li>
          <li>
            Use point markers for precise spots, circles for areas, and
            rectangles for zones such as a row of clips or an adhesive strip — see{" "}
            <StoryLink kind="Guide/MediaFigure" story="WithShapeAnnotations">
              MediaFigure → Shape annotations
            </StoryLink>
            .
          </li>
          <li>
            Match a marker&apos;s <InlineCode>color</InlineCode> to its bullet
            so the reader can connect the instruction to the exact place on the
            photo — see{" "}
            <StoryLink kind="Guide/GuideStep" story="Dot bullets">
              GuideStep → Dot bullets
            </StoryLink>
            .
          </li>
        </ul>
      </Section>

      <Section title="Safety and tone">
        <ul className="list-disc space-y-3 pl-5">
          <li>
            Put safety information before the action that creates the risk, not
            after it.
          </li>
          <li>
            Reserve <InlineCode>type="danger"</InlineCode> on callouts for
            genuine hazards; use <InlineCode>type="caution"</InlineCode> for
            ordinary care — compare types in{" "}
            <StoryLink kind="Guide/Callout" story="AllTypes">
              Callout → All types
            </StoryLink>
            .
          </li>
          <li>
            Keep tool and part names specific enough that a reader can gather
            everything before they start — model lists in{" "}
            <StoryLink kind="Guide/ToolList" story="Tools">
              ToolList
            </StoryLink>
            .
          </li>
        </ul>
      </Section>

      <GuideComponentIndex />
      <PageFooter current="WritingGreatGuides" />
    </Page>
  ),
};
