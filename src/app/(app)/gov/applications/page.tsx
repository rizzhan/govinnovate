import { ArrowRight, Inbox } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getApplications, getChallenge } from "@/lib/data";
import { ButtonLink, Card, EmptyState, StatusBadge } from "@/components/ui";
import { applicationStatusLabels, applicationStatusTone, formatDate, formatINR } from "@/lib/format";
import { applicationStatusIcon } from "@/components/status";

export default async function GovApplications({
  searchParams,
}: {
  searchParams: Promise<{ challenge?: string }>;
}) {
  await requireRole(["government"]);
  const sp = await searchParams;
  const challengeId = sp.challenge ? Number(sp.challenge) : undefined;
  const apps = await getApplications(challengeId ? { challengeId } : undefined);
  const challenge = challengeId ? await getChallenge(challengeId) : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Startup Applications</h1>
        <p className="mt-1.5 text-sm text-ink-2">
          {challenge ? `Applications for challenge: ${challenge.title}` : "Applications across all your challenges"}
        </p>
      </div>

      {apps.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No applications received"
          body="Applications from startups for your challenges will appear here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((a) => (
            <Card key={a.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{a.startup_name}</p>
                  <p className="truncate text-xs text-ink-2">{a.challenge_title}</p>
                </div>
                <StatusBadge tone={applicationStatusTone[a.status] ?? "neutral"} icon={applicationStatusIcon[a.status]}>
                  {applicationStatusLabels[a.status] ?? a.status}
                </StatusBadge>
              </div>
              <p className="mt-3 line-clamp-3 flex-1 text-sm text-ink-2">{a.solution_summary}</p>
              <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-3 dark:border-white/10">
                <span className="text-xs text-ink-2">
                  {formatINR(a.ask_amount)} · {formatDate(a.submitted_at)}
                </span>
                <ButtonLink href={`/gov/applications/${a.id}`} variant="ghost" size="sm">
                  Review
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </ButtonLink>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}