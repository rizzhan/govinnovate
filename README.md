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
- **better-sqlite3** (local SQLite database, no external service needed)
- **jose** (JWT sessions) + **bcryptjs** (password hashing)

## Getting Started

```bash
npm install
npm run seed      # create + populate the database with demo data
npm run dev       # start dev server at http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

> Note: `npm run seed` resets the database to demo state (all passwords `demo1234`).

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
- User & role management
- Standard templates library management

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
│   │   └── admin/        # Overview, users, templates
│   ├── login/            # Sign-in page
│   ├── templates/        # Public standard-templates library
│   ├── layout.tsx
│   └── page.tsx          # Marketing landing page
├── components/           # UI kit, AppShell, PipelineVisual
└── lib/
    ├── db.ts             # SQLite connection + schema
    ├── seed.ts           # Demo data
    ├── session.ts        # JWT session management
    ├── auth.ts           # DAL: role-based auth guards
    ├── data.ts           # Query layer
    ├── format.ts         # INR/date/status helpers
    └── actions/          # Server Actions (auth, domain, templates)
```

## Security notes (demo scope)

- Passwords hashed with bcrypt; JWT sessions are HttpOnly + SameSite cookies.
- Every page and server action re-verifies the session and role.
- `SESSION_SECRET` defaults are fine for local demo — set `SESSION_SECRET` env var for real deployments.