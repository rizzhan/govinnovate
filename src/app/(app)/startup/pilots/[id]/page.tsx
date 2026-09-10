import { BadgeCheck, Medal } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getPilot, getMilestones, getScaleUpDecision } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, StatusBadge } from "@/components/ui";
import { formatDate, formatINR, milestoneStatusLabels, milestoneStatusTone, pilotStatusLabels, pilotStatusTone, scaleDecisionLabels } from "@/lib/format";
import { milestoneStatusIcon, pilotStatusIcon } from "@/components/status";

export default async function StartupPilotDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(["startup"]);
  const { id } = await params;
  const pilot = getPilot(Number(id));
  if (!pilot) notFound();
  if (pilot.startup_user_id !== user.id) notFound();

  const milestones = getMilestones(pilot.id);
  const scaleDecision = getScaleUpDecision(pilot.id);
  const received = milestones.reduce((s, m) => s + (m.status === "paid" ? Number(m.amount) : 0), 0);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm text-ink-3">Pilot #{pilot.id} · {pilot.challenge_title}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">{pilot.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2.5">
          <StatusBadge tone={pilotStatusTone[pilot.status] ?? "violet"} icon={pilotStatusIcon[pilot.status]}>
            {pilotStatusLabels[pilot.status] ?? pilot.status}
          </StatusBadge>
          <span className="text-sm text-ink-2">
            {formatDate(pilot.start_date)} → {formatDate(pilot.end_date)}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass w-full rounded-3xl p-5">
          <p className="text-sm text-ink-3">Contracted</p>
          <p className="text-xl font-bold text-ink">{formatINR(pilot.budget)}</p>
        </div>
        <div className="glass rounded-3xl border border-verified/20 bg-verified/10 p-5">
          <p className="text-sm text-ink-2">Received</p>
          <p className="text-xl font-bold text-[#1f8a3d]">{formatINR(received)}</p>
        </div>
        <div className="glass rounded-3xl border border-pending/20 bg-pending/10 p-5">
          <p className="text-sm text-ink-2">Collectable</p>
          <p className="text-xl font-bold text-[#9a4a00]">{formatINR(Number(pilot.budget) - received)}</p>
        </div>
      </div>

      <Card title="Milestone Payment Schedule">
        {milestones.length === 0 ? (
          <p className="text-sm text-ink-2">Milestones will appear once the department structures the contract.</p>
        ) : (
          <div className="space-y-3">
            {milestones.map((m) => (
              <div key={m.id} className="glass-chip rounded-2xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-ink">{m.title}</p>
                    <p className="text-xs text-ink-3">Due {formatDate(m.due_date)} · {formatINR(m.amount)}</p>
                  </div>
                  <StatusBadge tone={milestoneStatusTone[m.status] ?? "neutral"} icon={milestoneStatusIcon[m.status]}>
                    {milestoneStatusLabels[m.status] ?? m.status}
                  </StatusBadge>
                </div>
                {m.status === "paid" && (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#1f8a3d]">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                    Paid {formatDate(m.paid_at)}
                    {m.payment_ref ? ` · Ref ${m.payment_ref}` : ""}
                  </p>
                )}
                {m.status === "verified" && (
                  <p className="mt-2 text-xs text-[#9a4a00]">Verified — payment release pending approval processing (SLA 15 days).</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Contract Terms (transparency)">
        <div className="space-y-3">
          {[
            ["IP Ownership", pilot.ip_clause],
            ["Data Handling", pilot.data_clause],
            ["Cybersecurity", pilot.cybersecurity_clause],
            ["Risk & Early Exit", pilot.risk_clause],
          ].map(([label, value]) => (
            <div key={label as string}>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{label}</p>
              <p className="text-sm text-ink-2">{value}</p>
            </div>
          ))}
        </div>
      </Card>

      {scaleDecision && (
        <Card title="Scale-Up Decision">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-[#1f8a3d]">
            <Medal className="h-4 w-4" aria-hidden />
            {scaleDecisionLabels[scaleDecision.decision] ?? scaleDecision.decision}
          </p>
          <p className="mt-1.5 text-sm text-ink-2">{scaleDecision.validation_notes}</p>
        </Card>
      )}
    </div>
  );
}