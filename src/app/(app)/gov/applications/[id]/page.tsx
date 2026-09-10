import { CheckCircle2, FlaskConical, XCircle } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getApplication, getEvaluationsForApplication, getPilots } from "@/lib/data";
import { notFound } from "next/navigation";
import { ButtonLink, Card, SubmitButton, StatusBadge } from "@/components/ui";
import { applicationStatusLabels, applicationStatusTone, formatDate, formatINR } from "@/lib/format";
import { applicationStatusIcon } from "@/components/status";
import { updateApplicationStatus } from "@/lib/actions/domain";

export default async function GovApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["government"]);
  const { id } = await params;
  const app = await getApplication(Number(id));
  if (!app) notFound();

  const evaluations = await getEvaluationsForApplication(app.id);
  const pilots = (await getPilots({ challengeId: app.challenge_id })).filter((p) => p.application_id === app.id);

  const statusBtn = (status: string, label: string, variant: "primary" | "danger") => (
    <form action={updateApplicationStatus} className="inline">
      <input type="hidden" name="id" value={app.id} />
      <input type="hidden" name="status" value={status} />
      <SubmitButton variant={variant}>{label}</SubmitButton>
    </form>
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-ink-3">
            Application #{app.id} · {app.challenge_title}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">{app.startup_name}</h1>
          <div className="mt-2.5 flex items-center gap-2.5">
            <StatusBadge tone={applicationStatusTone[app.status] ?? "neutral"} icon={applicationStatusIcon[app.status]}>
              {applicationStatusLabels[app.status] ?? app.status}
            </StatusBadge>
            <span className="text-sm text-ink-2">{app.startup_org}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {app.status === "submitted" && statusBtn("shortlisted", "Shortlist for Evaluation", "primary")}
          {app.status === "submitted" && statusBtn("rejected", "Reject", "danger")}
          {app.status === "shortlisted" && (
            <ButtonLink href={`/gov/applications/${app.id}/pilot`}>
              <FlaskConical className="h-4 w-4" aria-hidden />
              Structure Pilot
            </ButtonLink>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Solution Summary">
          <p className="text-sm leading-relaxed text-ink-2">{app.solution_summary}</p>
        </Card>
        <Card title="Technological Readiness">
          <p className="text-sm leading-relaxed text-ink-2">{app.tech_readiness}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">
            <span className="font-medium text-ink">Differentiator:</span> {app.differentiator}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-black/5 pt-5 text-sm dark:border-white/10">
            <div>
              <p className="text-xs text-ink-3">Funding Ask</p>
              <p className="mt-0.5 font-medium text-ink">{formatINR(app.ask_amount)}</p>
            </div>
            <div>
              <p className="text-xs text-ink-3">Submitted</p>
              <p className="mt-0.5 font-medium text-ink">{formatDate(app.submitted_at)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title={`Expert Evaluations (${evaluations.length})`}>
        {evaluations.length === 0 ? (
          <p className="text-sm text-ink-2">
            No evaluations yet. Evaluators will score this application on the standard rubric.
          </p>
        ) : (
          <div className="space-y-4">
            {evaluations.map((e) => (
              <div key={e.id} className="glass-chip rounded-2xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-ink">{e.evaluator_name}</p>
                  <StatusBadge
                    tone={e.recommendation === "shortlist" ? "success" : "warning"}
                    icon={e.recommendation === "shortlist" ? CheckCircle2 : XCircle}
                  >
                    {e.recommendation === "shortlist" ? "Shortlist" : e.recommendation}
                  </StatusBadge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-center sm:grid-cols-5">
                  {[
                    ["Innovation", e.innovation_score],
                    ["Feasibility", e.feasibility_score],
                    ["Impact", e.impact_score],
                    ["Scalability", e.scalability_score],
                    ["Viability", e.viability_score],
                  ].map(([label, score]) => (
                    <div key={label as string} className="rounded-2xl bg-white py-2.5 shadow-sm dark:bg-white/10">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-ink-3">{label}</p>
                      <p className="mt-0.5 text-sm font-bold text-ink">{Number(score).toFixed(1)}/10</p>
                    </div>
                  ))}
                </div>
                {e.comments && <p className="mt-4 border-t border-black/5 pt-3 text-sm text-ink-2 dark:border-white/10">{e.comments}</p>}
              </div>
            ))}
          </div>
        )}
      </Card>

      {pilots.length > 0 && (
        <Card title="Pilot">
          <div className="space-y-2">
            {pilots.map((p) => (
              <ButtonLink key={p.id} href={`/gov/pilots/${p.id}`} variant="secondary">
                View Pilot: {p.title}
              </ButtonLink>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}