# MktgCompass Design System

**Direction:** ChronoTask-inspired. Clean, airy, professional SaaS with warm approachability.
The goal is to feel like a premium productivity tool that non-technical marketers trust instantly.

> This is the canonical design reference for MktgCompass. `frontend/app/globals.css` is the
> source of truth for tokens; this doc explains the *why* and provides component usage.
> `CLAUDE.md` and `docs/dashboard-planning.md` link back here — do not duplicate guidance.

---

## 1. Philosophy

**Structured clarity with warmth.** Every element should feel intentional, spacious, and
effortlessly organized. Let data breathe.

**Mood:** Professional but not corporate. Friendly but not playful. Premium but not intimidating.

**Core traits**
- Generous whitespace and padding throughout
- Soft, rounded containers with subtle shadows
- Light, neutral backgrounds with small pops of color
- Card-based layouts with clear visual hierarchy
- Friendly micro-copy and greeting patterns ("Good morning, Raymond")

**"No-line" surfaces.** Structural separation happens through tonal background shifts, not
1px borders. The surface stack `#F7F8FA → #FFFFFF → #EEF0F4` produces soft layers the eye reads
as distinct without adding visual noise. When an accessibility-required border is needed (form
inputs), use `.border-ghost` — felt, not seen.

**Single-accent discipline.** One blue (`#2563EB`) carries CTAs, active nav, links, and primary
chart emphasis. Everything else is neutral or semantic (success/warning/danger). The cyan hero
gradient is **reserved for the marketing landing page only** — do not use it inside the app shell.

---

## 2. Color Tokens

All tokens live in `frontend/app/globals.css:5-88`. Tailwind v4 reads them via `@theme inline`
(same file, lines 91-143).

### Base surfaces

| CSS variable | Hex | Tailwind utility | Usage |
|---|---|---|---|
| `--surface` | `#F7F8FA` | `bg-surface` | Page background, app shell |
| `--surface-lowest` | `#FFFFFF` | `bg-surface-lowest` | Cards, elevated content, top bar |
| `--surface-low` | `#EEF0F4` | `bg-surface-low` | Hover states on rows/cells |
| `--surface-container` | `#E5E7EB` | `bg-surface-container` | Dividers, kbd badges, inactive fills |
| `--surface-variant` | `#EFF6FF` | `bg-surface-variant` | AI insight tinted surfaces |
| `--surface-warning` | `#FFFBEB` | `bg-surface-warning` | Amber callout cards (demo banner notices, suggestions) |

### Text

| CSS variable | Hex | Tailwind utility | Usage |
|---|---|---|---|
| `--on-surface` | `#1A1A1A` | `text-on-surface` | Headings, primary labels, important numbers |
| `--on-surface-variant` | `#6B7280` | `text-on-surface-variant` | Descriptions, axis labels, metadata |
| `--outline` | `#E5E7EB` | `border-outline` | Card borders, dividers, section edges |
| `--outline-variant` | `#F0F1F3` | `border-outline-variant` | Inner dividers, subtle separators |

### Accent & primary

| CSS variable | Hex | Tailwind utility | Usage |
|---|---|---|---|
| `--primary` / `--accent-primary` | `#2563EB` | `bg-primary` / `text-primary` | CTAs, links, active nav, primary chart series |
| `--accent-primary-light` | `#EFF6FF` | — | Active nav background, badge fill |
| `--secondary-container` | `#3B82F6` | `bg-secondary-container` | Gradient end stop |

### Semantic

| CSS variable | Hex | Tailwind utility | Usage |
|---|---|---|---|
| `--success` / `--grade-elite` | `#10B981` | `text-success` / `text-grade-elite` | Positive metrics, A+ grade |
| `--grade-optimal` | `#2563EB` | `text-grade-optimal` | B grade, optimal efficiency |
| `--accent-warning` / `--grade-scaling` | `#F59E0B` | `text-grade-scaling` | Caution, C grade, amber emphasis |
| `--error` / `--grade-poor` | `#EF4444` | `text-error` / `text-grade-poor` | Negative metrics, errors, D grade |
| `--info` | `#2563EB` | `text-info` | Informational states (same as primary by design) |

