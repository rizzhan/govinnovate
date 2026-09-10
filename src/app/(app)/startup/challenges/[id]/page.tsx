import { ArrowRight, Radio, XCircle } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getChallenge, getApplications } from "@/lib/data";
import { notFound } from "next/navigation";
import { ButtonLink, Card, StatusBadge } from "@/components/ui";
import { applicationStatusLabels, applicationStatusTone, challengeStatusLabels, formatDate, formatINR } from "@/lib/format";
import { applicationStatusIcon, challengeStatusIcon } from "@/components/status";
import { ApplyForm } from "./apply-form";

export default async function StartupChallengeDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(["startup"]);
  const { id } = await params;
  const challenge = getChallenge(Number(id));
  if (!challenge) notFound();

  const myApps = getApplications({ startupUserId: user.id, challengeId: challenge.id });
  const myApp = myApps[0];
  const info = challengeStatusLabels[challenge.status] ?? { label: challenge.status, tone: "neutral" as const };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-ink-3">{challenge.department}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">{challenge.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <StatusBadge tone={info.tone} icon={challengeStatusIcon[challenge.status]}>
              {info.label}
            </StatusBadge>
            <span className="text-sm text-ink-2">{challenge.sector}</span>
            <span className="text-sm text-ink-2">· Budget {formatINR(challenge.budget_min)} – {formatINR(challenge.budget_max)}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Problem Description">
          <p className="whitespace-pre-line text-sm text-ink-2">{challenge.description}</p>
        </Card>
        <Card title="Desired Outcome">
          <p className="whitespace-pre-line text-sm text-ink-2">{challenge.outcome_statement}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-black/5 pt-4 text-sm dark:border-white/10">
            <div>
              <p className="text-xs text-ink-3">Timeline</p>
              <p className="font-medium text-ink">{challenge.timeline || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-ink-3">Published</p>
              <p className="font-medium text-ink">{formatDate(challenge.created_at)}</p>
            </div>
          </div>
        </Card>
      </div>

      {challenge.status === "open" && !myApp && (
        <Card title="Submit your Application">
          <p className="mb-4 text-sm text-ink-2">
            No prior government turnover required. If DPIIT-recognised (or willing to register), you are eligible.
          </p>
          <ApplyForm challengeId={challenge.id} />
        </Card>
      )}

      {myApp && (
        <Card title="Your Application">
          <div className="flex items-center justify-between gap-3">
            <StatusBadge tone={applicationStatusTone[myApp.status] ?? "neutral"} icon={applicationStatusIcon[myApp.status]}>
              {applicationStatusLabels[myApp.status] ?? myApp.status}
            </StatusBadge>
            <span className="text-sm text-ink-3">Submitted {formatDate(myApp.submitted_at)}</span>
          </div>
          <div className="mt-4 glass-chip rounded-2xl p-4">
            <p className="font-medium text-ink">Your Solution</p>
            <p className="mt-1 text-sm text-ink-2">{myApp.solution_summary}</p>
            <p className="mt-3 text-xs text-ink-3">Ask: {formatINR(myApp.ask_amount)}</p>
          </div>
          {myApp.status === "shortlisted" && (
            <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-accent/20 bg-accent/10 p-4 text-sm text-accent">
              <Radio className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <p>
                <span className="font-medium">Your application has been shortlisted.</span> The department will structure
                an evaluation and pilot.
              </p>
            </div>
          )}
          {myApp.status === "rejected" && (
            <div className="mt-3 flex items-start gap-2.5 rounded-2xl bg-critical/10 p-4 text-sm text-[#c22f2f]">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <p>This application was not shortlisted. You can apply to other open challenges.</p>
            </div>
          )}
          {myApp.status === "selected" && (
            <div className="mt-3">
              <ButtonLink href="/startup/pilots">
                Go to My Pilots
                <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}