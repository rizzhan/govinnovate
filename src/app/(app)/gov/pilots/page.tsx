import { ArrowRight, FlaskConical } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getPilots, getChallenge, getMilestones } from "@/lib/data";
import { ButtonLink, Card, EmptyState, StatusBadge } from "@/components/ui";
import { formatDate, formatINR, pilotStatusLabels, pilotStatusTone } from "@/lib/format";
import { pilotStatusIcon } from "@/components/status";

export default async function GovPilots({ searchParams }: { searchParams: Promise<{ challenge?: string }> }) {
  await requireRole(["government"]);
  const sp = await searchParams;
  const challengeId = sp.challenge ? Number(sp.challenge) : undefined;
  const pilots = getPilots(challengeId ? { challengeId } : undefined);
  const challenge = challengeId ? getChallenge(challengeId) : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Pilot Contracts</h1>
        <p className="mt-1.5 text-sm text-ink-2">
          {challenge ? `Pilots for challenge: ${challenge.title}` : "All active pilots and contract milestones"}
        </p>
      </div>

      {pilots.length === 0 ? (
        <EmptyState
          icon={FlaskConical}
          title="No pilots yet"
          body="Structured pilots will appear here with their deliverables and milestones."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pilots.map((p) => {
            const milestones = getMilestones(p.id);
            const paid = milestones.filter((m) => (m.amount_paid ?? 0) > 0).length;
            return (
              <Card key={p.id} className="flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-ink">{p.title}</h3>
                  <StatusBadge tone={pilotStatusTone[p.status] ?? "neutral"} icon={pilotStatusIcon[p.status]}>
                    {pilotStatusLabels[p.status] ?? p.status}
                  </StatusBadge>
                </div>
                <p className="mt-1.5 text-sm text-ink-2">
                  {p.startup_name} · {p.department}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-ink-2">
                  <div>
                    <p className="text-ink-3">Budget</p>
                    <p className="mt-0.5 font-medium text-ink">{formatINR(p.budget)}</p>
                  </div>
                  <div>
                    <p className="text-ink-3">Location</p>
                    <p className="mt-0.5 font-medium text-ink">{p.location || "-"}</p>
                  </div>
                  <div>
                    <p className="text-ink-3">Duration</p>
                    <p className="mt-0.5 font-medium text-ink">{p.duration_months} months</p>
                  </div>
                  <div>
                    <p className="text-ink-3">Milestones</p>
                    <p className="mt-0.5 font-medium text-ink">
                      {paid}/{milestones.length} paid
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-3 dark:border-white/10">
                  <span className="text-xs text-ink-3">Starts {formatDate(p.start_date)}</span>
                  <ButtonLink href={`/gov/pilots/${p.id}`} variant="ghost" size="sm">
                    Manage
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
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