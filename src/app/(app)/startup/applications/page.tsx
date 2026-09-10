import { Inbox, RefreshCcw } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getApplications } from "@/lib/data";
import { Card, EmptyState, StatusBadge } from "@/components/ui";
import { applicationStatusLabels, applicationStatusTone, formatDate, formatINR } from "@/lib/format";
import { applicationStatusIcon } from "@/components/status";

export default async function StartupApplications() {
  const user = await requireRole(["startup"]);
  const apps = getApplications({ startupUserId: user.id });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">My Applications</h1>
        <p className="mt-1 text-sm text-ink-2">Track your submissions and shortlist status in real time.</p>
      </div>

      {apps.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No applications yet"
          body="Browse open challenges and submit your first application."
        />
      ) : (
        <div className="space-y-3">
          {apps.map((a) => (
            <Card key={a.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{a.challenge_title}</p>
                  <p className="text-xs text-ink-2">{a.department}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge tone={applicationStatusTone[a.status] ?? "neutral"} icon={applicationStatusIcon[a.status]}>
                    {applicationStatusLabels[a.status] ?? a.status}
                  </StatusBadge>
                  <span className="text-xs text-ink-2">Ask {formatINR(a.ask_amount)} · {formatDate(a.submitted_at)}</span>
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-ink-2">{a.solution_summary}</p>
              {a.status === "shortlisted" && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-2xl bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
                  <RefreshCcw className="h-3.5 w-3.5" aria-hidden />
                  Shortlisted — awaiting department evaluation decision
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}