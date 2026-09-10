import { CheckCircle2, ClipboardCheck, Clock3 } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getApplications, getEvaluationsForApplication } from "@/lib/data";
import { Card, EmptyState, StatusBadge } from "@/components/ui";
import { formatINR } from "@/lib/format";
import { EvaluationForm } from "./evaluation-form";
import { EvaluationSummary } from "./evaluation-summary";

export default async function EvaluatorDashboard() {
  const user = await requireRole(["evaluator"]);
  const shortlisted = getApplications({ status: "shortlisted" });
  const submitted = getApplications({ status: "submitted" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Evaluator Workspace</h1>
        <p className="mt-1 text-sm text-ink-2">
          Independently score shortlisted solutions on the transparent rubric. Your input drives evidence-based decisions.
        </p>
      </div>

      <Card title="Shortlisted & Pending Evaluation">
        {shortlisted.length === 0 ? (
          <EmptyState
            icon={ClipboardCheck}
            title="No solutions awaiting evaluation"
            body="Shortlisted applications will appear here for scoring."
          />
        ) : (
          <div className="space-y-4">
            {shortlisted.map((a) => {
              const myEval = getEvaluationsForApplication(a.id).find((e) => e.evaluator_user_id === user.id);
              return (
                <div key={a.id} className="glass-chip rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink">{a.startup_name}</p>
                      <p className="text-xs text-ink-2">{a.challenge_title} · Ask {formatINR(a.ask_amount)}</p>
                    </div>
                    {myEval ? (
                      <StatusBadge tone="success" icon={CheckCircle2}>
                        Evaluated
                      </StatusBadge>
                    ) : (
                      <StatusBadge tone="warning" icon={Clock3}>
                        Pending
                      </StatusBadge>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-ink-2">{a.solution_summary}</p>
                  {!myEval && <EvaluationForm application={a} />}
                  {myEval && <EvaluationSummary evaluation={myEval} />}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card title="Submitted Applications (awaiting shortlist)">
        {submitted.length === 0 ? (
          <p className="text-sm text-ink-2">No submitted applications right now.</p>
        ) : (
          <ul className="divide-y divide-black/5 dark:divide-white/10">
            {submitted.map((a) => (
              <li key={a.id} className="py-2.5">
                <p className="text-sm font-medium text-ink">{a.startup_name}</p>
                <p className="text-xs text-ink-2">{a.challenge_title} — awaiting department shortlist</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}