# Building with @jimdo/ui (JUI)

**JUI** (`@jimdo/ui`) is Jimdo's product design system, paired with `@jimdo/ia` for the
navigation shell. You build prototypes for **Sam**, Jimdo's small-business-owner persona.

**Core mental model:** you rarely write CSS. Compose the pre-built `@jimdo/ui` React
components — they carry their own styling. When you must style, do it through **component
props** using **semantic alias token strings** (e.g. `backgroundColor="canvas"`),
never raw hex/px values. The components are imported from `window.JimdoUI.*`; the design
agent does **not** author SCSS or CSS-module classes — there is no class vocabulary to
learn, only props.

**Setup / wrapping.** No theme provider is required — components style themselves once the
DS stylesheet is loaded (it sets the base **EuclidCircularA** font on `body` and ships all
component CSS). Just import and compose. (For a `Modal` in a static prototype, pass
`ariaHideApp={false}` to silence the react-modal app-element warning.)

**Where the truth lives.** Each component ships `<Name>.d.ts` (the exact prop contract — the
authoritative list of prop names and allowed values) and `<Name>.prompt.md` (usage). Read
those before composing a component. The styles are compiled — don't try to read or author
the CSS.

**Design priority order — resolve every trade-off in this sequence:**

```
Accessibility  >  Consistency  >  Expressiveness  >  Novelty
```

The design system is non-negotiable: expressiveness comes from *how* you compose and
configure existing components, never from custom re-implementations. If a component can't do
what you need, propose an enhancement — don't work around it with raw HTML.

**Match expressiveness to context.** Lean expressive on onboarding, empty states,
dashboards, conversion and celebration moments; stay quiet and utilitarian on settings, dense
tables, admin views, form-heavy workflows. **Expression must be motivated, not decorative** —
before adding motion, a dark surface, or an accent color, name what it communicates
(hierarchy, feedback, state change, progress). "It looks nicer" is not a reason; when you
can't state the job in one sentence, leave the surface quiet.

**Brand voice: Friendly, Simple, Inclusive.** Motivational in onboarding/hero, instructional
in pricing/checkout/settings, supportive in errors. Jimdo is a **full business tool** (website
+ invoicing + payment links + CRM + bookings), not just a website builder. **Copy is owned by
the `ux-writing` skill** — invoke it for every user-facing string; this spec defines no wording.

## Colors

Color is applied through **semantic alias token strings** passed to component props, grouped
by role:

| Role | Prop example | Use for |
|---|---|---|
| Background | `backgroundColor="canvas"` | Surface fills |
| Typography | `color="gray-on-light-subdued"` | Text & icon color |
| Stroke | `borderColor="gray-default"` | Borders, dividers |
| Actions | (built into interactive components) | Interactive fills + states |
| Decorative | (charts, dots) | Non-semantic visual accent |

