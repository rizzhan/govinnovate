import { CheckCircle2, XCircle } from "lucide-react";
import { StatusBadge } from "@/components/ui";

export function EvaluationSummary({ evaluation }: { evaluation: Record<string, any> }) {
  const scores: [string, number][] = [
    ["Innovation", Number(evaluation.innovation_score)],
    ["Feasibility", Number(evaluation.feasibility_score)],
    ["Impact", Number(evaluation.impact_score)],
    ["Scalability", Number(evaluation.scalability_score)],
    ["Viability", Number(evaluation.viability_score)],
  ];
  const avg = scores.reduce((s, [, v]) => s + v, 0) / scores.length;
  const isShortlist = evaluation.recommendation === "shortlist";
  return (
    <div className="mt-4 rounded-2xl border border-verified/20 bg-verified/10 p-3.5 dark:border-verified/25 dark:bg-verified/15">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-[#1f8a3d] dark:text-[#32d74b]">
          Your evaluation · avg {avg.toFixed(1)} / 10
        </p>
        <StatusBadge tone={isShortlist ? "success" : "danger"} icon={isShortlist ? CheckCircle2 : XCircle}>
          {isShortlist ? "Shortlist" : "Reject"}
        </StatusBadge>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5 text-xs">
        {scores.map(([label, v]) => (
          <span key={label} className="rounded-lg bg-black/5 px-2 py-1 text-ink-2 dark:bg-white/10 dark:text-white/70">
            {label} <b className="text-ink dark:text-white">{v}/10</b>
          </span>
        ))}
      </div>
      {evaluation.comments && <p className="mt-2 text-xs text-ink-2">{evaluation.comments}</p>}
    </div>
  );
}