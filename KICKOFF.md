# MktgCompass — Project Kickoff Document

**URL:** mktgcompass.com
**Owner:** Raymond
**Last Updated:** April 2, 2026
**Target MVP:** 1 week (April 9, 2026)

---

## 1. Vision & Positioning

MktgCompass is a free, AI-powered marketing measurement platform that makes Marketing Mix Modeling (MMM) accessible to non-technical marketers. It serves as both a working tool and a portfolio showcase.

**Core value proposition:** The easiest on-ramp for marketers with zero analytics experience to measure their campaigns, understand channel performance, and make data-driven budget decisions — all through conversational AI.

**Target users:**
- Non-technical marketers at mid-size businesses or tech companies with no data science team
- Enterprise marketers who lack access to internal analytics teams and want to self-serve measurement
- Marketing leaders looking to build a business case for investing in measurement infrastructure

**Competitive angle:** Existing tools (Recast, Paramark, Stella, etc.) are either too technical, too expensive, or not agentic enough. MktgCompass wraps Google Meridian in a conversational interface that feels like talking to a marketing analyst, not configuring a Python notebook.

**Monetization:** Free for now. Freemium pricing tiers can be layered in later. Primary goal is demonstrating capability and building a portfolio.

---

## 2. Feature Scope — MVP

### Feature 1: Agentic MMM (Priority)

**Engine:** Google Meridian v1.5.x (Bayesian MMM framework)

**Interaction model:** Traditional dashboard UI with an AI assistant layer. Users interact through a chat panel that guides them through setup, data validation, model training, and result interpretation — all in plain English.

**MVP workflow:**
1. **Upload** — User uploads a CSV of weekly/monthly marketing spend + revenue/conversions by channel
2. **Validate** — AI agent screens data quality: checks for missing values, multicollinearity, minimum data length (12+ weeks), suspicious patterns. Shows an "idealized data" reference and educates user on gaps
3. **Configure** — Agent asks clarifying questions in chat: "Which column is your KPI?", "Do any channels have carryover/lag effects?", "Any known seasonal events?"
4. **Train** — Meridian model runs on serverless GPU. Progress indicator shown. Typical run: 5-15 minutes on T4
5. **Results Dashboard** — After model completes, user sees:
   - **Overview:** High-level campaign performance summary with key metrics
   - **Channel Contribution Waterfall:** Revenue decomposition bridge (baseline → channel contributions → final revenue). Similar to the "Revenue Contribution Bridge" in the Stitch mockup
   - **Diminishing Returns / Saturation Curves:** Per-channel curves showing efficiency decay at scale. Matches the "Saturation Curves" panel in the mockup
   - **Channel ROI Table:** Efficiency matrix with spend, CPA, ROAS, and efficiency grade per channel
   - **Budget Allocation Lab:** Interactive sliders to reallocate budget across channels and see projected impact on ROI and revenue. Users can toggle allocations and see what-if scenarios. Matches the "Budget Reallocation Lab" in the Stitch mockup
   - **AI Insights Panel:** Agent-generated insights like "Paid Search is nearing saturation. Shifting $15k to Social Meta will improve efficiency by 8%"
6. **Iterate** — User can ask follow-up questions: "What happens if I cut YouTube by 20%?", "Why is email showing negative returns?", "Explain the confidence interval"

**Data input (MVP):** CSV upload only. Columns: date, channel, spend, impressions (optional), revenue/conversions.

**Model maintenance:** Agent monitors for model drift and suggests re-calibration when new data is uploaded. Autonomous where possible.

### Feature 2: AutoResearch (Post-MVP, Parked for v1)

Adapted from Karpathy's autoresearch pattern for marketing experimentation. The core loop: define a metric → agent modifies a variable → runs the experiment → measures → keeps or discards → repeats.

**MVP scope (when built):**
- Experiment design assistant: helps marketers design A/B tests, geo-holdout experiments, incrementality tests
- Controlled environment mockups: shows what results would look like before running in market
- Focus on MMM-adjacent experiments initially

**Future:** Feed experiment results back into MMM as calibration priors (the Meridian ↔ AutoResearch feedback loop).

---

