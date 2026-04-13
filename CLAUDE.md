# CLAUDE.md — MktgCompass Project Intelligence

## Project Overview
MktgCompass (mktgcompass.com) is a free, AI-powered marketing measurement platform.
Primary feature: Agentic MMM using Google Meridian, wrapped in a conversational
interface for non-technical marketers. Built as a solo venture and portfolio showcase.

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
See `DESIGN_SYSTEM.md` for the canonical design reference. Direction is ChronoTask-inspired:
light neutral surfaces (`#F7F8FA`/`#FFFFFF`/`#EEF0F4`), DM Sans everywhere, single `#2563EB`
blue accent, 16px card radius, subtle shadows, single-accent chart palette with amber reserved
for Paid Search. Tokens live in `frontend/app/globals.css`.

Do NOT revert to the retired navy (`#131b2e`) or warm-brown (`#855300`) directions. Do NOT
swap in Manrope/Inter/Bricolage/Plus Jakarta — DM Sans is committed.

Layout: Sidebar (260px expanded, 64px collapsed) + main content area (max 1200px) + optional
chat drawer on the right.

## Navigation Structure
```
Sidebar:
  - Overview (dashboard home)
  - Attribution (channel analysis, waterfall, efficiency matrix)
  - Insights (AI-generated recommendations)
  - Performance (trend analysis)
  - Experiments (Coming Soon placeholder)
  - Reports (Coming Soon placeholder)
  - Settings

Top bar: Dashboard | Team | Resources | Search insights | Notifications | Settings | Avatar
Persistent: "+ New Campaign" button in sidebar, ChatPanel drawer on right
```

## File Conventions
- Frontend components: PascalCase (e.g., `WaterfallChart.tsx`)
- Backend modules: snake_case (e.g., `data_validator.py`)
- API routes: kebab-case (e.g., `/api/model-status`)
- All TypeScript in frontend, no plain JavaScript files
- Python: type hints on all functions, Pydantic for all request/response schemas
- CSS: Tailwind utility classes only, no separate CSS files except globals.css

## Development Patterns

### Frontend
- Server components by default, client components only when needed (interactivity, state)
- Use `"use client"` directive explicitly at top of interactive components
- Charts: Recharts for all data visualizations
- State: React useState + useContext. No Redux or Zustand.
- Data fetching: React Server Components or SWR for client-side polling
- File uploads: react-dropzone for drag-and-drop CSV upload

### Backend
- FastAPI with async endpoints everywhere
- Background tasks (BackgroundTasks) for long-running operations (model training)
- Pydantic v2 models for all request/response schemas
- CORS configured for Vercel frontend domain
- Claude API calls via `anthropic` Python SDK
- Modal SDK for dispatching Meridian training jobs

### Meridian Integration
- Modal function with T4 GPU, 30-minute timeout
- Input: config JSON + CSV data (base64 encoded)
- Output: JSON with posteriors, contributions, saturation params, optimization results
- Transform Meridian output → dashboard-ready JSON before sending to frontend
- Cache model results in SQLite keyed by data hash

## Git Workflow
- Main branch: `main` (production-ready)
- Feature branches: `feature/<name>` (e.g., `feature/budget-allocator`)
- Commit messages: conventional commits (`feat:`, `fix:`, `chore:`)
- Use git worktrees for parallel Claude Code sessions:
  - `main-frontend` worktree for UI work
  - `main-backend` worktree for API/model work

## Commands
```bash
# Frontend
cd frontend && npm run dev          # Dev server on :3000
cd frontend && npm run build        # Production build
cd frontend && npm run lint         # ESLint check

# Backend
cd backend && uvicorn main:app --reload --port 8000   # Dev server
cd backend && pytest                                    # Run tests

# Modal
cd backend/modal_app && modal deploy train.py          # Deploy GPU function
cd backend/modal_app && modal run train.py              # Test locally

# Full stack
docker-compose up                   # Everything locally
```

## Environment Variables
```
# Backend (.env)
ANTHROPIC_API_KEY=sk-ant-...        # Claude API for chat agent
MODAL_TOKEN_ID=...                  # Modal GPU compute
MODAL_TOKEN_SECRET=...
DATABASE_URL=sqlite:///./mktgcompass.db

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000   # Backend URL (local)
# In production: https://api.mktgcompass.com or Railway URL
```

## What NOT to do
- Don't add authentication in MVP. Use a disclaimer banner instead.
- Don't build AutoResearch/Experiments yet. Show "Coming Soon" placeholder.
- Don't build report export. Dashboard-only for MVP.
- Don't use complex state management (Redux, Zustand). React state + context is fine.
- Don't over-engineer the database. SQLite is fine for MVP.
- Don't build integrations (Google Ads, Meta, GA4). CSV upload only for MVP.
- Don't add email notifications. In-app only for MVP.
- Don't add team/collaboration features. Single-user only for MVP.

## Testing
- Backend: pytest for API endpoints and data validation logic
- Frontend: Manual testing for MVP. Add Playwright later.
- Meridian: Test with sample_data.csv included in repo (2 years of synthetic data)
- Always test the full pipeline: upload → validate → train → results → chat

## Deployment
- Frontend: Vercel (auto-deploy on push to main)
- Backend: Railway (Dockerfile, auto-deploy on push to main)
- Modal: Manual deploy via `modal deploy` (or CI/CD later)
- DNS: mktgcompass.com → Vercel, api.mktgcompass.com → Railway

## Key Dependencies
### Frontend
- next: ^14.x
- react: ^18.x
- recharts: for all charts
- @shadcn/ui: component library
- react-dropzone: file upload
- swr: client-side data fetching
- lucide-react: icons

### Backend
- fastapi: web framework
- uvicorn: ASGI server
- anthropic: Claude API SDK
- modal: serverless GPU SDK
- google-meridian: MMM engine (installed on Modal, not on Railway)
- pandas: data manipulation
- pydantic: schema validation
- python-multipart: file upload handling