Background tokens: `canvas` (#ffffff, the app canvas — never override it),
`gray-light` (#ffffff, cards/raised), `gray-medium`, `gray-dark`, `gray-inverted` (#000000); plus semantic
`*-light` surfaces `primary-light` / `positive-light` / `notice-light` / `negative-light` /
`upgrade-light`. Text tokens: `gray-on-light-default` (#000), `gray-on-light-subdued` (#6d6d6d),
`gray-on-dark-default` (#fff), `gray-on-dark-subdued`, `primary-on-light` (#001453). Stroke:
`gray-decorative`, `gray-default` (#e6e6e6).

**Semantic color families carry meaning — use them for what they mean, never decoratively:**
- **Primary** (blue #004ced) — brand actions, active states, links.
- **Positive** (green) — success, completion, connected.
- **Notice** (amber) — attention needed, pending, warnings.
- **Negative** (red) — errors, destructive actions.
- **Upgrade** (purple) — premium features, upsells.

**60 / 30 / 10 rule:** ~60% dominant neutral (the white `canvas` + neutral surfaces), ~30% supporting (borders,
subdued text, secondary surfaces), ~10% accent (primary actions, status, semantic highlights).
All-gray feels flat; over-coloring is noise. **One accent does the talking per surface.** Don't
reach for `positive` green or `upgrade` purple because a section "feels plain" — a color that
doesn't mean its meaning teaches the user wrong. Genuine chart/illustration variety uses the
non-semantic `decorative-*` family. **Color-family matching:** foreground on a themed background
uses the matching family's `on-{light|dark}` token (gray foreground only on gray background).
For **icons** this is lint-enforced; for text it's a strong guideline. **Never rely on color
alone** to convey state — pair with an icon, label, or `Status`.

## Typography

**Always render text through `<Typography variant="…">`.** Never use bare `<p>`/`<h1>`–`<h6>`/
`<span>` for content text, and never set font-family/size/weight by hand. Typeface is
**EuclidCircularA** (loaded by the stylesheet); sizes use `rem`.

| Family | Variants | Use |
|---|---|---|
| Hero | `heroLarge / Medium / Small` | Landing pages only |
| Headline | `headlineLarge / Medium / Small` | Page & section titles |
| Subheadline | `subHeadlineLarge / Medium / Small` | Secondary headings |
| Body | `bodyLarge / Medium / Small` × `Regular / Medium / Semibold` (e.g. `bodyMediumRegular`) | Running text |
| Label | `labelLarge / Medium / Small` | Captions, metadata, tags |
| Link | `linkLarge / Medium / Small` | Inline navigation / actionable text |

Each variant ships a **default HTML element and `marginBottom`** (e.g. `headlineLarge` → `<h1>`
+ `marginBottom="l"`), both overridable via `component` and `marginBottom` — preserve semantic
heading order regardless of visual size. Style via Typography **props, never inline styles**:
`color`, `marginBottom` (responsive array), `align`, `fontWeight` (`medium`/`bold`),
`textWrap="balance"` (headlines), `truncate`, `isForSmartFeature` (AI gradient text — reserve
for genuine AI content). `variant` is itself responsive — pass an array
`['headlineSmall','headlineMedium','headlineLarge']`.

**Measure & hierarchy discipline:** cap running text at ~60–75 chars/line (constrain the
container, e.g. `style={{ maxWidth: '65ch' }}`, not the font size). **Earn hierarchy with weight
and color before scale** — step one level or shift `color` to a subdued token before jumping to
a Hero size. Reserve Hero for landing pages; let weight + subdued color carry in-product hierarchy.

## Layout

**Never use a plain `<div>` for layout.** Compose with `Box`, `FlexBox`, `Grid` and express
everything possible as props:
- **`Box`** — `padding*`, `margin*`, `backgroundColor`, `hasBorder` + `borderColor` + `borderRadius`, `boxShadow`.
- **`FlexBox`** — all Box props plus `flexDirection`, `justifyContent`, `alignItems`, `gap`.
- **`Grid`** — `columns` + `gap`.

CSS-only escape hatch (`style={{}}`) is acceptable **only** for properties with no prop:
`width`, `height`, `min/max-width`, `overflow`, `box-sizing`, `text-align`.

**Spacing is a token-string scale** for `padding`/`margin`/`gap`: `zero, xxs, xs, s, m, l, xl`
(larger steps for gap/margin). Choose by relationship: **gap** between siblings (preferred),
**margin** for spacing from surroundings, **padding** for internal space. Larger steps between
major sections, tighter steps to group related elements — **spacing communicates relationship,
not just separation**; keep steps consistent across like elements (a grid where one card uses a
different gap for no reason reads as a mistake).

**Two sharp edges:** `marginTop` accepts **only** `zero` or `auto` (for top spacing, add
`marginBottom` to the element above or wrap the element below in `<Box paddingTop="…">`);
`justifyContent` uses `"between"` / `"around"` / `"evenly"` (not the `space-*` names).

**Responsive arrays:** most layout props and Typography `variant`/`marginBottom` accept up to
four values applied base → md → lg → xl (last repeats up): `<Box padding={["m","l"]} />`,
`<FlexBox flexDirection={["column","column","row"]} />`. Design to stay usable down to **360px**.
Center a container with margin props: `<Box marginLeft="auto" marginRight="auto" style={{maxWidth:'1200px'}}>`.

**Don't reach for a card or modal by reflex.** A `Card` is for genuinely separable, scannable
units — not a default wrapper; most groupings need only spacing + a heading. **Never nest a card
in a card.** Prefer inline / progressive disclosure (`Accordion`, `Popover`, expand-in-place)
over a `Modal`; reserve modals for focused, interrupting decisions. Repeating the same
icon+heading+text card in an endless grid reads as filler — vary density or use a `List`/
`DataTable` when items are tabular. **Page headers:** default to `ContentPage` (padding,
max-width, title, subtitle, optional CTA); drop to `Box`+`FlexBox` only for custom controls.

## Elevation, depth & shapes

**Shadows mean elevation — only for elements that genuinely float** (popovers, dropdowns,
menus, tooltips, modals). Flat surfaces that sit on the page (cards, panels, form sections) use
a **border**, not a shadow (lint-enforced). Build depth by **layering surfaces**, not shadowing
everything: Canvas (`canvas`, white) → Container (`gray-light`) → Card (`gray-light`, shadow only
if floating) → Highlight (`primary-light` / `notice-light`). Reserve **inverted/dark**
backgrounds for high-priority moments (hero, CTA, upgrade) — they lose impact when common.

**Border radius** is a semantic prop scale. This build ships **`none, xs, s, m, l, xl, xxl`**
(7 steps) — use `borderRadius="m"`, never a raw px. **Nesting rule:** inner containers use a
**smaller** radius than their parent so the inner corner follows the parent's curvature (rough
guide: outer ≈ inner + padding; snap to the nearest step).

**Motion:** 150–300ms micro-interactions, 300–500ms larger transitions; ease-out for entrances
**and exits** (never `ease-in` on UI); animate only `transform`/`opacity`; always honor
`prefers-reduced-motion` (keep opacity/color transitions, drop movement). Never flash >3×/sec.
**Match motion to frequency:** repeated actions (toggles, menu opens) should be near-instant;
spend motion on occasional, meaningful moments (modals, drawers, toasts, onboarding, celebration).

## Components

`@jimdo/ui` is the first source of truth — **before building any UI element, check the inventory;
if it exists, import it, don't recreate it in HTML.** Confirm real props via the component's
`<Name>.d.ts`.

**Inventory (abridged):** Buttons — `Button`, `ButtonGroup`, `UnstyledButton`,
`ButtonSocial`. Data display — `Typography`, `Card`, `DataTable`, `Table*`, `Tag`, `Status`,
`Accordion`, `List`, `Divider`, `Icon`, `Popover`, `CompanionLogo`, `ProfileAvatar`,
`PaymentMethodIcon`, `CopyToClipboard`, `InfoTooltip`. Feedback — `Modal*`, `CalloutActionable`,
`CalloutCompact`, `Skeleton`, `LoadingIndicator`, `LoadingBar`, `CompanionLoadingIndicator`.
Inputs — `TextField`, `TextArea`, `Select`, `Checkbox`, `RadioButton`, `ToggleButton`,
`DatePicker`/`DatePickerInput`, `DateRangeInput`, `SearchInput`, `Autocomplete`, `NumberField`,
`PhoneInput`, `TimeField`, `ColorPicker`, `RangeSlider`, `SelectCard`, `Fieldset`. Layout —
`Box`, `FlexBox`, `Grid`, `ContentPage`, Onboarding blocks. Navigation — `Breadcrumbs`, `Link`,
`Menu`, `Tab`. *(Multi-page chrome — sidebar/topbar — comes from `Frame` in `@jimdo/ia`; never
build your own.)*

**High-value API gotchas (these cause real bugs):**

| Component | Get it right |
|---|---|
| `Button` | `buttonStyle="primary"` (NOT `variant`); options include `secondary`/`subtle`/`negative`/`notice`/`positive`/`upgrade`/`smart` + their `*Secondary`. `buttonSize="small"\|"large"` — no `"medium"`; omit = large |
| Button pairs | Wrap two buttons in `ButtonGroup`, not `FlexBox` |
| `Status` | `type="positive"` (NOT `variant`) |
| `Select` (in a row) | `aria-label` + `marginBottom="zero"`; the `label` prop renders above (vertical forms) |
| `ToggleButton` | Boolean; `checked` + `onChange` + `aria-label`. Multi-select → `Checkbox` |
| `DataTable`/`Table` | Wrap in `<Box hasBorder borderColor="gray-decorative" borderRadius="m" style={{overflow:'hidden'}}>`; pagination needs `<Box paddingTop="m">` |
| `DatePickerInput` | Use it (not `DatePicker`) for forms; prop is `value`, not `selected` |
| `Icon` | `color` must be a typography-color token; verify the icon name exists |
| `Modal` | `isOpen` required; compose `ModalHeader`/`ModalBody`/`ModalFooter`; in static prototypes pass `ariaHideApp={false}` |
| Real interactive elements | Use `Button`/`UnstyledButton`/`Link` — never `onClick` on a `Box`/`div` |

*Deprecated / removed from this library — do not use: `Badge` (use `Status` for state or `Tag`
for category); `IconButton` and `ButtonSubtle` (use `Button` with the `icon` prop /
`buttonStyle="subtle"`); `Widget`.*

**Icons.** Library is **HugeIcons Pro**, **Standard** style. Default to **Stroke** (minimal); use
**Solid** for stronger presence or active/toggled states. Sizes: **24px default**, 16px compact,
32px emphasis. Use icons **purposefully** (each adds meaning, complements text, never decorates);
by default buttons have **no** icon — add one only when it aids recognition. Interactive icons need
an `aria-label`; icon-only `Button`/`IconButton` ship a 48×48 hit target.
> Note: this synced library bundles only the icons the DS's own examples reference (the full
> 8,878-icon set exceeds the upload limit). Use `Icon` with the available icon exports; request
> more icons if you need them.

## States

Every data-driven surface has more than one state — design all of them, each with its
purpose-built component:
- **Loading** — `Skeleton` for known-shape content (prevents reflow), `LoadingIndicator` for
  indeterminate waits, `LoadingBar` for page-level progress. Long-running/agentic work: show the
  step (`CompanionLoadingIndicator`/`LoadingBar`), reveal partial output, always give a visible
  **cancel/stop** (an un-interruptible agent action is a dark pattern).
- **Empty** — a first-run opportunity: one-line explanation + a primary `Button` to create the
  first item + optional illustration. Never ship a blank `Box`. High-expressiveness moment.
- **Error** — tie it to the field that caused it; make it **visually and semantically** distinct
  (icon + color + placement, never color alone); use the `negative` family + a
  `CalloutActionable`/`CalloutCompact` with plain-language cause + a recovery action; pair inline
  errors with `aria-live="polite"`.
- **Partial / degraded** — show what loaded, mark the gap inline; don't blank the whole view.

Match state weight to context (terse empty row in a dense table; warmer empty state on a
dashboard). Copy follows `ux-writing`.

## AI & Agentic Experience

Jimdo's AI is delivered by the **Companion** — an intelligent partner, **not a mascot**; its
brand is competence and reliability, not a face. Voice follows the brand voice; every Companion
string is owned by `ux-writing`. Never use stereotypical "AI" visuals (robots, glowing brains) —
trust comes from calm, predictable, purposeful design focused on the *outcome*.

**Four core principles (all required):** (1) **Prioritize user value** — lead with the tangible
result, not the technology. (2) **Systemic by default** — compose from existing components/tokens.
(3) **Employ the Subtlety Spectrum** — visibility is intentional. (4) **Transparency, control &
trust** (non-negotiable) — show reasoning not certainty; every AI action optional, reversible,
easy to question/edit/reject; design for graceful failure (route failures through States → Error).

**The Subtlety Spectrum — default to the quietest tier that preserves trust:**

| Tier | When | Components / tokens |
|---|---|---|
| **1 Augmentative** | background enhancements that shouldn't interrupt | plain `Typography`; `SparklesIcon` sparingly; no gradient |
| **2 Suggestive** | inline contextual help (e.g. "Refine this sentence") | `SparklesIcon` cue; `Button buttonStyle="smart"` / `"smartSecondary"` |
| **3 High-impact** | significant AI-generated content to review | `Typography isForSmartFeature` (AI gradient text); optional full border or `*-light` background frame |
| **4 Provocative** | initiating a powerful agentic task | `CompanionLogo variant="colored"` + `buttonStyle="smart"` |

Which gradient shows is component-determined: `isForSmartFeature` → AI gradient text; the
`smart`/`smartSecondary` Button styles emit the companion gradient fill themselves (don't apply
gradients manually). `CompanionLogo` and `CompanionLoadingIndicator` are **Beta** — APIs may change.

**One AI signifier per surface, not one per control.** A SparklesIcon, gradient text, a smart
Button, and a colored CompanionLogo all say the same thing — stacking them is wallpaper. Mark the
highest tier the view earns, show it once, keep every other AI touch at Tier 1 or silent.
**Gradient/Sparkle motion is gated to active work, never ambient** — animate only while the
Companion is genuinely working (generating/thinking/streaming), then settle to a static fill; a
forever-shimmering button is a bug. In every tier: **label AI-generated content**, provide
edit/regenerate/reject controls, honor `prefers-reduced-motion`. **Companion motion is calmer**
than standard UI — upper end of the motion band, ease-out, no bounce.

**Delegation models:** *Co-pilot* (primary) — user + Companion toward a goal with a defined
start/end; user keeps control. *Autopilot* — background monitor/optimize (defined start,
indeterminate end); must always be **pausable/stoppable**, silent actions surface as Tier-1
Informative notifications (don't fake "busy" motion for work the user isn't waiting on).
**Companion Interface** is usually a contextual **sidebar (non-blocking)** or dimming **overlay
(blocking, Modal focus rules)** — build the shell from `@jimdo/ia` `Frame`, default to the
non-blocking sidebar. **Generated output landing:** a static replacement is a transition
(cross-fade opacity, don't hard-cut); streamed output is a short even stagger; both inside the
motion band, honor `prefers-reduced-motion`.

## One idiomatic build snippet

```tsx
import { ContentPage, Card, FlexBox, Typography, Button, ButtonGroup, Status } from '@jimdo/ui';

<ContentPage title="Bookings" subtitle="Your upcoming appointments">
  <Card>
    <FlexBox flexDirection="column" gap="m" padding="l">
      <FlexBox justifyContent="between" alignItems="center">
        <Typography variant="subHeadlineMedium" marginBottom="zero">Saturday haircut</Typography>
        <Status type="positive">Confirmed</Status>
      </FlexBox>
      <Typography variant="bodyMediumRegular" color="gray-on-light-subdued" style={{ maxWidth: '65ch' }}>
        2 guests · 10:00–11:00 · paid online
      </Typography>
      <ButtonGroup>
        <Button buttonStyle="secondary">Reschedule</Button>
        <Button buttonStyle="primary">View details</Button>
      </ButtonGroup>
    </FlexBox>
  </Card>
</ContentPage>
```

## Do's and Don'ts

**Do:** use `@jimdo/ui` components for everything they cover; style via props with semantic alias
token strings; match foreground color family to themed backgrounds; borders for flat surfaces,
shadows only for floating; build accessibility in from the start (keyboard reach + visible focus,
a label or `aria-label` on every control, 48×48 targets, focus trapped in `Modal`/dialogs and
returned on close, `aria-live` for dynamic content); never rely on color alone; use real
interactive elements (`Button`/`UnstyledButton`/`Link`); treat `prefers-reduced-motion` as fewer
and gentler, not zero.

**Don't:** hardcode hex/rgb/px values; set inline `style` for color/spacing/radius on Typography;
use `marginTop` with anything but `zero`/`auto`; put `box-shadow` on a static container; use the
removed `Badge` (use `Status`/`Tag`), or `variant`/`size` on `Button`, or `variant` on `Status`; build custom
sidebars/tables/checkboxes from raw HTML; wrap every section in a `Card`, nest cards, or open a
`Modal` for something that could be inline; use stereotypical "AI" visuals or apply the
AI/companion gradient decoratively or label every minor enhancement; ship a non-reversible or
non-stoppable AI action; ship dark patterns (fake urgency, hidden costs, trick defaults, removed exits).

# JimdoUI (@jimdo/ui@0.0.0-development)

This design system is the published @jimdo/ui React library, bundled as a single
browser global. All 64 components are the real upstream code.

## Where things are

- `_ds_bundle.js` — the whole-DS bundle at the project root; loads every component to `window.JimdoUI`. First line is a `/* @ds-bundle: … */` metadata header.
- `styles.css` — the single stylesheet entry: it `@import`s the tokens, fonts, and component styles (`_ds_bundle.css`). Link this one file.
- `components/<group>/<Name>/<Name>.prompt.md` (example JSX + variants), `<Name>.d.ts` (types), `<Name>.html` (variant grid).
- `tokens/*.css` — CSS custom properties, names verbatim from upstream.
- `fonts/` — `@font-face` files + `fonts.css` (when the package ships fonts).

For a specific component, `read_file("components/<group>/<Name>/<Name>.prompt.md")`.

## Loading

Add these two lines to your page once (React must be on the page first):

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
```

Components are then available at `window.JimdoUI.*`. Mount into a dedicated child node (e.g. `<div id="ds-root">`), not the host page's own React root, so the two trees don't collide:

```jsx
const { Accordion } = window.JimdoUI;
ReactDOM.createRoot(document.getElementById('ds-root')).render(<Accordion />);
```

## Tokens

72 CSS custom properties from @jimdo/ui. Names are
preserved verbatim from upstream. They are declared inside `_ds_bundle.css` (this DS ships one compiled stylesheet rather than separate token files).

- **color** (30): `--jui-color`, `--box-bg-color`, `--box-border-color`, …
- **spacing** (6): `--flex-gap`, `--flex-column-gap`, `--flex-row-gap`, …
- **radius** (1): `--box-border-radius`
- **shadow** (1): `--box-box-shadow`
- **other** (34): `--box-flex`, `--box-flex-grow`, `--box-flex-shrink`, …

## Components

### data-display
- `Accordion` — Storybook: https://jimdo.github.io/ui/latest/path/docs/data-display-accordion--docs
- `Card`
- `CompanionLogo` — Unstable - Storybook: https://jimdo.github.io/ui/latest/path/docs/data-display-companionlogo--docs
- `CopyToClipboard` — Storybook: https://jimdo.github.io/ui/latest/path/docs/data-display-copy-to-clipboard--docs
- `DataTable` — Storybook: https://jimdo.github.io/ui/latest/path/docs/data-display-datatable--docs
- `Divider` — Storybook: https://jimdo.github.io/ui/latest/path/docs/data-display-divider--docs
- `Icon` — Storybook: https://jimdo.github.io/ui/latest/path/docs/data-display-icons--docs
- `InfoTooltip` — Storybook: https://jimdo.github.io/ui/latest/path/docs/data-display-infotooltip--docs
- `List` — Storybook: https://jimdo.github.io/ui/latest/path/docs/data-display-list--docs
- `LogoColored`
- `PaymentMethodIcon` — Storybook: https://jimdo.github.io/ui/latest/path/docs/data-display-paymentmethodicon--docs
- `Popover` — Storybook: https://jimdo.github.io/ui/latest/path/docs/data-display-popover--docs
- `ProfileAvatar`
- `Table` — Storybook: https://jimdo.github.io/ui/latest/path/docs/data-display-table--docs
- `TablePagination` — Storybook: https://jimdo.github.io/ui/latest/path/docs/data-display-tablepagination--docs
- `Tag` — Storybook: https://jimdo.github.io/ui/latest/path/docs/data-display-tag--docs
- `Typography` — Storybook: https://jimdo.github.io/ui/latest/path/docs/data-display-typography--docs

### inputs
- `Autocomplete`
- `Checkbox` — Storybook: https://jimdo.github.io/ui/latest/path/docs/inputs-checkbox--docs
- `ColorPicker`
- `DatePicker`
- `DateRangeInput`
- `Fieldset` — Storybook: https://jimdo.github.io/ui/latest/path/docs/inputs-fieldset--docs
- `Input`
- `NumberField` — Storybook: https://jimdo.github.io/ui/latest/path/docs/inputs-numberfield--docs
- `PhoneInput`
- `RadioButton` — Storybook: https://jimdo.github.io/ui/latest/path/docs/inputs-radio-button--docs
- `RangeSlider`
- `SearchInput`
- `Select`
- `SelectCard`
- `TextArea`
- `TextField` — Storybook: https://jimdo.github.io/ui/latest/path/docs/inputs-textfield--docs
- `TimeField`
- `ToggleButton` — Storybook: https://jimdo.github.io/ui/latest/path/docs/inputs-togglebutton--docs

### layout
- `Box` — Storybook: https://jimdo.github.io/ui/latest/path/docs/layout-box--docs
- `FlexBox` — Storybook: https://jimdo.github.io/ui/latest/path/docs/layout-flexbox--docs
- `Grid` — Storybook: https://jimdo.github.io/ui/latest/path/docs/layout-grid--docs

### navigation
- `Breadcrumbs`
- `Link` — Storybook: https://jimdo.github.io/ui/latest/path/docs/navigation-link--docs
- `Menu` — Storybook: https://jimdo.github.io/ui/latest/path/docs/navigation-menu--docs
- `Tab`

### buttons
- `Button` — Storybook: https://jimdo.github.io/ui/latest/path/docs/buttons-button--docs
- `ButtonGroup` — Storybook: https://jimdo.github.io/ui/latest/path/docs/buttons-buttongroup--docs
- `ButtonSocial`
- `UnstyledButton` — Storybook: https://jimdo.github.io/ui/latest/path/docs/buttons-unstyledbutton--docs

### feedback
- `CalloutActionable` — Storybook: https://jimdo.github.io/ui/latest/path/docs/feedback-calloutactionable--docs
- `CalloutCompact` — Storybook: https://jimdo.github.io/ui/latest/path/docs/feedback-calloutcompact--docs
- `CompanionLoadingIndicator`
- `LoadingBar` — Storybook: https://jimdo.github.io/ui/latest/path/docs/feedback-loadingbar--docs
- `LoadingIndicator` — Storybook: https://jimdo.github.io/ui/latest/path/docs/feedback-loadingindicator--docs
- `Modal` — Storybook: https://jimdo.github.io/ui/latest/path/docs/feedback-modals--docs
- `Skeleton` — Storybook: https://jimdo.github.io/ui/latest/path/docs/feedback-skeleton--docs
- `Status` — Storybook: https://jimdo.github.io/ui/latest/path/docs/feedback-status--docs

### blocks
- `CapabilitiesBlock`
- `ClosingBlock`
- `FeatureBlock`
- `HeaderBlock`
- `MainValueBlock`
- `QuotationBlock`
- `StatHighlightBlock`

### transitions
- `Collapse` — Storybook: https://jimdo.github.io/ui/latest/path/docs/transitions-collapse--docs
- `Fade` — Storybook: https://jimdo.github.io/ui/latest/path/docs/transitions-fade--docs

### pages
- `ContentPage`