### Gradients

```css
--gradient-cta:  linear-gradient(135deg, #2563EB, #3B82F6);
--gradient-hero: linear-gradient(135deg, #38BDF8 0%, #06B6D4 50%, #0EA5E9 100%);
```

- `.bg-primary-gradient` → `--gradient-cta`. Used on primary buttons (`New Analysis`, `Apply`, landing CTAs) and avatar chips.
- `--gradient-hero` → **marketing landing page only.** Hero backdrop and feature showcase accents. Never use in the dashboard.

### Tooltip

| CSS variable | Hex | Usage |
|---|---|---|
| `--tooltip-bg` | `#111827` | Dark popover background for KPI tooltips and Recharts tooltips. White text. |

---

## 3. Typography

### Font stack

All three are loaded via `next/font/google` in `frontend/app/layout.tsx` (zero layout shift,
no external request). The CSS variables below point at the next/font-generated values.

```css
--font-display: var(--font-display);  /* DM Sans — headings, display, UI */
--font-body:    var(--font-body);     /* DM Sans — body, labels */
--font-mono:    var(--font-mono);     /* JetBrains Mono — numbers, kbd */
```

**DM Sans** — geometric, clean, slightly warm. Excellent weight range (400/500/600/700). Used
for both display and body because its optical sizes (9–40) adapt beautifully across the scale.

**JetBrains Mono** — tabular figures for metric alignment. Use `font-mono` + `font-tabular`
together for all currency, percentages, and counts.

### Type scale

Defined in `globals.css:187-194`. Use as Tailwind utility classes.

| Class | Size | Line-height | Letter-spacing | Weight | When |
|---|---|---|---|---|---|
| `.text-display-lg` | 3.5rem / 56px | 1.10 | -0.02em | 700 | Landing hero headline |
| `.text-headline-lg` | 2.0rem / 32px | 1.15 | -0.02em | 700 | Section heroes |
| `.text-headline-md` | 1.75rem / 28px | 1.15 | -0.015em | 700 | Page titles (`Attribution Explorer`) |
| `.text-title-lg` | 1.125rem / 18px | 1.40 | -0.01em | 600 | Card titles, section headers |
| `.text-body-md` | 0.9375rem / 15px | 1.60 | 0 | 400 | Paragraphs, descriptions |
| `.text-body-sm` | 0.8125rem / 13px | 1.50 | 0 | 400 | Table cells, secondary info |
| `.text-label-md` | 0.75rem / 12px | 1.40 | 0.02em | 400 | Metadata, inline badges |
| `.text-overline` | 0.6875rem / 11px | 1.20 | 0.08em | 600 | KPI labels, sidebar section headers, uppercase |

### Rules

- Headings: `text-on-surface`, bold or semibold. Never gray.
- Body: `text-on-surface-variant` for descriptions, `text-on-surface` for emphasis.
- Numbers: always `font-mono font-tabular` for column alignment.
- Large metric values (`$4.2M`): `text-[2.25rem] font-bold font-display` with `-0.02em` tracking.
- Delta indicators (`+12.5%`): `text-[0.8125rem] font-medium`, colored by sentiment.

---

## 4. Spacing

Base unit: **4px**. The `--space-*` tokens mirror Tailwind's default scale and exist as
reference anchors — day-to-day code uses Tailwind utilities (`p-6`, `gap-4`, etc.).

```css
--space-1:  4px;   --space-2:  8px;   --space-3: 12px;
--space-4: 16px;   --space-5: 20px;   --space-6: 24px;
--space-8: 32px;   --space-10: 40px;  --space-12: 48px;
--space-16: 64px;
```

### Component padding standards

