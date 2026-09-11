"use client";

import { Check, X } from "lucide-react";
import { submitEvaluation } from "@/lib/actions/domain";
import { inputCls } from "@/components/ui";

const criteria = [
  ["innovation_score", "Innovation & Novelty"],
  ["feasibility_score", "Feasibility & Readiness"],
  ["impact_score", "Expected Impact"],
  ["scalability_score", "Scalability"],
  ["viability_score", "Cost & Viability"],
];

export function EvaluationForm({ application }: { application: { id: number; startup_name: string } }) {
  return (
    <form action={submitEvaluation} className="mt-4 space-y-3 border-t border-black/5 pt-4 dark:border-white/10">
      <input type="hidden" name="application_id" value={application.id} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {criteria.map(([name, label]) => (
          <div key={name}>
            <label className="mb-1 block text-[11px] font-medium text-ink-3">{label}</label>
            <select name={name} required className={inputCls} defaultValue="7">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <textarea
        name="comments"
        rows={2}
        className={inputCls}
        placeholder="Brief comments supporting your scores..."
      />
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2.5">
          <button
            type="submit"
            name="recommendation"
            value="shortlist"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_8px_20px_rgba(180,83,9,0.3)] transition-all hover:bg-accent-dark active:scale-[0.97]"
          >
            <Check className="h-4 w-4" aria-hidden />
            Shortlist
          </button>
          <button
            type="submit"
            name="recommendation"
            value="reject"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium text-critical backdrop-blur transition-colors hover:bg-white active:scale-[0.97] dark:border-white/10 dark:bg-white/10 dark:text-red-400 dark:hover:bg-white/15"
          >
            <X className="h-4 w-4" aria-hidden />
            Reject
          </button>
        </div>
        <span className="text-xs text-ink-3">Scoring on transparent rubric</span>
      </div>
    </form>
  );
}