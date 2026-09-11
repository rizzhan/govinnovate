import { requireRole } from "@/lib/auth";
import { getChallenge, getApplications, getPilots, isChallengeVisible } from "@/lib/data";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ButtonLink, Card, StatusBadge, SubmitButton } from "@/components/ui";
import {
  applicationStatusLabels,
  applicationStatusTone,
  challengeStatusLabels,
  formatDate,
  formatINR,
} from "@/lib/format";
import { applicationStatusIcon, challengeStatusIcon } from "@/components/status";
import PipelineVisual from "@/components/PipelineVisual";
import { publishChallenge } from "@/lib/actions/domain";

export default async function ChallengeDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(["government"]);
  const { id } = await params;
  const challenge = await getChallenge(Number(id));
  if (!challenge || !isChallengeVisible(user, challenge)) notFound();

  const applications = await getApplications({ challengeId: challenge.id });
  const pilots = await getPilots({ challengeId: challenge.id });
  const info =
    challengeStatusLabels[challenge.status] ?? { label: challenge.status, tone: "neutral" as const };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-ink-3">Challenge #{challenge.id}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">{challenge.title}</h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
            <StatusBadge tone={info.tone} icon={challengeStatusIcon[challenge.status]}>
              {info.label}
            </StatusBadge>
            <span className="text-sm text-ink-2">{challenge.sector}</span>
            <span className="text-sm text-ink-2">
              · Budget {formatINR(challenge.budget_min)} – {formatINR(challenge.budget_max)}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {challenge.status === "draft" && (
            <form action={publishChallenge}>
              <input type="hidden" name="id" value={challenge.id} />
              <SubmitButton variant="secondary">Publish Challenge</SubmitButton>
            </form>
          )}
          {applications.length > 0 && challenge.status === "open" && (
            <ButtonLink href={`/gov/applications?challenge=${challenge.id}`}>
              Review Applications ({applications.length})
            </ButtonLink>
          )}
          {applications.length > 0 && (challenge.status === "evaluate" || challenge.status === "piloting") && (
            <ButtonLink href={`/gov/applications?challenge=${challenge.id}`}>
              Applications ({applications.length})
            </ButtonLink>
          )}
        </div>
      </div>

      <Card>
        <PipelineVisual currentStatus={challenge.status} />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Problem Description">
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-2">{challenge.description}</p>
        </Card>
        <Card title="Desired Outcome">
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-2">{challenge.outcome_statement}</p>
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-black/5 pt-5 text-sm dark:border-white/10">
            <div>
              <p className="text-xs text-ink-3">Department</p>
              <p className="mt-0.5 font-medium text-ink">{challenge.department}</p>
            </div>
            <div>
              <p className="text-xs text-ink-3">Timeline</p>
              <p className="mt-0.5 font-medium text-ink">{challenge.timeline || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-ink-3">Budget</p>
              <p className="mt-0.5 font-medium text-ink">
                {formatINR(challenge.budget_min)} – {formatINR(challenge.budget_max)}
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-3">Created</p>
              <p className="mt-0.5 font-medium text-ink">{formatDate(challenge.created_at)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title={applications.length ? `Applications (${applications.length})` : "Applications"}>
        {applications.length === 0 ? (
          <p className="text-sm text-ink-2">No applications received yet.</p>
        ) : (
          <div className="divide-y divide-black/5 dark:divide-white/10">
            {applications.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-medium text-ink">{a.startup_name}</p>
                  <p className="truncate text-xs text-ink-2">
                    {a.tech_readiness} · Ask {formatINR(a.ask_amount)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge tone={applicationStatusTone[a.status] ?? "neutral"} icon={applicationStatusIcon[a.status]}>
                    {applicationStatusLabels[a.status] ?? a.status}
                  </StatusBadge>
                  <ButtonLink href={`/gov/applications/${a.id}`} variant="ghost" size="sm">
                    View
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </ButtonLink>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {pilots.length > 0 && (
        <Card title="Pilot">
          {pilots.map((p) => (
            <ButtonLink key={p.id} href={`/gov/pilots/${p.id}`} variant="secondary">
              View Pilot: {p.title}
            </ButtonLink>
          ))}
        </Card>
      )}
    </div>
  );
}