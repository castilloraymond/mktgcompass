---
name: dashboard-components
description: >
  Use when building or modifying MktgCompass dashboard UI components. Covers
  the design system (amber/orange theme from Stitch mockups), chart patterns
  (Recharts), card layouts, the AI chat panel, and budget allocator. Trigger
  whenever building React components for the MktgCompass frontend, especially
  charts, KPI cards, efficiency tables, or the interactive budget lab.
---

# Dashboard Components Skill

## Design Tokens (Tailwind Config)

```typescript
// tailwind.config.ts — extend theme
{
  extend: {
    colors: {
      brand: {
        50: '#FFFBEB',
        100: '#FEF3C7',
        200: '#FDE68A',
        300: '#FCD34D',
        400: '#FBBF24',
        500: '#F59E0B',   // primary amber
        600: '#D97706',   // primary accent (buttons, active states)
        700: '#B45309',
        800: '#92400E',
        900: '#78350F',
      },
      surface: {
        DEFAULT: '#FFFFFF',
        muted: '#F9FAFB',
        dark: '#1F2937',
      },
      grade: {
        elite: '#059669',    // A+ green
        optimal: '#2563EB',  // B blue
        scaling: '#D97706',  // C amber
        poor: '#DC2626',     // D red
      }
    },
    fontFamily: {
      display: ['Plus Jakarta Sans', 'sans-serif'],
      body: ['DM Sans', 'sans-serif'],
    }
  }
}
```

## Component Patterns

### KPICard
Used in the top row of Attribution Explorer and Overview pages.

```tsx
// Key props: label, value, delta, deltaType, subtitle
// Layout: stacked — small-caps label, large number, colored delta
// Delta: green arrow-up for positive, red arrow-down for negative
// Optional subtitle below delta

<div className="bg-white rounded-xl p-6 border border-gray-100">
  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
    {label}
  </p>
  <div className="flex items-baseline gap-3 mt-2">
    <span className="text-3xl font-bold text-gray-900">{value}</span>
    <span className={cn(
      "text-sm font-medium",
      deltaType === "positive" ? "text-green-600" : "text-red-500"
    )}>
      {deltaType === "positive" ? "↑" : "↓"} {delta}
    </span>
  </div>
  {subtitle && (
    <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
  )}
</div>
```

### WaterfallChart (Revenue Contribution Bridge)
Recharts implementation. Stacked bar chart showing baseline → contributions → total.

```tsx
// Use Recharts BarChart with custom bar shapes
// Colors: gray for baseline, orange/amber for positive, red for negative
// Labels on top of each bar showing dollar amount
// X-axis: channel names. Y-axis: revenue.
```

### SaturationCurve
Line chart showing diminishing returns per channel.

```tsx
// Use Recharts LineChart
// X-axis: spend level, Y-axis: marginal return
// Each channel is a separate line
// Mark current spend level with a dot
// Annotation showing saturation percentage
// Colors: brand-600 for primary channel, gray for others
```

### EfficiencyMatrix
Table with channel performance metrics and letter grades.

```tsx
// Columns: Source/Channel, Spend, CPA (Weighted), ROAS, Efficiency Grade
// Grade badges: rounded pills with grade colors
//   A+ ELITE: green bg, white text
//   B OPTIMAL: blue bg, white text  
//   C SCALING: amber bg, white text
// ROAS shown as colored bar (mini progress indicator)
// Channel rows have icon + name + channel type subtitle
```

### BudgetAllocator (Interactive Lab)
Slider controls for budget reallocation with real-time impact projection.

```tsx
// Right panel with channel sliders
// Each slider: channel name, current $amount, range $0 to $100K
// Total Allotted + Remaining Cap shown below
// Changes trigger re-calculation of projected lift
// "Apply Strategy" and "Reset Simulation" buttons
// "SIMULATION MODE" badge at top
// AI Suggestion card at bottom (yellow bg, sparkle icon)
```

### ChatPanel
Persistent right-side drawer for AI assistant.

```tsx
// Fixed width: 360px on desktop
// Toggle button: "Ask AI Strategist" (bottom-right FAB with sparkle icon)
// Chat messages: user (right-aligned, brand-100 bg) and assistant (left-aligned, white bg)
// Input: text area at bottom with send button
// Context-aware: shows relevant insights based on current page
// Typing indicator while waiting for Claude response
```

### InsightCard
AI-generated recommendation cards.

```tsx
// Yellow/amber background (#FEF3C7 or brand-100)
// Sparkle icon (✨) in top-left
// "AI Suggestion" or "Insight" label
// Plain English recommendation text
// Optional "Apply" or "Learn More" action button
```

## Chart Color Palette (Recharts)
```typescript
const CHART_COLORS = {
  primary: '#D97706',      // amber-600 — main channel
  secondary: '#DC2626',    // red-600 — comparison/negative
  tertiary: '#059669',     // green-600 — positive
  baseline: '#9CA3AF',     // gray-400 — baseline/reference
  muted: '#E5E7EB',        // gray-200 — grid lines
  channels: [
    '#D97706', '#DC2626', '#2563EB', '#059669', 
    '#7C3AED', '#DB2777', '#0891B2', '#65A30D'
  ],
};
```

## Layout Pattern
```
┌──────────────────────────────────────────────────┐
│ TopBar (Dashboard | Team | Resources | Search)    │
├──────────┬───────────────────────────┬───────────┤
│          │                           │           │
│ Sidebar  │    Main Content Area      │  Chat     │
│ (220px)  │    (flex-1)               │  Panel    │
│          │                           │  (360px)  │
│ Overview │    Breadcrumb > Page      │  optional │
│ Attrib.  │                           │           │
│ Insights │    [KPI Cards Row]        │  Messages │
│ Perform. │                           │           │
│ Experi.  │    [Charts / Content]     │  Input    │
│ Reports  │                           │           │
│ Settings │                           │           │
│          │                           │           │
│ +NewCamp │                           │ AskAI FAB │
│ Help     │                           │           │
│ Logout   │                           │           │
└──────────┴───────────────────────────┴───────────┘
```

## Responsive Breakpoints
- Desktop (≥1280px): Full layout with sidebar + chat panel
- Tablet (768-1279px): Sidebar collapses to icons, chat as overlay
- Mobile (<768px): Bottom navigation, chat as full-screen overlay
- MVP: Desktop-first, basic mobile responsiveness