## 3. Information Architecture & Navigation

Based on the Stitch mockups, the app has a sidebar navigation with these sections:

```
MktgCompass
├── Overview          — Dashboard home, key metrics, recent activity
├── Attribution       — Attribution Explorer (channel-level analysis)
│                       Revenue Contribution Bridge
│                       Efficiency Matrix (by Channel / by Creative)
│                       Saturation Curves
├── Insights          — AI-generated insights and recommendations
├── Performance       — Trend analysis, time-series views
├── Experiments       — AutoResearch (parked for MVP, show "Coming Soon")
├── Reports           — Export functionality (parked for MVP)
├── Settings          — Data sources, model config, account
├── + New Campaign    — Upload new data / start new analysis
├── Help Center       — Educational content, data prep guides
└── [AI Chat Panel]   — Persistent chat drawer/panel on right side
```

**Top bar:** Dashboard | Team | Resources | Search insights | Notifications | Settings | Avatar

---

## 4. Technical Architecture

### Stack Selection Rationale

Optimized for: fastest launch, lowest cost, solo developer, Python-heavy backend (Meridian requirement).

```
┌─────────────────────────────────────────────────┐
│                    FRONTEND                       │
│  Next.js 14+ (App Router) + Tailwind CSS         │
│  Deployed on Vercel (free tier)                   │
│  Design: Google Stitch → exported to code         │
└─────────────────┬───────────────────────────────┘
                  │ REST/WebSocket API
┌─────────────────▼───────────────────────────────┐
│                    BACKEND                        │
│  Python FastAPI                                   │
│  Deployed on Railway ($5/mo hobby) or Render      │
│  Handles: auth-free API, data validation,         │
│  chat orchestration, job management               │
└───────┬─────────────────────┬───────────────────┘
        │                     │
┌───────▼───────┐   ┌────────▼────────────────────┐
│   DATABASE    │   │     GPU COMPUTE              │
│  SQLite       │   │  Modal (serverless GPU)      │
│  (MVP)        │   │  T4 GPU: ~$0.59/hr           │
│  → Supabase   │   │  $30/mo free credits         │
│  (later)      │   │  Runs Meridian MCMC sampling  │
└───────────────┘   └──────────────────────────────┘
        │
┌───────▼───────────────────────────────────────────┐
│                 LLM LAYER                          │
│  Claude API (Sonnet for speed, Opus for complex)   │
│  Handles: chat, data interpretation, insights      │
│  generation, experiment design                     │
└───────────────────────────────────────────────────┘
```

### Stack Details

| Layer | Choice | Why |
|-------|--------|-----|
| **Frontend** | Next.js 14 + Tailwind + shadcn/ui | Fast to build, great DX, Vercel deploys in seconds. Stitch designs can export to React/Tailwind |
| **Backend** | Python FastAPI | Required for Meridian (Python-only). FastAPI is lightweight, async, fast to build |
| **Database** | SQLite (MVP) → Supabase (scale) | Zero config for MVP. Supabase adds auth + realtime when needed |
| **GPU Compute** | Modal | $30/mo free credits, T4 at $0.59/hr, per-second billing, Python-native SDK, scale-to-zero. Perfect for sporadic MMM runs |
| **LLM** | Claude API (Sonnet 4) | Best quality/cost ratio for agentic chat. Raymond already has access. ~$3/M input tokens |
| **File Storage** | Local filesystem (MVP) → S3/R2 (scale) | CSV uploads stored temporarily during analysis |
| **Deployment** | Vercel (frontend) + Railway (backend) | Both have free/cheap tiers. Railway runs Python natively |
| **Auth** | None for MVP | Banner: "Demo version — do not upload sensitive data." Add Supabase Auth later |

### Cost Estimate (MVP, monthly)

| Service | Cost |
|---------|------|
| Vercel (frontend hosting) | $0 (free tier) |
| Railway (backend) | $5/mo (hobby plan) |
| Modal (GPU compute) | $0-10/mo (covered by $30 free credits, ~15 MMM runs/month) |
| Claude API | $5-20/mo (depends on usage, Sonnet is cheap) |
| Domain (mktgcompass.com) | Already owned |
| **Total** | **~$10-35/month** |