| Component | Padding | Tailwind |
|---|---|---|
| Card | 24px all sides | `p-6` |
| Card (dense) | 20px all sides | `p-5` |
| Button (base) | 10px / 20px | `px-5 py-2.5` |
| Button (sm) | 6px / 12px | `px-3 py-1.5` |
| Input | 10px / 14px | `px-3.5 py-2.5` |
| Badge | 2px / 10px | `px-2.5 py-0.5` |
| Sidebar nav item | 10px / 12px, 40px height | `px-3 py-2.5` |
| Page horizontal | 32px | `px-8` |

### Layout widths

| Context | Max width |
|---|---|
| Dashboard pages (Overview, Attribution, Performance) | `max-w-[1200px]` |
| Insights page | `max-w-[900px]` |
| Settings page | `max-w-[680px]` |
| Marketing landing sections | `max-w-[1200px]` with section-level asymmetry allowed |

---

## 5. Components

### Card

```
bg-surface-lowest
border: 1px solid var(--outline)
rounded-card         (16px)
shadow: var(--shadow-float)
padding: p-6         (24px)
```

On hover (interactive cards): `shadow-float → shadow-hover`, optional `translateY(-1px)`.
Card titles use `.text-title-lg`. No colored borders — always neutral gray.

### Button

| Variant | Classes |
|---|---|
| **Primary** | `bg-primary-gradient text-white rounded-[10px] px-5 py-2.5 font-semibold text-[0.875rem] btn-primary-lift` |
| **Secondary** | `bg-surface-lowest text-on-surface border border-outline rounded-[10px] px-5 py-2.5 font-medium hover:bg-surface-low` |
| **Ghost** | `text-primary rounded-[10px] px-4 py-2 font-medium hover:bg-primary/5` |
| **Destructive** | `bg-error/10 text-error rounded-[10px] px-5 py-2.5 font-semibold hover:bg-error/15` |

Height: `h-10` (40px) for base, `h-8` (32px) for sm.

`.btn-primary-lift` (defined in `globals.css`) adds the ChronoTask-style hover micro-interaction:
`translateY(-1px)` + a soft colored shadow `0 4px 12px rgba(37, 99, 235, 0.3)`.

### Badge

```
px-2.5 py-0.5
rounded-[6px]        (radius-badge)
font-semibold text-[11px] uppercase tracking-wider
```

Color variants by context:
- **Info / Elite / Optimal** → `bg-accent-primary-light text-primary`
- **Success** → `bg-success/10 text-grade-elite`
- **Warning** → `bg-surface-warning text-grade-scaling`
- **Danger** → `bg-error/10 text-error`
- **Neutral / Coming Soon** → `bg-surface-container text-on-surface-variant`

### Input

```
bg-surface-lowest
border: 1px solid var(--outline)
rounded-input        (10px)
h-10 px-3.5
text-body-md
```

Use the `.focus-ring` utility for the 2px primary border + 3px translucent blue halo on focus.
Labels sit above the field at `.text-label-md`, 8px gap.

### Data table

| Property | Value |
|---|---|
| Row height | `h-12` (48px) |
| Row divider | `divide-y divide-outline-variant` (very subtle) |
| Row hover | `bg-surface-low` |
| Header | `text-overline text-on-surface-variant` |
| Cell | `text-body-sm text-on-surface` |
| Numeric cells | `font-mono font-tabular`, right-aligned |

No outer table border.

### Progress bar

```
h-2 rounded-full bg-surface-container overflow-hidden
  └─ filled div: h-full rounded-full bg-primary (or grade color)
```

Height: 8px. Radius: fully rounded (`rounded-full`). Track: `--surface-container`. Fill
animates width on mount via a `transition-all duration-slow ease-spring`.

### Donut / ring chart

- Thick stroke (12–16px)
- Multi-segment using chart channel palette (see §9)
- Center text: `.text-headline-md font-display`
- Legend: inline below, caption-size with colored dots

---

## 6. Elevation

