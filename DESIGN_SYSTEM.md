# MktgCompass Design System
## "The Radiant Curator"

A premium editorial design system for marketing measurement software. Treats every screen as a carefully composed gallery space — structured but alive, data-rich but never cold.

---

## Quick Reference

| File | Purpose |
|------|---------|
| `app/globals.css` | All CSS tokens + Tailwind v4 `@theme` mapping |
| `tailwind.config.ts` | Minimal v4 config (plugins only — tokens live in CSS) |
| `components/ui/chart-theme.ts` | Recharts global props + chart palette |
| `DESIGN_SYSTEM.md` | This document |

---

## 1. Tailwind v4 Architecture

**Important:** Tailwind v4 uses CSS-first configuration. There is no `content` array or theme object in `tailwind.config.ts`. All tokens are defined in `app/globals.css` via two mechanisms:

1. **`:root` CSS custom properties** — raw design tokens, usable everywhere (including Recharts, inline styles, SVG).
2. **`@theme inline`** — maps `:root` tokens to Tailwind utility names (`bg-primary`, `text-on-surface`, `font-display`, etc.).

The `inline` modifier is critical: it keeps token values as CSS variable references at runtime rather than resolving them to static values at build time. This means tokens are themeable and can be overridden per-component or per-feature.

---

## 2. Color System

### Philosophy: "No-Line" Surfaces

Structural separation is achieved **entirely through background color shifts**, never through 1px borders. The surface hierarchy produces ~2% brightness steps that the eye reads as distinct layers:

```
surface (#F7F9FB)           ← page background
  └─ surface-lowest (#FFF)  ← cards, inputs, elevated elements
       └─ surface-container (#ECEEF0)  ← nested blocks, code snippets
```

### Full Color Token Reference

| CSS Variable | Hex | Tailwind Utility | Usage |
|---|---|---|---|
| `--primary` | `#855300` | `bg-primary` / `text-primary` | Primary actions, active states |
| `--primary-container` | `#F59E0B` | `bg-primary-container` | Gradient end, highlights |
| `--on-primary` | `#FFFFFF` | `text-on-primary` | Text on primary bg |
| `--secondary` | `#B90538` | `bg-secondary` / `text-secondary` | Emotive callouts, secondary CTAs |
| `--secondary-container` | `#DC2C4F` | `bg-secondary-container` | Secondary fills |
| `--secondary-fixed` | `#FFDDE7` | `bg-secondary-fixed` | Badge backgrounds (soft coral) |
| `--on-secondary-fixed` | `#3E0011` | `text-on-secondary-fixed` | Badge text |
| `--surface` | `#F7F9FB` | `bg-surface` | Page base |
| `--surface-lowest` | `#FFFFFF` | `bg-surface-lowest` | Cards, inputs |
| `--surface-low` | `#F2F4F6` | `bg-surface-low` | Hover states, subtle recesses |
| `--surface-container` | `#ECEEF0` | `bg-surface-container` | Nested sections |
| `--surface-high` | `#E4E6E8` | `bg-surface-high` | Secondary button bg |
| `--surface-dim` | `#D8DADC` | `bg-surface-dim` | Disabled fills |
| `--on-surface` | `#191C1E` | `text-on-surface` | Primary text |
| `--on-surface-variant` | `#41484D` | `text-on-surface-variant` | Secondary text, axis labels |
| `--outline` | `#71787D` | `border-outline` | Medium-contrast borders |
| `--outline-variant` | `#D8C3AD` | `border-outline-variant` | Ghost border base |
| `--success` | `#F59E0B` | `text-success` | Success states (amber, not green) |
| `--error` | `#BA1A1A` | `text-error` | Error states |
| `--info` | `#0369A1` | `text-info` | Informational states |

### Ghost Border

When a structural border is accessibility-required (e.g., input fields), use the Ghost Border pattern. Felt, not seen:

```css
border: 1px solid color-mix(in srgb, var(--outline-variant) 20%, transparent);
```

Use the `.border-ghost` utility class in `globals.css`. Focus state automatically upgrades to a 2px `--primary` border.

### Gradients

Primary CTA gradient flows warm-to-deep (upper-left light, lower-right dark):

```css
background: linear-gradient(135deg, var(--primary-container) 0%, var(--primary) 100%);
/* or use the utility: */
className="bg-primary-gradient"
```

### Glassmorphism

For floating navigation or modals: `surface-lowest` at 80% opacity + 20px blur.

```css
/* or use the utility: */
className="glass"
```

---

## 3. Typography

### Font Pairing