---

## 5. Data Flow — Agentic MMM

```
User uploads CSV
       │
       ▼
┌──────────────────┐
│  Data Validation  │ ← Claude agent checks: schema, completeness,
│  Agent            │   min rows (52+ weeks ideal), multicollinearity,
│                   │   stationarity, outliers
└───────┬──────────┘
        │ Pass/Fail + educational feedback
        ▼
┌──────────────────┐
│  Configuration    │ ← Claude agent interviews user:
│  Agent            │   KPI column, channel mapping, lag/adstock
│                   │   priors, known seasonality, control variables
└───────┬──────────┘
        │ Meridian config JSON
        ▼
┌──────────────────┐
│  Training Job     │ ← Dispatched to Modal serverless GPU
│  (Modal T4)       │   Meridian MCMC sampling (NUTS)
│                   │   ~5-15 min on T4
└───────┬──────────┘
        │ Model artifacts (posteriors, fitted params)
        ▼
┌──────────────────┐
│  Results          │ ← Claude agent interprets:
│  Interpretation   │   Generates natural-language insights
│  Agent            │   Populates dashboard components
│                   │   Budget optimization via Meridian optimizer
└───────┬──────────┘
        │
        ▼
   Dashboard + Chat
```

### Idealized Data Reference (Educational Component)

When data validation fails or has warnings, the agent shows users what "good" MMM data looks like:

- **Minimum 52 weeks** of weekly data (104+ weeks preferred)
- **Spend per channel per week** — no aggregation across channels
- **Revenue or conversion KPI** — aligned to same time granularity
- **Control variables** — seasonality indicators, pricing, promos, economic indicators
- **No gaps** — continuous time series
- Links to educational resources explaining why each requirement matters

---

## 6. Design System (From Google Stitch)

Based on the uploaded mockups, the design system uses:

**Colors:**
- Primary accent: Warm amber/orange (#D97706 range)
- Background: White (#FFFFFF) with light gray cards (#F9FAFB)
- Dark cards: Near-black (#1F2937) for alerts/highlights
- Text: Dark gray (#111827) primary, medium gray (#6B7280) secondary
- Success: Green for positive metrics
- Danger: Red/crimson for negative metrics or alerts
- Chart colors: Orange/amber (primary), Red (secondary), Gray (baseline)

**Typography:**
- Clean sans-serif (the mockups suggest something like Plus Jakarta Sans or DM Sans)
- Large bold numbers for KPI callouts
- Small caps for labels (e.g., "TOTAL REVENUE", "SIMULATION MODE")

**Components:**
- Card-based layout with rounded corners and subtle shadows
- Sidebar navigation with icons
- KPI cards with metric + delta indicator (↑12%, ↓4%)
- Efficiency grades (A+ ELITE, B OPTIMAL, C SCALING)
- Slider controls for budget allocation
- Waterfall/bridge charts for contribution decomposition
- Saturation curve visualizations
- AI suggestion cards (yellow background with sparkle icon)
- "Ask AI Strategist" floating action button

**Google Stitch → Code workflow:**
1. Design screens in Google Stitch using the design system above
2. Export as React/Tailwind components or reference screenshots
3. Implement in Next.js using shadcn/ui as the component base
4. Customize shadcn/ui theme to match the amber/orange design system

---

## 7. Project Structure

```
mktgcompass/
├── CLAUDE.md                          # Project intelligence for Claude Code
├── .claude/
│   └── skills/
│       ├── meridian-mmm.md            # Skill: Meridian model operations
│       ├── data-validation.md         # Skill: CSV validation patterns
│       ├── dashboard-components.md    # Skill: UI component patterns
│       └── deployment.md              # Skill: Deploy workflows
├── frontend/                          # Next.js app
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── app/
│   │   ├── layout.tsx                 # Root layout with sidebar
│   │   ├── page.tsx                   # Overview dashboard
│   │   ├── attribution/
│   │   │   └── page.tsx               # Attribution Explorer
│   │   ├── insights/
│   │   │   └── page.tsx               # AI Insights
│   │   ├── performance/
│   │   │   └── page.tsx               # Performance trends
│   │   ├── experiments/
│   │   │   └── page.tsx               # Coming Soon placeholder
│   │   ├── settings/
│   │   │   └── page.tsx               # Settings
│   │   └── api/
│   │       ├── upload/route.ts        # CSV upload endpoint
│   │       ├── chat/route.ts          # Chat proxy to backend
│   │       └── model/route.ts         # Model status/results proxy
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── ChatPanel.tsx          # Persistent AI chat drawer
│   │   ├── charts/
│   │   │   ├── WaterfallChart.tsx     # Revenue contribution bridge
│   │   │   ├── SaturationCurve.tsx    # Diminishing returns curves
│   │   │   ├── BudgetAllocator.tsx    # Interactive slider lab
│   │   │   └── EfficiencyMatrix.tsx   # Channel efficiency table
│   │   ├── cards/
│   │   │   ├── KPICard.tsx            # Metric with delta
│   │   │   ├── InsightCard.tsx        # AI suggestion card
│   │   │   └── GradeCard.tsx          # Efficiency grade badge
│   │   └── upload/
│   │       ├── CSVUploader.tsx        # Drag-and-drop upload
│   │       └── DataPreview.tsx        # Data preview table
│   └── lib/
│       ├── api.ts                     # API client
│       └── types.ts                   # TypeScript types
├── backend/                           # Python FastAPI
│   ├── pyproject.toml
│   ├── main.py                        # FastAPI app entry
│   ├── routers/
│   │   ├── upload.py                  # CSV upload + validation
│   │   ├── chat.py                    # Chat endpoint (Claude API)
│   │   ├── model.py                   # Model training + results
│   │   └── budget.py                  # Budget optimization
│   ├── services/
│   │   ├── data_validator.py          # Data quality screening
│   │   ├── meridian_runner.py         # Meridian model training
│   │   ├── meridian_interpreter.py    # Results → dashboard data
│   │   ├── budget_optimizer.py        # Budget allocation engine
│   │   └── chat_agent.py             # Claude-powered chat agent
│   ├── models/
│   │   ├── schemas.py                 # Pydantic models
│   │   └── database.py               # SQLite setup
│   ├── modal_app/
│   │   ├── train.py                   # Modal function: run Meridian
│   │   └── requirements.txt           # Meridian + deps for Modal
│   └── data/
│       ├── sample_data.csv            # Demo dataset
│       └── ideal_schema.json          # Idealized data reference
├── docs/
│   ├── data-prep-guide.md            # Educational: how to prepare MMM data
│   └── interpreting-results.md        # Educational: how to read MMM outputs
└── docker-compose.yml                 # Local dev setup
```

---

## 8. CLAUDE.md

This is the project intelligence file for Claude Code. Save this as `CLAUDE.md` in the project root.

```markdown
# CLAUDE.md — MktgCompass Project Intelligence

## Project Overview
MktgCompass (mktgcompass.com) is a free, AI-powered marketing measurement platform.
Primary feature: Agentic MMM using Google Meridian, wrapped in a conversational
interface for non-technical marketers.

## Architecture
- Frontend: Next.js 14 (App Router) + Tailwind CSS + shadcn/ui → deployed on Vercel
- Backend: Python FastAPI → deployed on Railway
- GPU Compute: Modal (serverless T4 GPU for Meridian MCMC sampling)
- LLM: Claude API (Sonnet 4) for chat agent, data interpretation, insights
- Database: SQLite (MVP) → Supabase (later)
- Auth: None for MVP. Show demo disclaimer banner.

## Key Constraints
- Target users are NON-TECHNICAL marketers. All copy, labels, and interactions
  must be in plain English. No statistical jargon without explanation.
- Google Meridian requires Python 3.11-3.13 and GPU (T4 minimum) for MCMC sampling.
- Meridian runs take 5-15 minutes. Must show progress indicator and keep user engaged.
- MVP target: 1 week. Ship fast, iterate. Cut scope aggressively.
- Free tier only. Minimize infrastructure costs ($10-35/mo budget).

## Design System
Reference the Google Stitch mockups. Key design tokens:
- Primary accent: amber/orange (#D97706)
- Cards: white with light gray backgrounds, rounded corners, subtle shadows
- KPI callouts: large bold numbers with colored delta indicators
- Charts: orange/amber primary, red secondary, gray baseline
- AI insights: yellow background cards with sparkle icon
- Efficiency grades: A+ ELITE (green), B OPTIMAL (blue), C SCALING (orange)
- Typography: Plus Jakarta Sans or DM Sans (clean sans-serif)
- Component library: shadcn/ui customized to match Stitch design

## File Conventions
- Frontend components: PascalCase (e.g., `WaterfallChart.tsx`)
- Backend modules: snake_case (e.g., `data_validator.py`)
- API routes: kebab-case (e.g., `/api/model-status`)
- All TypeScript, no JavaScript files in frontend
- Python: type hints everywhere, Pydantic for all schemas

## Development Patterns
- Frontend: Server components by default, client components only when needed
  (interactivity, state). Use `"use client"` directive explicitly.
- Backend: FastAPI with async endpoints. Background tasks for long-running ops.
- Charts: Use Recharts (available in React artifacts) for all visualizations.
- Chat: WebSocket for real-time chat, with fallback to polling.
- File uploads: Multipart form data, validate on backend, store in /tmp (MVP).

## Git Workflow
- Main branch: `main` (production-ready)
- Feature branches: `feature/<name>` (e.g., `feature/budget-allocator`)
- Use git worktrees for parallel Claude Code sessions:
  - `main-frontend` worktree for UI work
  - `main-backend` worktree for API/model work

## Commands
- Frontend dev: `cd frontend && npm run dev`
- Backend dev: `cd backend && uvicorn main:app --reload`
- Modal deploy: `cd backend/modal_app && modal deploy train.py`
- Full local: `docker-compose up`

## What NOT to do
- Don't add authentication in MVP. Use a disclaimer banner instead.
- Don't build AutoResearch/Experiments yet. Show "Coming Soon" placeholder.
- Don't build report export. Dashboard-only for MVP.
- Don't use complex state management (Redux, Zustand). React state + context is fine.
- Don't over-engineer the database. SQLite is fine for MVP.
- Don't build integrations (Google Ads, Meta, GA4). CSV upload only.

## Testing
- Backend: pytest for API endpoints and data validation logic
- Frontend: Manual testing for MVP. Add Playwright later.
- Meridian: Test with sample_data.csv (included in repo)

## Deployment Checklist
- [ ] Frontend on Vercel (connect GitHub repo)
- [ ] Backend on Railway (Dockerfile, env vars for CLAUDE_API_KEY, MODAL_TOKEN)
- [ ] Modal account setup (deploy train.py function)
- [ ] DNS: point mktgcompass.com to Vercel
- [ ] Environment variables: ANTHROPIC_API_KEY, MODAL_TOKEN_ID, MODAL_TOKEN_SECRET
```

---

## 9. Claude Code Skills

### Skill: meridian-mmm.md

```markdown
---
name: meridian-mmm
description: Use when working on Meridian MMM model training, configuration, or
  result interpretation. Covers data preparation, model specification, MCMC
  sampling, posterior analysis, budget optimization, and generating dashboard-ready
  outputs from Meridian model artifacts.
---

# Meridian MMM Skill

## Meridian Basics
- Google Meridian v1.5.x, installed via `pip install google-meridian`
- Requires Python 3.11-3.13, GPU recommended (T4 minimum)
- Uses NUTS sampler (No U-Turn Sampler) for Bayesian inference
- Key classes: `meridian.InputData`, `meridian.model.Meridian`, `meridian.optimizer`

## Data Preparation Pattern
```python
from meridian import InputData
from meridian.data import DataFrames

# Define coordinate-to-column mapping
coord_to_columns = CoordToColumns(
    time="week",
    geo="geo",  # optional for national-level
    media=["paid_search", "social_meta", "youtube", "email"],
    media_spend=["paid_search_spend", "social_meta_spend", ...],
    controls=["seasonality", "promo", "price"],
    kpi="revenue"
)

input_data = InputData(
    df=cleaned_df,
    coord_to_columns=coord_to_columns
)
```

## Model Training Pattern (Modal)
```python
import modal
app = modal.App("mktgcompass-meridian")

@app.function(
    gpu="T4",
    timeout=1800,  # 30 min max
    image=modal.Image.debian_slim()
        .pip_install("google-meridian[and-cuda]")
)
def train_meridian(config_json: str, data_csv: str) -> dict:
    # Parse config, load data, train model, return results
    ...
```

## Key Outputs to Generate
1. Channel contribution (posterior means + credible intervals)
2. ROI per channel (incremental revenue / spend)
3. Saturation curves (hill function parameters per channel)
4. Adstock/carryover parameters
5. Budget optimization (optimal allocation given total budget)
6. Waterfall decomposition (baseline + channel contributions)

## Dashboard Data Format
All Meridian outputs should be transformed into JSON matching these schemas:
- `overview_metrics`: {total_revenue, blended_roas, weighted_cpa, incrementality_lift}
- `contribution_waterfall`: [{channel, contribution_amount, is_positive}]
- `saturation_curves`: [{channel, curve_points: [{spend, marginal_return}]}]
- `efficiency_matrix`: [{channel, spend, cpa, roas, grade}]
- `budget_recommendation`: [{channel, current_spend, recommended_spend, projected_lift}]

## Common Issues
- Meridian needs at least 52 data points for reliable estimates
- Multicollinearity between channels degrades model quality
- MCMC convergence: check R-hat values, aim for < 1.1
- GPU memory: T4 (16GB) handles most national-level models fine
```

### Skill: data-validation.md

```markdown
---
name: data-validation
description: Use when validating uploaded CSV data for MMM readiness. Covers
  schema validation, data quality checks, missing value handling, multicollinearity
  detection, and generating user-friendly feedback for non-technical marketers.
---

# Data Validation Skill

## Validation Pipeline
Run these checks in order. Return results as structured feedback.

### 1. Schema Check
- Required columns: date/week, at least 1 channel spend, KPI column
- Date column must be parseable and weekly/monthly frequency
- Numeric columns must be actually numeric (no "$" or "," formatting)
- No duplicate column names

### 2. Completeness
- Minimum 52 rows (weeks) — warn if < 104
- No gaps in date sequence
- Flag columns with > 10% missing values
- Flag rows where KPI is zero or negative

### 3. Quality
- Multicollinearity: correlation matrix, flag pairs > 0.85
- Variance: flag channels with zero variance (always same spend)
- Outliers: flag values > 3 standard deviations from mean
- Stationarity: basic check that KPI isn't just a random walk

### 4. Feedback Format
For each issue, provide:
- **What:** Plain English description of the problem
- **Why it matters:** How it affects model quality
- **How to fix:** Actionable guidance
- **Severity:** Error (blocks model), Warning (degrades quality), Info (FYI)

### Example Feedback
```json
{
  "status": "warnings",
  "issues": [
    {
      "severity": "warning",
      "what": "Your dataset has 38 weeks of data",
      "why": "MMM models work best with at least 52 weeks. With less data, the model may not reliably distinguish channel effects from seasonality.",
      "fix": "If possible, extend your data to cover a full year. The model will still run, but treat results with more caution."
    }
  ]
}
```

## Idealized Data Template
Provide a downloadable CSV template showing the ideal format:
- 104 rows (2 years of weekly data)
- Columns: week, paid_search_spend, social_meta_spend, youtube_spend, email_spend, revenue
- Include example control variables: is_holiday, price_index
```

---

## 10. Implementation Playbook — Week 1 Sprint

### Day 1: Foundation
**Goal:** Repo setup, project structure, local dev running

- [ ] Create GitHub repo `mktgcompass`
- [ ] Initialize Next.js frontend with Tailwind + shadcn/ui
- [ ] Initialize Python FastAPI backend with pyproject.toml
- [ ] Create CLAUDE.md (from Section 8 above)
- [ ] Create .claude/skills/ directory with skill files
- [ ] Set up docker-compose for local dev
- [ ] Deploy "Hello World" to Vercel (frontend) and Railway (backend)
- [ ] Point mktgcompass.com DNS to Vercel

**Claude Code session:** Single session, focus on scaffolding

### Day 2: Design → Code
**Goal:** Core layout and navigation implemented

- [ ] Export Stitch designs as reference screenshots
- [ ] Build Sidebar component matching mockup (Overview, Attribution, Insights, Performance, Experiments, Reports, Settings)
- [ ] Build TopBar component (Dashboard, Team, Resources, Search, Avatar)
- [ ] Build KPICard component
- [ ] Build Overview page with placeholder data
- [ ] Add "Demo Version" disclaimer banner
- [ ] Add "Coming Soon" states for Experiments and Reports

**Claude Code session:** Frontend worktree

### Day 3: Data Pipeline
**Goal:** CSV upload → validation → structured feedback

- [ ] Build CSVUploader component (drag-and-drop)
- [ ] Build DataPreview component (shows first 10 rows)
- [ ] Backend: upload endpoint (POST /api/upload)
- [ ] Backend: data_validator.py (full validation pipeline)
- [ ] Backend: Return structured validation feedback
- [ ] Frontend: Display validation results with educational guidance
- [ ] Include sample_data.csv for demo/testing

**Claude Code session:** Two worktrees — frontend + backend in parallel

### Day 4: Meridian Integration
**Goal:** Model training pipeline working end-to-end

- [ ] Set up Modal account, deploy Meridian training function
- [ ] Backend: meridian_runner.py (dispatches to Modal, polls status)
- [ ] Backend: model status endpoint (GET /api/model/{id}/status)
- [ ] Backend: model results endpoint (GET /api/model/{id}/results)
- [ ] Frontend: Training progress indicator (polling model status)
- [ ] Test full pipeline: upload CSV → validate → train on Modal → get results
- [ ] Transform Meridian output → dashboard JSON format

**Claude Code session:** Backend-focused, test with sample data

### Day 5: Results Dashboard
**Goal:** All dashboard views rendering with real model output

- [ ] Build WaterfallChart (Revenue Contribution Bridge)
- [ ] Build SaturationCurve (per-channel diminishing returns)
- [ ] Build EfficiencyMatrix (channel performance table with grades)
- [ ] Build BudgetAllocator (interactive sliders + projected impact)
- [ ] Build InsightCard (AI-generated recommendations)
- [ ] Wire all components to actual model results from API
- [ ] Attribution Explorer page assembled and working

**Claude Code session:** Frontend worktree, heavy chart work

### Day 6: AI Chat Agent
**Goal:** Conversational AI layer working

- [ ] Backend: chat_agent.py using Claude API
- [ ] System prompt for the marketing analyst persona
- [ ] Context injection: feed model results into chat context
- [ ] Frontend: ChatPanel component (persistent right-side drawer)
- [ ] Chat can answer: "Why is YouTube underperforming?", "What if I increase Meta by 20%?"
- [ ] Budget reallocation via chat commands → updates BudgetAllocator

**Claude Code session:** Full-stack, both worktrees

### Day 7: Polish & Ship
**Goal:** Production-ready MVP live at mktgcompass.com

- [ ] End-to-end testing with sample data
- [ ] Error handling for all failure modes (bad CSV, Modal timeout, API errors)
- [ ] Loading states for all async operations
- [ ] Mobile responsiveness (basic)
- [ ] SEO: meta tags, OG image
- [ ] Deploy final version to Vercel + Railway
- [ ] Verify Modal function deployed and working
- [ ] Test from fresh browser — full user journey

---

## 11. Claude Code Workflow — Practical Guide

### Initial Setup

```bash
# Clone and enter repo
git clone git@github.com:raymond/mktgcompass.git
cd mktgcompass

# Create CLAUDE.md from this doc's Section 8
# Create .claude/skills/ with skill files from Section 9

# Start Claude Code
claude
```

### Parallel Sessions with Git Worktrees

```bash
# Create worktrees for parallel development
git worktree add ../mktgcompass-frontend feature/frontend
git worktree add ../mktgcompass-backend feature/backend

# Terminal 1: Frontend Claude Code session
cd ../mktgcompass-frontend
claude

# Terminal 2: Backend Claude Code session
cd ../mktgcompass-backend
claude
```

### Recommended Claude Code Commands

```bash
# In Claude Code, use these patterns:

# Sprint planning
"Read CLAUDE.md and the meridian-mmm skill. Today we're building the
data validation pipeline. Here's the plan: [paste Day 3 tasks]"

# Design implementation
"Here's a screenshot of the Stitch design for the Attribution Explorer.
Implement this in Next.js matching the design system in CLAUDE.md.
Use Recharts for charts, shadcn/ui for components."

# Meridian integration
"Read the meridian-mmm skill. Write the Modal function that accepts
a config JSON and CSV data, trains a Meridian model, and returns
the results in the dashboard JSON format defined in the skill."

# End of session
"Summarize what we built today and update CLAUDE.md with any new
patterns or decisions we established."
```

### Settings for Autonomous Runs

In `~/.claude/settings.json`, configure permissions for overnight runs:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(npx *)",
      "Bash(uvicorn *)",
      "Bash(pytest *)",
      "Bash(modal *)",
      "Bash(git *)",
      "Read(*)",
      "Write(frontend/**)",
      "Write(backend/**)"
    ]
  }
}
```

---

## 12. Chat Agent System Prompt

The AI assistant powering the chat panel should use this system prompt:

```
You are the MktgCompass AI Strategist — a friendly, expert marketing analyst
who helps non-technical marketers understand their campaign performance.

PERSONALITY:
- Warm, approachable, and encouraging
- Explains statistical concepts in plain English with analogies
- Never uses jargon without explaining it
- Proactively suggests actions ("Based on the saturation curve, I'd recommend...")
- Celebrates wins ("Your Meta campaigns are performing really well!")

CONTEXT:
You have access to the user's MMM model results including:
- Channel-level ROI and contribution estimates
- Saturation/diminishing returns curves
- Budget optimization recommendations
- Confidence intervals and model diagnostics

CAPABILITIES:
- Answer questions about model results in plain English
- Explain what specific metrics mean and why they matter
- Run what-if budget scenarios ("What if I move $10k from YouTube to Meta?")
- Suggest budget reallocation based on the optimization output
- Flag potential issues (channel saturation, data quality concerns)
- Educate users on MMM concepts when asked

CONSTRAINTS:
- Always caveat uncertainty: "The model estimates X with Y% confidence"
- Never claim certainty about causal effects — MMM is correlational with causal assumptions
- If asked about things outside MMM scope, redirect: "That's a great question — MMM measures channel-level effects, but for creative-level testing you'd want an A/B test"
- Remind users this is a demo version if they try to make real budget decisions
```

---

## 13. Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Meridian MCMC fails on user data | Users see error, lose trust | Robust error handling, fallback to simplified model, clear error messages |
| Modal cold starts slow (2-4s) | Perceived sluggishness | Show engaging loading states, educational content while waiting |
| Model takes 15+ min on complex data | User abandons | Email notification when ready, save results to revisit later |
| Non-technical users upload garbage data | Model produces nonsense | Data validation agent catches issues upfront, educational guidance |
| Claude API costs spike | Budget overrun | Rate limiting, response caching, use Haiku for simple queries |
| User uploads sensitive PII | Privacy/legal risk | Prominent disclaimer, auto-delete uploads after 24h, never persist raw data |

---

## 14. Post-MVP Roadmap (In Priority Order)

1. **Data source integrations** — Google Ads API, Meta Ads API, GA4
2. **Authentication** — Supabase Auth, save analyses per user
3. **AutoResearch v1** — Experiment design assistant
4. **Report export** — PDF/PPTX generation of results
5. **Model comparison** — Run multiple models, compare outputs
6. **Experiment → MMM calibration loop** — Feed incrementality results as Meridian priors
7. **Freemium pricing** — Free (1 model/month), Pro ($49/mo unlimited), Team ($199/mo)
8. **SOC2/GDPR compliance** — EU data residency, encrypted storage
9. **Team collaboration** — Shared dashboards, commenting
10. **PyMC-Marketing as alternative engine** — More flexibility for advanced users