Three modes, preferred in order:
1. **Tonal shift** — background color step (first choice)
2. **Ambient shadow** — `--shadow-float` for floating elements
3. **Glassmorphism** — only for marketing hero overlays above gradient backdrops

```css
--shadow-float:   0px 1px 3px rgba(0,0,0,0.04), 0px 1px 2px rgba(0,0,0,0.03);  /* cards, dropdowns */
--shadow-hover:   0px 4px 16px rgba(0,0,0,0.08);                                /* card hover */
--shadow-overlay: 0px 4px 12px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.04); /* modals, tooltips */
```

**Never use Tailwind's default `shadow-md` / `shadow-lg`** — they use pure black and feel
heavy. Always use these three.

---

## 7. Motion

One primary easing curve:

```css
--ease-spring: cubic-bezier(0.16, 1, 0.3, 1);  /* fast-start, gentle overshoot */
--ease-out:    cubic-bezier(0.0, 0.0, 0.2, 1); /* for exits */
```

Durations:

| Token | Value | When |
|---|---|---|
| `--duration-fast` | 150ms | Hover, icon swap |
| `--duration-base` | 200ms | Dropdowns, menus, tooltip |
| `--duration-slow` | 300ms | Page loads, modal enter, chart data reveal |

### Page load stagger

Elements fade up with `opacity: 0 → 1` and `translateY: 12px → 0`. Use `.animate-fade-up`
with a `--stagger-delay` CSS variable:

```tsx
<div
  className="animate-fade-up"
  style={{ "--stagger-delay": `${index * 60}ms` } as React.CSSProperties}
>
  {children}
</div>
```

Typical cascade: 0ms → 70ms → 140ms → 210ms for a KPI row, then 280ms/340ms for the charts
below.

### What gets animated

✅ Dropdown/menu enter+exit · Modal · Tooltip · Card hover lift · Chart on mount (bars grow,
lines draw, numbers count up) · Toast · Skeleton → content

❌ Scrolling · Resize · Checkbox/radio state · Tab switches · Table row sorting

---

## 8. Iconography

**Library:** `lucide-react`

| Size | px | When |
|---|---|---|
| `size-3.5` | 14px | Inline with body copy |
| `size-4` | 16px | Default UI (buttons, inputs, badges) |
| `size-[18px]` | 18px | Primary nav items |
| `size-5` | 20px | Card feature icons |
| `size-6` | 24px | Section headers, illustrations |

Stroke width: `strokeWidth={1.5}` for UI, `strokeWidth={1.25}` at 20px+ for a refined look.

Landing-page value prop icons sit in a `size-12` circle container with `bg-surface` background.

---

## 9. Chart styling

Implemented with Recharts. All charts share these rules:

- **Grid:** horizontal lines only, stroke `--outline-variant`. No vertical lines.
- **Axes:** no axis lines, no tick marks. Text-only in `text-on-surface-variant`, 12px.
- **Tooltip:** `bg-[var(--tooltip-bg)]`, white text, `rounded-[12px]`, `shadow-overlay`, 12px padding. Data values in `font-mono font-tabular`.
- **Confidence intervals:** series color at 15% opacity fill, no stroke — atmospheric, not hard bounds.
- **Cursor:** dashed `outline` vertical line on hover. Subtle.
- **Loading:** `.animate-shimmer` on a container sized to match chart. Never placeholder data.

### Channel palette

Canonical in `frontend/lib/demo-data.ts::CHART_COLORS`. Blue-led, single-accent discipline:

```ts
primary:   "#2563EB",   // accent blue (Organic, primary series)
secondary: "#F59E0B",   // amber (Paid Search — the one exception)
tertiary:  "#10B981",   // green (Growth / Organic Growth)
info:      "#06B6D4",   // cyan (Brand)
baseline:  "#9CA3AF",   // gray (baseline contribution)
muted:     "#E5E7EB",
channels: [
  "#2563EB", "#F59E0B", "#10B981", "#06B6D4",
  "#7C3AED", "#DB2777", "#0891B2", "#65A30D",
],
```