| Role | Family | Rationale |
|---|---|---|
| **Display / Headline** | Bricolage Grotesque | Geometric quirk + professional weight. Tight tracking at large sizes reads as expert craftsmanship. |
| **Body / UI / Title** | Plus Jakarta Sans | Warmly humanist sans — legible at 12px, breathing room at body size. Not Inter. |
| **Data / Mono** | JetBrains Mono | Tabular numbers for metric alignment. Clear distinction between data values and labels. |

Fonts load via Google Fonts in `globals.css`. **In production, migrate to `next/font/google`** (zero layout shift, no external request).

### Type Scale

| Token | Size | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|
| `display-lg` | 3.5rem / 56px | 1.10 | −0.02em | Hero headers, page titles |
| `headline-md` | 1.75rem / 28px | 1.15 | −0.02em | Section headers, card titles |
| `title-lg` | 1.375rem / 22px | 1.30 | −0.01em | Modal headers, subsection titles |
| `body-md` | 0.875rem / 14px | 1.60 | 0 | All reading copy |
| `label-md` | 0.75rem / 12px | 1.40 | +0.01em | Metadata, tags, axis labels |

Use as Tailwind utilities: `text-display-lg`, `text-headline-md`, etc.

### Font Weight Conventions

| Weight | Class | When |
|---|---|---|
| 400 Regular | `font-normal` | Body copy, descriptions |
| 500 Medium | `font-medium` | UI labels, nav items, table headers |
| 600 Semibold | `font-semibold` | Card titles, modal headers, badges |
| 700 Bold | `font-bold` | Hero text, emphasis, numeric callouts |

### Bricolage Grotesque Sizing Note

Large Bricolage Grotesque has unique character heights. **Trust your eye over the grid for vertical centering** at display sizes — optical centering will look better than mathematical centering.

---

## 4. Spacing

Base unit: **4px**. All spacing tokens are multiples.

| Token | Value | Common Use |
|---|---|---|
| `space-1` / `p-1` | 4px | Icon padding, micro gaps |
| `space-2` / `p-2` | 8px | Badge padding, tight stacks |
| `space-3` / `p-3` | 12px | Input inner padding (vertical) |
| `space-4` / `p-4` | 16px | Input inner padding (horizontal), button padding |
| `space-6` / `p-6` | 24px | Card padding |
| `space-8` / `p-8` | 32px | Section spacing |
| `space-16` / `p-16` | 64px | Page horizontal padding (desktop) |

### Component Padding Standards

| Component | Padding |
|---|---|
| Card | `p-6` (24px all sides) |
| Button (base) | `px-4 py-2` (16px / 8px) |
| Button (sm) | `px-3 py-1.5` (12px / 6px) |
| Input | `px-4 py-2.5` with `h-10` (40px total height) |
| Badge | `px-2.5 py-0.5` (10px / 2px) |

---

## 5. Components

### Buttons

| Variant | Background | Text | Border | Radius |
|---|---|---|---|---|
| **Primary** | `bg-primary-gradient` | White | None | `radius-button` (12px) |
| **Secondary** | `bg-surface-high` | `text-primary` | None | `radius-button` |
| **Tertiary / Ghost** | Transparent (hover: `primary` at 8%) | `text-primary` | None | `radius-button` |
| **Destructive** | `bg-error-container` | `text-error` | None | `radius-button` |

Height: `h-10` (40px) for base, `h-8` (32px) for sm.

### Cards

```
Background:    bg-surface-lowest (#FFF)
Border:        none (tonal separation via parent surface-low bg)
Border Radius: rounded-card (16px)
Shadow:        shadow-float (ambient, 5% opacity)
Padding:       p-6 (24px)
```

On hover (interactive cards): transition background `surface-lowest → surface-low`.

### Inputs

```
Background:    bg-surface-lowest
Border:        .border-ghost (outline-variant at 20%)
Focus:         border-primary, 2px
Border Radius: rounded-input (8px)
Height:        h-10 (40px)
Label:         text-label-md, 8px above field
```

### Badges — "The Radiant Badge"

Primary badge variant: `bg-secondary-fixed` + `text-on-secondary-fixed`. The contrast between soft coral and deep crimson creates the high-fashion moment.

```
Padding:       px-2.5 py-0.5
Border Radius: rounded-badge (9999px)
Font:          text-label-md font-semibold
```

### Data Tables

| Property | Value |
|---|---|
| Row height | `h-12` (48px) |
| Hover | `bg-surface-low` |
| Dividers | **None.** Use `py-3` spacing between rows instead. |
| Header | `text-label-md font-medium text-on-surface-variant` |
| Cell | `text-body-md text-on-surface` |
| Numeric cells | `font-mono` (tabular numbers) |

