"use client";

import { Fragment, useState } from "react";
import {
  Check,
  ChevronDown,
  ClipboardCheck,
  FileSignature,
  FlaskConical,
  Gauge,
  ListChecks,
  Radar,
  Rocket,
  Target,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const stages: { n: string; icon: LucideIcon; title: string; desc: string; barrier: string }[] = [
  {
    n: "01",
    icon: Target,
    title: "Challenge",
    desc: "Departments publish outcome-based problem statements co-created on standard templates — what must improve, not how to build it.",
    barrier: "Replaces vague tenders with measurable, time-bound outcomes.",
  },
  {
    n: "02",
    icon: Radar,
    title: "Discover",
    desc: "Startups are surfaced from recognised startup databases and matched to departmental problems automatically.",
    barrier: "Opens demand visibility to startups that never see tenders.",
  },
  {
    n: "03",
    icon: ListChecks,
    title: "Screen",
    desc: "Minimal, transparent eligibility based on DPIIT recognition and declared technical readiness.",
    barrier: "Waives prior-turnover and years-of-experience bars.",
  },
  {
    n: "04",
    icon: ClipboardCheck,
    title: "Evaluate",
    desc: "Independent evaluators score solutions on a weighted, published rubric — like-for-like comparison.",
    barrier: "Fair, evidence-based comparison without incumbency bias.",
  },
  {
    n: "05",
    icon: FlaskConical,
    title: "Pilot",
    desc: "Controlled sandbox pilots with standard IP, data, cybersecurity and risk clauses.",
    barrier: "Lets departments test innovation at low, shared risk.",
  },
  {
    n: "06",
    icon: FileSignature,
    title: "Contract",
    desc: "Milestone-based contracting where payments are tied to verifiable results — not to time served.",
    barrier: "Aligned cash flow for startups, accountability for departments.",
  },
  {
    n: "07",
    icon: Gauge,
    title: "Measure",
    desc: "Independent validation of pilot outcomes against agreed KPIs and targets.",
    barrier: "Honest measurement replaces vendor self-reporting.",
  },
  {
    n: "08",
    icon: Wallet,
    title: "Pay",
    desc: "Milestone-triggered payments tracked transparently and released within SLA — via PFMS.",
    barrier: "Ends long, uncertain government sales cycles.",
  },
  {
    n: "09",
    icon: Rocket,
    title: "Scale",
    desc: "Evidence-based scale via GeM or Innovation Procurement pathways across districts.",
    barrier: "One compliant route from successful pilot to statewide deployment.",
  },
];

export default function Lifecycle() {
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Mobile — compact accordion timeline */}
      <div className="space-y-1.5 md:hidden">
        {stages.map((s, i) => {
          const open = active === i;
          const Icon = s.icon;
          return (
            <div key={s.n} className="flex gap-3">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setActive(open ? -1 : i)}
                  aria-expanded={open}
                  aria-controls={`m-life-${s.n}`}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-all duration-200 ${
                    open
                      ? "border-accent/40 bg-accent text-white shadow-[0_6px_16px_rgba(0,113,227,0.3)]"
                      : "border-black/10 bg-white/70 text-ink-2 dark:border-white/10 dark:bg-white/5 dark:text-white/70"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </button>
                {i < stages.length - 1 && <span className="my-0.5 w-px flex-1 bg-black/10 dark:bg-white/10" />}
              </div>
              <div className="min-w-0 flex-1 pb-4">
                <button
                  type="button"
                  onClick={() => setActive(open ? -1 : i)}
                  aria-expanded={open}
                  aria-controls={`m-life-${s.n}`}
                  className="flex w-full items-center justify-between gap-2 text-left"
                >
                  <span className="flex items-baseline gap-2">
                    <span
                      className={`text-[11px] font-semibold tracking-[0.12em] ${
                        open ? "text-accent" : "text-ink-3"
                      }`}
                    >
                      {s.n}
                    </span>
                    <span className={`text-[15px] font-medium ${open ? "text-ink" : "text-ink-2"}`}>
                      {s.title}
                    </span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-ink-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                <div
                  id={`m-life-${s.n}`}
                  className={`grid transition-all duration-300 ${
                    open ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pl-8 text-sm leading-relaxed text-ink-2">{s.desc}</p>
                    <p className="mt-1.5 pl-8 text-xs text-ink-3">
                      <span className="font-medium text-ink-2">Barrier removed:</span> {s.barrier}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop — horizontal timeline + shared detail panel */}
      <div className="hidden md:block">
        <div className="flex items-start" role="group" aria-label="Procurement stages">
          {stages.map((s, i) => {
            const activeStage = active === i;
            const Icon = s.icon;
            return (
              <Fragment key={s.n}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={activeStage}
                  className="group flex min-w-0 flex-[2] flex-col items-center gap-1.5 outline-offset-4"
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-200 ${
                      activeStage
                        ? "border-[#EA6A0A]/40 bg-gradient-to-br from-[#EA6A0A] to-[#0E7A3C] text-white shadow-[0_8px_20px_rgba(200,110,10,0.35)]"
                        : "border-black/10 bg-white/80 text-ink-2 group-hover:border-accent/30 group-hover:text-accent dark:border-white/10 dark:bg-white/10 dark:text-white/60 dark:group-hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                    {s.n}
                  </span>
                  <span
                    className={`text-[11px] font-medium leading-tight ${
                      activeStage ? "text-accent" : "text-ink-2 group-hover:text-ink dark:group-hover:text-white"
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
                  {i < stages.length - 1 && (
                    <div
                      aria-hidden
                      className="mt-[23px] h-0.5 min-w-2 flex-1 rounded-full bg-accent/25"
                    />
                  )}
                </Fragment>
              );
            })}
          </div>

        <div
          key={active}
          className="glass-strong animate-fade-in mt-7 flex flex-col gap-5 rounded-[1.75rem] p-6 sm:flex-row sm:items-center sm:p-7"
        >
          <span
            className="text-gradient bg-clip-text text-[2.75rem] font-semibold leading-none tracking-tight md:w-20"
            aria-hidden
          >
            {stages[active].n}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold tracking-tight text-ink">{stages[active].title}</h3>
            <p className="mt-1 max-w-2xl text-[15px] leading-relaxed text-ink-2">{stages[active].desc}</p>
          </div>
          <p className="flex items-start gap-2 text-sm text-ink-2 sm:max-w-[16rem] sm:border-l sm:border-black/5 sm:pl-5 sm:dark:border-white/10">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-verified" aria-hidden />
            <span>
              <span className="font-medium text-ink">Why it matters:</span> {stages[active].barrier}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}