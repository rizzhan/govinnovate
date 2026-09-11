import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronRight,
  ClipboardCheck,
  Coins,
  Eye,
  FileCheck2,
  FlaskConical,
  Inbox,
  Landmark,
  Lightbulb,
  ListChecks,
  Radar,
  Rocket,
  Scale,
  Send,
  Settings2,
  ShieldCheck,
  Stethoscope,
  Stamp,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { templateIcons } from "@/components/template-icons";

/* ---- Section heading ---------------------------------------------------- */

export function SectionHeading({
  eyebrow,
  title,
  sub,
  center = true,
  className = "",
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}>
      <p className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent backdrop-blur dark:border-white/10 dark:bg-white/5">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance text-ink sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{sub}</p>}
    </div>
  );
}

/* ---- Hero: how it works strip ------------------------------------------- */

const flowSteps: { icon: LucideIcon; label: string }[] = [
  { icon: Landmark, label: "Government Challenge" },
  { icon: Lightbulb, label: "Startup" },
  { icon: FlaskConical, label: "Pilot" },
  { icon: FileCheck2, label: "Evidence" },
  { icon: Scale, label: "Procurement" },
  { icon: TrendingUp, label: "Scale" },
];

export function FlowStrip() {
  return (
    <div className="glass-strong rounded-3xl px-5 py-4 sm:px-6 sm:py-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">How the mechanism works</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-xs font-medium text-accent transition-colors hover:text-accent-dark"
        >
          See it live
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>

      {/* Desktop row — equal slots, icons pinned to a shared baseline */}
      <div className="hidden sm:grid sm:grid-cols-6">
        {flowSteps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="relative flex flex-col items-center gap-1.5 px-3 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/5 bg-white/80 text-accent shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-white/10 dark:text-sky-300">
                <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden />
              </span>
              <span className="text-[11px] font-medium leading-snug text-ink-2">{s.label}</span>
              {i < flowSteps.length - 1 && (
                <ChevronRight
                  className="absolute -right-2 top-[14px] h-4 w-4 text-ink-3/60"
                  strokeWidth={1.8}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Compact mobile grid */}
      <div className="grid grid-cols-3 gap-2 sm:hidden">
        {flowSteps.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center gap-2 rounded-xl px-2 py-1.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden />
              </span>
              <span className="text-xs font-medium leading-tight text-ink-2">{s.label.replace("Government ", "")}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Pipeline funnel (example values, clearly labelled) ----------------- */

export type FunnelStep = { n: string; label: string; sub: string };

export function Funnel({ steps }: { steps: FunnelStep[] }) {
  return (
    <div className="relative">
      <div
        className="absolute inset-x-4 top-0 h-[3px] rounded-full bg-gradient-to-r from-accent via-violet to-verified opacity-80"
        aria-hidden
      />
      <div className="grid grid-cols-2 gap-x-4 gap-y-9 pt-6 sm:grid-cols-3 lg:grid-cols-6">
        {steps.map((f, i) => (
          <div key={f.label} className="relative">
            <span
              className="absolute -top-[1.19rem] left-0 h-2 w-px bg-black/15 dark:bg-white/20"
              aria-hidden
            />
            <p className="text-[11px] font-medium tracking-[0.14em] text-ink-3">
              0{i + 1}
            </p>
            <p className="text-4xl font-semibold tracking-tight text-ink tabular-nums">{f.n}</p>
            <p className="mt-1 text-[13px] font-medium leading-tight text-ink">{f.label}</p>
            <p className="text-xs text-ink-3">{f.sub}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-[13px] leading-relaxed text-ink-3">
        Live values from the demo workspace — act in the portals and this funnel moves with the data.
        Every stage above is an auditable record inside the product, not a claim.
      </p>
    </div>
  );
}

/* ---- Government + Startup journeys -------------------------------------- */

const govPath: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Activity, title: "Problem", desc: "An unmet need or failing process in a department." },
  { icon: Target, title: "Outcome-based Challenge", desc: "Published with measurable success criteria." },
  { icon: Radar, title: "Startup Discovery", desc: "Eligible startups surfaced from a verified pool." },
  { icon: ClipboardCheck, title: "Evaluation", desc: "Independent evaluators on a weighted scorecard." },
  { icon: FlaskConical, title: "Controlled Pilot", desc: "Low-risk, sandboxed deployment with standard terms." },
  { icon: Scale, title: "Evidence-based Procurement", desc: "GeM rate contract or innovation procurement path." },
];

const startupPath: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Eye, title: "Demand Visibility", desc: "See what departments actually need before building." },
  { icon: ListChecks, title: "Eligibility", desc: "Minimal and DPIIT-aligned — no prior-turnover bar." },
  { icon: Send, title: "Application", desc: "One solution summary, one ask, no lengthy DPRs." },
  { icon: ClipboardCheck, title: "Evaluation", desc: "Compared fairly on a published rubric." },
  { icon: FlaskConical, title: "Pilot", desc: "A real deployment on standard IP and data terms." },
  { icon: Coins, title: "Milestone Payment", desc: "Paid only on independently verified results." },
  { icon: Rocket, title: "Government Scale", desc: "Grow district by district, guided by evidence." },
];

function Path({
  icon: HeadIcon,
  title,
  hook,
  steps,
  accent,
}: {
  icon: LucideIcon;
  title: string;
  hook: string;
  steps: { icon: LucideIcon; title: string; desc: string }[];
  accent: string;
}) {
  return (
    <div>
      <div className="flex items-start gap-3.5">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${accent}`}>
          <HeadIcon className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-ink">{title}</h3>
          <p className="mt-0.5 text-sm text-ink-2">{hook}</p>
        </div>
      </div>
      <ol className="mt-6">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <li key={s.title} className="relative flex gap-3.5 pb-5 last:pb-0">
              {i < steps.length - 1 && (
                <span className="absolute left-[15px] top-8 h-[calc(100%-1.25rem)] w-px bg-black/10 dark:bg-white/10" aria-hidden />
              )}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.65rem] border border-black/5 bg-white/80 text-ink-2 dark:border-white/10 dark:bg-white/10 dark:text-white/70">
                <Icon className="h-4 w-4" strokeWidth={1.9} aria-hidden />
              </span>
              <div className="pt-1">
                <p className="text-sm font-medium text-ink">
                  <span className="mr-2 text-xs font-semibold tabular-nums text-ink-3">0{i + 1}</span>
                  {s.title}
                </p>
                <p className="mt-0.5 text-[13px] leading-snug text-ink-3">{s.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function Journeys() {
  return (
    <div className="grid gap-x-12 gap-y-12 lg:grid-cols-2">
      <Path
        icon={Building2}
        title="For Government Departments"
        hook="From a departmental problem to a defensible procurement decision."
        steps={govPath}
        accent="bg-accent/10 text-accent"
      />
      <div className="relative">
        <span className="absolute inset-y-0 left-0 hidden w-px bg-black/5 dark:bg-white/10 lg:block" aria-hidden />
        <div className="lg:pl-12">
          <Path
            icon={Lightbulb}
            title="For Startups"
            hook="From demand visibility to milestone-paid government scale."
            steps={startupPath}
            accent="bg-violet/10 text-violet"
          />
        </div>
      </div>
    </div>
  );
}

/* ---- Four roles as mini workbench previews ------------------------------ */

export type LandingStats = {
  challenges: number;
  openChallenges: number;
  applications: number;
  eligible: number;
  startups: number;
  pilots: number;
  scaled: number;
  paidMilestones: number;
  pendingEvaluations: number;
  users: number;
  templates: number;
};

type RoleRow = { icon: LucideIcon; label: string; value?: number; right?: string };

const roleDefs: {
  key: string;
  icon: LucideIcon;
  name: string;
  accent: string;
  rows: (stats: LandingStats) => RoleRow[];
}[] = [
  {
    key: "government",
    icon: Building2,
    name: "Government Departments",
    accent: "bg-accent/10 text-accent",
    rows: (s) => [
      { icon: Target, label: "Active challenges", value: s.challenges },
      { icon: Inbox, label: "Eligible startups", value: s.eligible },
      { icon: Activity, label: "Pilot monitoring", value: s.pilots },
      { icon: Stamp, label: "Procurement decisions", value: s.scaled },
    ],
  },
  {
    key: "startup",
    icon: Lightbulb,
    name: "Startups",
    accent: "bg-violet/10 text-violet",
    rows: (s) => [
      { icon: Radar, label: "Open opportunities", value: s.openChallenges },
      { icon: ListChecks, label: "Eligibility", right: "DPIIT-aligned" },
      { icon: Coins, label: "Milestone payments", value: s.paidMilestones },
      { icon: Rocket, label: "Scale pathway", right: "Ready" },
    ],
  },
  {
    key: "evaluator",
    icon: Stethoscope,
    name: "Expert Evaluators",
    accent: "bg-pending/15 text-[#9a4a00]",
    rows: (s) => [
      { icon: Inbox, label: "Evaluation queue", value: s.pendingEvaluations },
      { icon: ListChecks, label: "Weighted scorecard", right: "5 criteria" },
      { icon: FileCheck2, label: "Evidence required", right: "Mandatory" },
      { icon: Stamp, label: "Recommendation", right: "Recorded" },
    ],
  },
  {
    key: "admin",
    icon: Settings2,
    name: "Platform Admin",
    accent: "bg-verified/15 text-[#1f8a3d]",
    rows: (s) => [
      { icon: Users, label: "Users & roles", value: s.users },
      { icon: FileCheck2, label: "Standard templates", value: s.templates },
      { icon: ShieldCheck, label: "Governance", right: "On rails" },
      { icon: Radar, label: "Pipeline monitoring", right: "Live" },
    ],
  },
];

export function Roles({ stats }: { stats: LandingStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {roleDefs.map((r) => {
        const Icon = r.icon;
        return (
          <div
            key={r.key}
            className="glass lift overflow-hidden rounded-3xl transition-all duration-200 hover:-translate-y-0.5"
          >
            {/* mini window chrome */}
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-3.5 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${r.accent}`}>
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-sm font-semibold tracking-tight text-ink">{r.name}</span>
              </div>
              <span className="flex items-center gap-1" aria-hidden>
                <span className="h-1.5 w-1.5 rounded-full bg-black/15 dark:bg-white/20" />
                <span className="h-1.5 w-1.5 rounded-full bg-black/15 dark:bg-white/20" />
                <span className="h-1.5 w-1.5 rounded-full bg-accent/50" />
              </span>
            </div>
            <div className="divide-y divide-black/5 px-5 py-2 dark:divide-white/10">
              {r.rows(stats).map((row) => {
                const RowIcon = row.icon;
                return (
                  <div key={row.label} className="flex items-center gap-3 py-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/5 text-ink-3 dark:bg-white/10 dark:text-white/50">
                      <RowIcon className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13px] text-ink-2">{row.label}</span>
                    {row.value !== undefined && (
                      <span className="text-sm font-semibold text-ink tabular-nums">{row.value}</span>
                    )}
                    {row.right && (
                      <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-medium text-ink-2 dark:bg-white/10 dark:text-white/60">
                        {row.right}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---- Transparency: decision record -------------------------------------- */

export function Transparency({
  record,
  provenance,
}: {
  record: { icon: LucideIcon; label: string; value: string; tone: "success" | "neutral" }[] | null;
  provenance: string;
}) {
  const toneCls = {
    success: "bg-verified/15 text-[#1f8a3d] dark:bg-verified/20 dark:text-[#32d74b]",
    neutral: "bg-black/5 text-ink-2 dark:bg-white/10 dark:text-white/65",
  };
  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
      <div>
        <div className="glass-strong rounded-[1.75rem] p-6 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold tracking-tight text-ink">Why a solution progresses</p>
            <span className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-medium text-ink-2 dark:bg-white/10 dark:text-white/60">
              Decision record
            </span>
          </div>
          {record ? (
            <div className="space-y-2.5">
              {record.map((r) => {
                const Icon = r.icon;
                return (
                  <div
                    key={r.label}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-black/5 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneCls[r.tone]}`}>
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="truncate text-sm font-medium text-ink">{r.label}</span>
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${toneCls[r.tone]}`}>
                      {r.value}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-ink-3">Demo data not loaded yet — sign in to see live records.</p>
          )}
        </div>
        <p className="mt-3 text-xs text-ink-3">{provenance}</p>
      </div>

      <div className="lg:pt-2">
        <h3 className="text-lg font-semibold tracking-tight text-ink">Every stage leaves an audit trail</h3>
        <ul className="mt-5 space-y-4">
          {[
            {
              t: "Scores are weighted and published",
              d: "Candidates are compared on the same rubric — innovation, feasibility, impact, scalability and viability.",
            },
            {
              t: "Payments follow verification",
              d: "Milestone money is released only after an independent check against agreed exit criteria.",
            },
            {
              t: "Scale-up is evidence-based",
              d: "A recommendation to scale cites validated KPIs, a procurement pathway and target districts.",
            },
          ].map((item) => (
            <li key={item.t} className="flex gap-3">
              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              <div>
                <p className="text-sm font-medium text-ink">{item.t}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-ink-3">{item.d}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---- Templates / compliance band ---------------------------------------- */

const templateCategories: { key: string; label: string }[] = [
  { key: "challenge", label: "Challenge" },
  { key: "evaluation", label: "Evaluation" },
  { key: "pilot", label: "Pilot" },
  { key: "legal", label: "Legal & Compliance" },
  { key: "procurement", label: "Procurement" },
  { key: "scale", label: "Scale-up" },
];

export function TemplatesBand() {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-md">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">Compliance, by default</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance text-ink sm:text-3xl">
          Procurement-ready template pack
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
          Problem statements, evaluation scorecards, pilot agreements, IP/data clauses and scale-up guides —
          so departments ship compliance, not paperwork.
        </p>
        <Link
          href="/templates"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-dark"
        >
          Browse all templates
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
      <div className="grid max-w-xl flex-1 grid-cols-2 gap-2.5 sm:grid-cols-3">
        {templateCategories.map((c) => {
          const Icon = templateIcons[c.key];
          return (
            <span
              key={c.key}
              className="flex items-center gap-2.5 rounded-xl border border-black/5 bg-white/70 px-3.5 py-3 dark:border-white/10 dark:bg-white/5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Icon className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span className="text-[13px] font-medium text-ink">{c.label}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Final CTA ----------------------------------------------------------- */

export function FinalCTA() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">Smart India Hackathon 2026</p>
      <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        Start a challenge. <span className="text-gradient">Ship a solution.</span>
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink-2">
        One transparent mechanism — from an outcome-based problem statement to evidence-based scale. Sign in
        with a demo role and walk the entire lifecycle.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/login"
          className="w-full rounded-full bg-accent px-7 py-3 text-center font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_12px_28px_rgba(0,113,227,0.35)] transition-all hover:bg-accent-dark active:scale-[0.98] sm:w-auto"
        >
          Explore the platform
        </Link>
        <Link
          href="/templates"
          className="w-full rounded-full border border-black/10 bg-white/60 px-7 py-3 text-center font-semibold text-ink backdrop-blur transition-colors hover:bg-white active:scale-[0.98] sm:w-auto dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
        >
          View standard templates
        </Link>
      </div>
    </div>
  );
}