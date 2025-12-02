# BPAS1 Project Memory Bank

This file captures the working rules, recent progress, and state so we can resume quickly in new sessions.

## Branching & Git Flow
- Work on feature branches (prefix `feature/...`), then merge into `develop`.
- Use non-fast-forward merges (`--no-ff`) to keep the feature graph visible.
- Do not commit `package-lock.json` (ignored via `.gitignore`).

## Runtime / Tooling
- Current Node on this machine: v25.2.1. No engines set; preferred LTS is Node 20.x if pinning later.
- Backend: Express + Prisma (SQLite at `backend/prisma/dev.db` with absolute path in `.env`).
- Frontend: Vite + React; uses axios instance with auth token and toast interceptor.

## Backend Notes
- Prisma schema includes extended `Client` fields (phone, email, address, notes).
- Routes include clients (GET/POST/PUT/DELETE), projects, cards, planning, pipeline, auth, AI prefill, sync, etc.
- Logging writes to `/tmp/bpas-backend.log` via shared logger/util; global error handler and 404 logging enabled.
- Staff seed exists: `staff@example.com` / `123456`. Owner creds depend on DB seed.

## Frontend Notes
- Theme tokens and layout polish applied (top nav + sidebar, modern cards/spacing).
- Toast system added (global `ToastProvider`, window.__toast used for API actions).
- Auth-aware routing: `/` redirects to Dashboard (Owner) or Field Today (Staff); Field link hidden for Owner.
- Offline/PWA scaffolding: zustand sync status store, sync indicators, Dexie queue scaffold, Vite PWA plugin.
- Pagination added to Clients and Projects lists (10 per page).
- Key pages polished: Login, Pipeline, Planning (clear button fixed), Clients/Projects, ClientView, ProjectView, CreateCard, Dashboard, FieldToday/FieldCard.

## Open/Recent Tasks
- Ensure future features continue via dedicated branches with `--no-ff` merge to develop.
- If pinning Node version, add `engines` and/or `.nvmrc` targeting Node 20.x.
- Playwright tests exist (e2e and AE offline sync); currently may be skipped/failing depending on backend data.

## Environment / Secrets
- `.env` files remain untracked; keep OPENAI keys and DATABASE_URL there. Do not commit secrets.
