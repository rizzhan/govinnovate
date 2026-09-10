import { ArrowRight, CheckCircle2, FlaskConical } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getPilots, getMilestones } from "@/lib/data";
import { ButtonLink, Card, EmptyState, StatusBadge } from "@/components/ui";
import { formatINR, milestoneStatusLabels, pilotStatusLabels, pilotStatusTone } from "@/lib/format";
import { pilotStatusIcon } from "@/components/status";

export default async function StartupPilots() {
  const user = await requireRole(["startup"]);
  const pilots = getPilots({ startupUserId: user.id });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">My Pilots</h1>
        <p className="mt-1 text-sm text-ink-2">
          Milestone-based contracts with time-bound, verified payments.
        </p>
      </div>

      {pilots.length === 0 ? (
        <EmptyState
          icon={FlaskConical}
          title="No pilots awarded yet"
          body="Pilots are awarded after successful shortlisting and evaluation."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {pilots.map((p) => {
            const ms = getMilestones(p.id);
            const paid = ms.filter((m) => m.status === "paid");
            const next = ms.find((m) => m.status === "pending" || m.status === "verified");
            return (
              <Card key={p.id} className="flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{p.title}</p>
                    <p className="text-xs text-ink-2">{p.challenge_title}</p>
                  </div>
                  <StatusBadge tone={pilotStatusTone[p.status] ?? "violet"} icon={pilotStatusIcon[p.status]}>
                    {pilotStatusLabels[p.status] ?? p.status}
                  </StatusBadge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-ink-3">Contracted</p>
                    <p className="font-medium text-ink">{formatINR(p.budget)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-3">Received</p>
                    <p className="font-medium text-[#1f8a3d]">{formatINR(paid.reduce((s, m) => s + Number(m.amount), 0))}</p>
                  </div>
                </div>
                <div className="mt-3 glass-chip rounded-2xl p-3">
                  <p className="text-xs font-medium text-ink-2">
                    {next ? (
                      <>
                        Next milestone: <span className="font-semibold text-ink">{next.title}</span> ·{" "}
                        {milestoneStatusLabels[next.status]} · {formatINR(next.amount)}
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[#1f8a3d]">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                        All milestones paid
                      </span>
                    )}
                  </p>
                </div>
                <div className="mt-4 border-t border-black/5 pt-3 dark:border-white/10">
                  <ButtonLink href={`/startup/pilots/${p.id}`} variant="secondary" className="w-full justify-center">
                    Track Milestones & Payments
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </ButtonLink>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}