---

## 6. Elevation & Depth

### The Layering Principle

Three modes of depth, in order of preference:

1. **Tonal shift** — background color step (always use first)
2. **Ambient shadow** — `shadow-float` for floating elements
3. **Glassmorphism** — `.glass` for overlays above complex content

### Shadow Reference

```css
--shadow-float:   0px 12px 32px 0px rgb(25 28 30 / 0.05);   /* cards, dropdowns */
--shadow-overlay: 0px 20px 48px 0px rgb(25 28 30 / 0.08);   /* modals, sheets */
```

**Never use `shadow-md`, `shadow-lg` etc. from Tailwind defaults for product UI.** They use pure black. Always use `shadow-float` or `shadow-overlay`.

---

## 7. Motion

### Easing

One primary easing curve throughout the product:

```css
--ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
```

This produces a fast-start, gently-overshooting spring feel. Used by Linear and Raycast. Signals responsiveness and care.

For exit/collapse animations, use `--ease-out`.

### Duration Standards

| Token | Value | When |
|---|---|---|
| `instant` | 0ms | Checkbox/radio toggles, direct selections |
| `fast` | 100ms | Hover states, icon swaps, small reveals |
| `base` | 200ms | Most transitions (dropdowns, menus, tooltip) |
| `slow` | 350ms | Page loads, modal enters, chart data reveals |

### What Gets Animated

✅ Dropdown/menu enter+exit · Modal enter+exit · Hover state fills · Skeleton → content · Chart data loads · Toast notifications

❌ Scrolling · Resize events · Checkbox/radio state · Tab switches (instant) · Table row sorting

### Page Load Strategy

Staggered fade-up: elements enter with `opacity: 0 → 1` and `translateY: 16px → 0` using `--ease-spring` at `--duration-slow`. Apply cascade via `--stagger-delay` CSS variable:

```tsx
// Example stagger
children.map((child, i) => (
  <div
    className="animate-fade-up"
    style={{ "--stagger-delay": `${i * 60}ms` } as React.CSSProperties}
  >
    {child}
  </div>
))
```

---

## 8. Iconography

**Library:** `lucide-react`

| Size | px | When |
|---|---|---|
| `size-3.5` | 14px | Inline with text (body/label context) |
| `size-4` | 16px | Default UI (buttons, inputs, form elements) |
| `size-[18px]` | 18px | Primary nav items |
| `size-5` | 20px | Card feature icons |
| `size-6` | 24px | Section headers, empty state illustrations |

**With labels:** Always in buttons, nav items, form helper text.

**Without labels:** Only when meaning is universally unambiguous: `X` (close), `Search`, `+` (add), `ChevronDown` (expand).

**Stroke width:** Use Lucide's default `strokeWidth={1.5}` for body/UI size. Reduce to `strokeWidth={1.25}` at 20px+ for a refined, editorial look.

---

## 9. Chart Styling

See `components/ui/chart-theme.ts` for Recharts-ready config objects.

### Key Decisions

**Grid:** Horizontal lines only, `surface-container` color. No vertical lines — they add visual noise on time-series data.

**Axes:** No axis lines or tick marks. Text-only in `on-surface-variant`. This keeps the chart feeling editorial rather than like a spreadsheet.

**Tooltip:** `surface-lowest` background, `shadow-overlay`, `radius-button` corners. Data values in `font-mono` for alignment.

**Confidence Intervals (MMM):** Series color at 15% opacity fill, no stroke. They should feel like "atmospheric probability" rather than hard bounds.

**Cursor:** Dashed `outline-variant` vertical line on hover. Subtle — doesn't compete with data.

### Loading State

Use `.animate-shimmer` on a container sized to match the chart. This keeps the layout stable and avoids CLS.

### Empty State

Show icon + message + sub-message. No charts, no placeholder data (never fake data in a data product — it erodes trust).

---

## 10. Do's and Don'ts

### Do

- Use asymmetrical margins in editorial layouts (e.g., left: 4rem, right: 6rem).
- Use Amber (`--success`) for positive/success states to maintain the warm personality.
- Use `font-mono` with `font-feature-settings: "tnum" 1` for all metric numbers.
- Let tonal surface shifts do structural work — no divider lines in lists.

### Don't

- Don't use 100% opaque gray borders for sectioning.
- Don't use Tailwind's default `shadow-md` / `shadow-lg` in product UI.
- Don't use standard dividers between list items — add spacing instead.
- Don't use green for success states — it breaks the warm palette personality.
- Don't use `font-sans` (Geist) — it was removed. Use `font-body` or `font-display`.
