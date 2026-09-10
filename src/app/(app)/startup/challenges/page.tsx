import { Check, Eye } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getChallenges, getApplications } from "@/lib/data";
import { ButtonLink, Card, EmptyState, StatusBadge } from "@/components/ui";
import { challengeStatusLabels, formatDate, formatINR } from "@/lib/format";
import { challengeStatusIcon } from "@/components/status";

export default async function StartupChallenges() {
  const user = await requireRole(["startup"]);
  const challenges = getChallenges();
  const myApps = getApplications({ startupUserId: user.id });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Browse Department Challenges</h1>
        <p className="mt-1 text-sm text-ink-2">
          Visibility into live departmental demand. Apply with no prior-turnover or experience requirements.
        </p>
      </div>

      {challenges.length === 0 ? (
        <EmptyState title="No challenges published yet" body="Check back soon — departments are framing outcome-based challenges." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((c) => {
            const info = challengeStatusLabels[c.status] ?? { label: c.status, tone: "neutral" as const };
            const applied = myApps.some((a) => a.challenge_id === c.id);
            return (
              <Card key={c.id} className="flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium text-accent">{c.department}</p>
                  <StatusBadge tone={info.tone} icon={challengeStatusIcon[c.status]}>
                    {info.label}
                  </StatusBadge>
                </div>
                <h3 className="mt-1 font-semibold text-ink">{c.title}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-2">{c.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-ink-2">
                  <span>Budget {formatINR(c.budget_min)} – {formatINR(c.budget_max)}</span>
                  <span>{formatDate(c.created_at)}</span>
                </div>
                <div className="mt-4 border-t border-black/5 pt-3 dark:border-white/10">
                  {c.status === "open" ? (
                    applied ? (
                      <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-verified/15 px-4 py-2 text-center text-sm font-medium text-[#1f8a3d]">
                        <Check className="h-4 w-4" aria-hidden />
                        Applied
                      </span>
                    ) : (
                      <ButtonLink href={`/startup/challenges/${c.id}`} className="w-full justify-center">
                        View & Apply
                      </ButtonLink>
                    )
                  ) : (
                    <ButtonLink href={`/startup/challenges/${c.id}`} variant="secondary" className="w-full justify-center">
                      <Eye className="h-4 w-4" aria-hidden />
                      View Details
                    </ButtonLink>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}