import {
  Activity,
  BadgeCheck,
  Coins,
  FlaskConical,
  Gauge,
  Inbox,
  ShieldCheck,
  Target,
  TrendingUp,
} from "lucide-react";
import { StatusBadge } from "@/components/ui";
import { formatINR } from "@/lib/format";
import type { LandingStats } from "./Sections";

/* ---- Challenge dashboard preview ---------------------------------------- */

export function DashboardPreview({
  stats,
  totalContracted,
}: {
  stats: LandingStats;
  totalContracted: number;
}) {
  const cells = [
    { icon: Target, label: "Active challenges", value: stats.challenges, accent: "bg-accent/10 text-accent" },
    { icon: Inbox, label: "Applications", value: stats.applications, accent: "bg-violet/10 text-violet" },
    { icon: BadgeCheck, label: "Eligible startups", value: stats.eligible, accent: "bg-verified/15 text-[#1f8a3d]" },
    { icon: FlaskConical, label: "Active pilots", value: stats.pilots, accent: "bg-pending/15 text-[#9a4a00]" },
  ];
  return (
    <div className="glass-strong flex h-full flex-col rounded-[1.75rem] p-6 sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-tight text-ink">Challenge dashboard</p>
          <p className="text-xs text-ink-3">Smart Cities Mission · Ministry of Urban Development</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-verified/15 px-2.5 py-1 text-[11px] font-medium text-[#1f8a3d] dark:bg-verified/20 dark:text-[#32d74b]">
          <span className="h-1.5 w-1.5 rounded-full bg-verified" aria-hidden />
          Live
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {cells.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="rounded-2xl border border-black/5 bg-white/70 p-4 transition-colors hover:border-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.accent}`}>
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-ink tabular-nums">{c.value}</p>
              <p className="mt-0.5 text-[12px] text-ink-3">{c.label}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between rounded-2xl bg-black/5 px-4 py-3 dark:bg-white/10">
          <span className="text-[13px] text-ink-2">Commitments contracted (pilot value)</span>
          <span className="text-[15px] font-semibold text-ink tabular-nums">{formatINR(totalContracted)}</span>
        </div>
      </div>
    </div>
  );
}

/* ---- Evaluation preview -------------------------------------------------- */

export type EvalRecord = {
  criteria: { label: string; score: number }[];
  average: number;
  evaluator: string;
  org: string;
  recommendation: string;
  comment: string;
};

const evalMeta: { label: string; weight: string }[] = [
  { label: "Innovation & novelty", weight: "20%" },
  { label: "Feasibility & readiness", weight: "25%" },
  { label: "Expected impact", weight: "20%" },
  { label: "Scalability", weight: "20%" },
  { label: "Cost & viability", weight: "15%" },
];

export function EvaluationPreview({ record }: { record: EvalRecord | null }) {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold tracking-tight text-ink">Expert evaluation</p>
        {record && (
          <StatusBadge tone="info" icon={ShieldCheck}>
            Shortlisted
          </StatusBadge>
        )}
      </div>
      {record ? (
        <>
          <div className="space-y-2.5">
            {record.criteria.map((c, i) => (
              <div key={c.label} className="flex items-center gap-3">
                <span className="w-36 shrink-0 text-xs text-ink-2">{c.label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/8 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-violet transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(4, c.score * 10))}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-xs font-semibold text-ink tabular-nums">
                  {c.score.toFixed(1)}
                </span>
                <span className="hidden w-9 shrink-0 text-right text-[11px] text-ink-3 sm:block">{evalMeta[i]?.weight}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-accent/8 px-4 py-2.5 dark:bg-accent/15">
            <span className="text-xs text-ink-2">Weighted average</span>
            <span className="text-sm font-semibold text-accent tabular-nums">
              {record.average.toFixed(1)} / 10 · {Math.round(record.average * 10)} / 100
            </span>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-2">
            <span className="font-medium text-ink">Evaluator note:</span> “{record.comment}”
          </p>
          <p className="mt-2 text-xs text-ink-3">
            {record.evaluator} · {record.org}
          </p>
        </>
      ) : (
        <p className="text-sm text-ink-3">No evaluation record in the demo workspace yet.</p>
      )}
    </div>
  );
}

/* ---- Pilot + KPI preview ------------------------------------------------- */

export type KpiRow = { kpi: string; target: string; actual: string; onTrack: boolean };

const PilotNote = Activity;

export function PilotPreview({
  title,
  kpis,
  paidValue,
  verifiedValue,
  scaleNote,
}: {
  title: string;
  kpis: KpiRow[];
  paidValue: number;
  verifiedValue: number;
  scaleNote?: string;
}) {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="truncate text-sm font-semibold tracking-tight text-ink" title={title}>
          {title}
        </p>
        <StatusBadge tone="violet" icon={FlaskConical}>
          Piloting
        </StatusBadge>
      </div>
      <div className="overflow-hidden rounded-2xl border border-black/8 dark:border-white/10">
        {kpis.length === 0 ? (
          <p className="bg-white/60 px-3.5 py-4 text-[13px] text-ink-3 dark:bg-white/5">
            No milestones recorded yet — performance figures appear once the pilot defines tranches.
          </p>
        ) : (
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-black/8 bg-black/5 text-[11px] uppercase tracking-wide text-ink-3 dark:border-white/10 dark:bg-white/5">
              <th className="px-3.5 py-2 font-medium">KPI</th>
              <th className="px-3 py-2 font-medium">Target</th>
              <th className="px-3 py-2 font-medium">Actual</th>
              <th className="px-3.5 py-2 text-right font-medium">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/8 dark:divide-white/10">
            {kpis.map((k) => (
              <tr key={k.kpi} className="bg-white/60 dark:bg-white/5">
                <td className="px-3.5 py-2.5 font-medium text-ink">{k.kpi}</td>
                <td className="px-3 py-2.5 text-ink-2 tabular-nums">{k.target}</td>
                <td className="px-3 py-2.5 font-medium text-ink tabular-nums">{k.actual}</td>
                <td className="px-3.5 py-2.5 text-right">
                  <StatusBadge tone={k.onTrack ? "success" : "neutral"} icon={k.onTrack ? BadgeCheck : Gauge}>
                    {k.onTrack ? "On target" : "Watch"}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs text-ink-2">
          <PilotNote className="h-3.5 w-3.5 text-ink-3" aria-hidden />
          {paidValue > 0 ? (
            <>
              <Coins className="h-3.5 w-3.5 text-verified" aria-hidden />
              Paid {formatINR(paidValue)}
            </>
          ) : (
            "Milestone payments track verified results"
          )}
        </span>
        {verifiedValue > 0 && (
          <span className="text-xs text-ink-2">
            {verifiedValue} verified · <BadgeCheck className="inline h-3.5 w-3.5 text-verified" aria-hidden /> tied to exit criteria
          </span>
        )}
      </div>
      {scaleNote && (
        <p className="mt-3 rounded-xl bg-black/5 px-3.5 py-2.5 text-xs leading-relaxed text-ink-2 dark:bg-white/10">
          <TrendingUp className="mr-1.5 inline h-3.5 w-3.5 text-verified" aria-hidden />
          {scaleNote}
        </p>
      )}
    </div>
  );
}