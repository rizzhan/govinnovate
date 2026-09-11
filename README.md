# GovInnovate

A startup-friendly public procurement mechanism that enables government departments to **identify, pilot, procure and scale** innovative solutions from eligible startups.

Built for **Smart India Hackathon 2026** as a full-stack functional platform.

---

## Problem Statement

Departments face operational problems that need innovative startup solutions, but conventional procurement is designed for standardised goods and established vendors. Startups face prior-turnover/experience bars, long sales cycles, unclear payment milestones and limited visibility of demand.

**GovInnovate** delivers a transparent, competitive and legally compliant innovation-procurement pathway with a 9-stage mechanism: challenge identification → startup discovery → eligibility screening → expert evaluation → sandbox/pilot design → milestone-based contracting → performance measurement → timely payment → evidence-based scale-up.

## How it works

| # | Stage | What happens |
|---|-------|--------------|
| 1 | Challenge Identification | Departments frame outcome-based problem statements using a standard template |
| 2 | Startup Discovery | Suitable startups matched from recognised databases; prior-turnover bars waived for DPIIT-recognised startups |
| 3 | Eligibility Screening | Transparent, minimal eligibility anchored on startup recognition + technical readiness |
| 4 | Expert Evaluation | Weighted, transparent scorecards by independent evaluators |
| 5 | Pilot Design | Controlled sandbox pilots with standard IP, data, cybersecurity & risk clauses |
| 6 | Milestone-Based Contracting | Payment tied to verifiable milestones, not one lump quantum |
| 7 | Performance Measurement | Independent validation against agreed KPIs |
| 8 | Timely Payment | Milestone-triggered, transparent payment release |
| 9 | Evidence-Based Scale | Compliant scale-up via GeM / Innovation Procurement across districts |

## Tech Stack

- **Next.js 16** (App Router, Server Components, Server Actions)
- **TypeScript**
- **Tailwind CSS v4**
- **MongoDB Atlas** via the official `mongodb` driver (numeric ids preserved, so all routes are unchanged from the original design)
- **jose** (JWT sessions) + **bcryptjs** (password hashing)
- **Vitest** (unit + data-layer tests) + **Playwright** (browser smoke tests)

## Getting Started

Prerequisites: Node 20+, and a MongoDB connection string (Atlas free tier works, or local `mongod`).

```bash
npm install
cp .env.example .env   # then fill in MONGODB_URI + SESSION_SECRET
npm run migrate        # apply database migrations (safe to re-run)
npm run seed           # create + populate the database with demo data
npm run dev            # start dev server at http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

> Note: `npm run seed` resets the database to demo state (all passwords `demo1234`).
> It **refuses to run in production** unless `ALLOW_DESTRUCTIVE_SEED=true` is set.

### Environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `MONGODB_URI` | yes | Atlas connection string, e.g. `mongodb+srv://user:pass@cluster.mongodb.net/govinnovate?retryWrites=true&w=majority` |
| `MONGODB_DB` | no | Overrides the database name from the URI |
| `SESSION_SECRET` | yes (prod) | JWT signing secret — generate with `openssl rand -base64 32`. The app refuses to boot in production without one |
| `RATE_LIMIT_STORE` | no | `memory` (default, single instance) or `mongo` (shared across instances via Atlas) |
| `ALLOW_DESTRUCTIVE_SEED` | no | Must be `"true"` to allow `npm run seed` against production |

### Tests

```bash
npm test          # Vitest: unit + data-layer suites (28 tests, in-memory Mongo)
npm run test:e2e  # Playwright browser smoke (needs the app running seeded on :3000)
```

### Deploy

**Docker (any VPS):**

```bash
docker compose up --build -d   # reads .env, serves on :3000, health-checked
```

**Vercel:** import the repo, set `MONGODB_URI` + `SESSION_SECRET` in project env, deploy. No code changes needed — DB-backed pages render dynamically and migrations run automatically on first connect (or run `npm run migrate` from CI).

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Government | `gov@example.gov.in` | `demo1234` |
| Government (Health) | `gov2@example.gov.in` | `demo1234` |
| Startup | `startup@example.com` | `demo1234` |
| Startup (MediRemote) | `startup2@example.com` | `demo1234` |
| Evaluator | `evaluator@example.com` | `demo1234` |
| Admin | `admin@govinnovate.in` | `demo1234` |

## What's implemented

**Government portal** (`/gov`)
- Create & publish outcome-based challenges
- Review applications, shortlist / reject
- Structure a pilot with standard IP / data / cybersecurity / risk clauses
- Add milestone-based payment tranches
- Verify milestones & release payments (with payment reference)
- Record independent-validation scale-up decisions and procurement pathway

**Startup portal** (`/startup`)
- Startup profile (CPIIT/DPIIT recognition, funding, stage, pitch)
- Browse & apply to open challenges (no prior-turnover requirement)
- Track application shortlist status
- Track pilot milestones, verified/paid tranches and scale-up decision