The only non-blue channel color in the default rotation is amber (`#F59E0B`) for Paid Search.
All other channels fall back to supporting hues that harmonize with the primary blue.

---

## 10. Landing page patterns

The marketing landing page lives at `frontend/app/(marketing)/page.tsx` with its own light
layout (no sidebar). Structural pattern, in order:

### Hero
- Overline pill badge (`AI-Powered MMM`)
- Display heading (`.text-display-lg`) — 2 lines, `-0.02em` tracking
- Subheading (`.text-body-md text-on-surface-variant`, `max-w-[600px]`)
- CTA row: Primary button (large, `h-12`) + secondary ghost
- Below: floating dashboard screenshot card on top of a soft `--gradient-hero` backdrop.
  Use `rounded-[20px] shadow-overlay`.

### Value props row
- 3 columns, no cards, evenly spaced
- Each: icon in `size-12 rounded-full bg-surface-low` + heading + one-line description
- Heading: `.text-title-lg`, description: `.text-body-md text-on-surface-variant`

### Feature showcase sections
- Alternating screenshot/text pairs (screenshot left/right reverses between sections)
- Screenshot: `rounded-[20px] shadow-overlay`, optional gradient backdrop
- Text side: `.text-headline-md` + `.text-body-md` + bullet list
- Backgrounds alternate between white and `bg-surface`

### Bento grid
- 2×2 grid with mixed heights — one tall card, two short, one wide
- Each card: `rounded-[20px] p-8 border border-outline bg-surface-lowest shadow-float`
- Contains: small UI preview SVG + title + one-line description
- Titles: *Automated Attribution · AI-Powered Insights · Budget Optimization · One-Click Reports*

### CTA footer
- Large heading, primary button, subtle background

---

## 11. Responsive breakpoints

```css
sm: 640px   md: 768px   lg: 1024px   xl: 1280px
```

- **< 768px:** Sidebar collapses to off-canvas drawer. Single-column card layouts. Smaller type scale.
- **768–1024px:** Sidebar icon-only (64px). 2-column card grids.
- **1024+:** Full sidebar (260px). 3–4 column grids. Full type scale.

---

## 12. Do's and Don'ts

### Do
- Use tonal surface shifts for structure. Dividers only when necessary.
- Use `font-mono font-tabular` for every numeric value.
- Keep a single blue accent. Let amber appear only for Paid Search.
- Reach for `--shadow-float` / `--shadow-overlay` — never Tailwind's defaults.
- Apply `.animate-fade-up` with staggered delays on page load.

### Don't
- Don't revert to the retired navy (`#131b2e`) or warm-brown (`#855300`) directions.
- Don't use Manrope, Inter, Bricolage Grotesque, or Plus Jakarta Sans — those were earlier
  explorations. DM Sans is the committed choice.
- Don't use hardcoded hex values in components. Reference tokens.
- Don't put the hero cyan gradient (`--gradient-hero`) inside the app shell — marketing only.
- Don't use 1px neutral borders to section content when a tonal surface shift will do.

---

## Canonical file map

| File | Purpose |
|---|---|
| `frontend/app/globals.css` | All design tokens + Tailwind `@theme` mapping. Source of truth. |
| `frontend/app/layout.tsx` | `next/font/google` wiring for DM Sans + JetBrains Mono |
| `frontend/lib/demo-data.ts` | `CHART_COLORS` palette |
| `frontend/components/layout/*` | Sidebar, TopBar, ChatPanel, DemoBanner |
| `frontend/components/cards/*` | KPICard, InsightCard |
| `frontend/components/charts/*` | WaterfallChart, SaturationCurve, EfficiencyMatrix, BudgetAllocator |
| `frontend/components/marketing/*` | Hero, ValueProps, FeatureShowcase, BentoGrid (landing only) |
| `DESIGN_SYSTEM.md` | This document |