**Evaluator portal** (`/evaluator`)
- Score shortlisted solutions on a 5-criterion transparent rubric (Innovation, Feasibility, Impact, Scalability, Viability)
- Recommend shortlist / reject

**Admin portal** (`/admin`)
- Platform overview & pipeline distribution
- User & role management (including admin-assisted password resets)
- Standard templates library management
- Audit log viewer (who did what, with amounts and refs)

**Public**
- Marketing landing page with the 9-stage pathway
- Standard templates library (`/templates`) — 15 searchable templates across Challenge, Evaluation, Pilot, Legal & Compliance, Procurement and Scale-up, with preview modal and full detail views

## Demo walkthrough (60 seconds)

1. Land on the home page → **Sign in** as Government (`gov@example.gov.in` / `demo1234`).
2. Dashboard shows the pipeline. Open **Pilots** → open the *Water Quality Monitoring Pilot* to see the 4 milestone tranches, verified/paid status and payment references (PFMS refs).
3. Switch to **Startup** (`startup@example.com`) → **My Pilots** to see the milestone payment schedule from the vendor's side.
4. Try the **Evaluator** account to score a shortlisted solution, or **Browse Challenges** as a startup to see live demand and apply (no prior-turnover required).

## Project structure

```
src/
├── app/
│   ├── (app)/            # Authenticated portal (protected layout)
│   │   ├── gov/          # Government: challenges, applications, pilots
│   │   ├── startup/      # Startup: browse, apply, pilots, profile
│   │   ├── evaluator/    # Evaluator scoring workspace
│   │   ├── account/      # Self-service name, email, password
│   │   └── admin/        # Overview, users, templates, audit log
│   ├── api/health/       # Liveness probe (DB ping)
│   ├── login/            # Sign-in page
│   ├── templates/        # Public standard-templates library
│   ├── error.tsx         # Route-level recovery panel
│   ├── global-error.tsx  # Last-resort failure page
│   ├── layout.tsx
│   └── page.tsx          # Marketing landing page
├── components/           # UI kit, AppShell, PipelineVisual
├── e2e/                  # Playwright browser smoke tests
├── middleware.ts         # Nonce CSP + structured access log
└── lib/
    ├── audit.ts          # Append-only audit writer/reader
    ├── db.ts             # Mongo connection, numeric id counters
    ├── migrate.ts        # Versioned migration runner
    ├── migrations/       # 001-base (indexes, counters), 002-audit-log, …
    ├── seed.ts           # Demo data (dev only)
    ├── session.ts        # JWT session management (cookies)
    ├── session-crypto.ts # Pure sign/verify (unit-tested)
    ├── auth.ts           # DAL: role-based auth guards
    ├── data.ts           # Query layer
    ├── env.ts            # Env validation (fail-fast in prod)
    ├── rate-limit.ts     # In-process limiter (+ mongo-backed variant)
    ├── validate.ts       # Input validators
    ├── format.ts         # INR/date/status helpers
    └── actions/          # Server Actions (auth, domain, templates)
```

## Operations runbook

- **Health:** `GET /api/health` returns `{status, db, migration, uptime_s}` (`503` when the database is unreachable). Point any uptime monitor (Uptime Kuma, Better Uptime) at it.
- **Monitoring (free):** every request emits one JSON log line; every server failure is persisted to a capped `error_events` collection and surfaced with its digest at `/admin/audit` → Recent system errors. For external alerting, add a free UptimeRobot/Better Uptime check on `/api/health` (1-minute interval) pointed at your on-call channel.
- **Logs:** server errors include the digest shown to users, so reports are correlatable.
- **Deploy order:** set env → `npm run migrate` → `npm run build` → `npm run start` (or `docker compose up --build -d`).
- **Backups:** Atlas M0/M2/M5 have no automated snapshots — schedule `mongodump` or move to M10+ before holding real data.
- **Forgot password:** users change it with the current password at `/account`; otherwise an admin sets a temporary one from `/admin/users` (the reset itself is audit-logged).

## Security notes

- Passwords hashed with bcrypt; JWT sessions are HttpOnly + SameSite cookies.
- Every page and server action re-verifies the session and role.
- `SESSION_SECRET` is **required** in production — the app refuses to boot without it.
- Sign-in is rate-limited (10 attempts / 10 min per account; set `RATE_LIMIT_STORE=mongo` for shared limits across instances); put a WAF/CDN in front for network-level throttling.
- Security headers (nosniff, DENY framing, referrer policy, HSTS in prod) are set in `next.config.ts`, plus a per-request **nonce CSP** enforced by `middleware.ts` (verified violation-free by the E2E suite).
- Every governance and payment event is written to an append-only **audit log** (`/admin/audit`): publishes, approvals, milestone verify/pay with amounts and refs, scale decisions, user and template administration.
- `getCurrentUser` never loads the password hash; destructive reseed is blocked in production.