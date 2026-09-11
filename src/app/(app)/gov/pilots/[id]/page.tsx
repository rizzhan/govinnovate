import { Check, Medal, ShieldCheck } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getPilot, getChallenge, getMilestones, getScaleUpDecision, isChallengeVisible } from "@/lib/data";
import { notFound } from "next/navigation";
import { ButtonLink, Card, Field, inputCls, StatusBadge, SubmitButton } from "@/components/ui";
import { formatDate, formatINR, milestoneStatusLabels, milestoneStatusTone, pilotStatusLabels, pilotStatusTone, scaleDecisionLabels } from "@/lib/format";
import { milestoneStatusIcon, pilotStatusIcon } from "@/components/status";
import { addMilestone, submitScaleDecision, updateMilestone, updatePilotStatus } from "@/lib/actions/domain";

export default async function PilotDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(["government"]);
  const { id } = await params;
  const pilot = await getPilot(Number(id));
  if (!pilot) notFound();
  const host = await getChallenge(pilot.challenge_id);
  if (!host || !isChallengeVisible(user, host)) notFound();

  const milestones = await getMilestones(pilot.id);
  const scaleDecision = await getScaleUpDecision(pilot.id);
  const paidTotal = milestones.reduce((s, m) => s + (m.status === "paid" ? Number(m.amount) : 0), 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-ink-3">Pilot #{pilot.id} · {pilot.challenge_title}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">{pilot.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <StatusBadge tone={pilotStatusTone[pilot.status] ?? "violet"} icon={pilotStatusIcon[pilot.status]}>
              {pilotStatusLabels[pilot.status] ?? pilot.status}
            </StatusBadge>
            <span className="text-sm text-ink-2">{pilot.startup_name}</span>
            <span className="text-sm text-ink-2">· {formatINR(pilot.budget)}</span>
            <span className="text-sm text-ink-2">
              · {formatDate(pilot.start_date)} → {formatDate(pilot.end_date)}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {pilot.status === "design" && (
            <form action={updatePilotStatus}>
              <input type="hidden" name="id" value={pilot.id} />
              <input type="hidden" name="status" value="active" />
              <SubmitButton>Activate Pilot</SubmitButton>
            </form>
          )}
          {pilot.status === "scaling" && (
            <ButtonLink href="/templates">Procurement Pathway Guide</ButtonLink>
          )}
        </div>
      </div>

      {pilot.scope && (
        <Card title="Implementation Scope">
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-2">{pilot.scope}</p>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Contract Fabric">
          <div className="space-y-3">
            {[
              ["IP Clause", pilot.ip_clause],
              ["Data Clause", pilot.data_clause],
              ["Cybersecurity Clause", pilot.cybersecurity_clause],
              ["Risk Clause", pilot.risk_clause],
            ].map(([label, value]) => (
              <div key={label as string}>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">{label}</p>
                <p className="mt-0.5 text-sm text-ink-2">{value}</p>
              </div>
            ))}
            {pilot.client_name && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">Client / Representative</p>
                <p className="mt-0.5 text-sm text-ink-2">{pilot.client_name}</p>
              </div>
            )}
          </div>
        </Card>

        <Card title="Payment Position">
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-chip rounded-2xl py-3 text-center">
              <p className="text-xs text-ink-3">Contracted</p>
              <p className="text-lg font-bold text-ink">{formatINR(pilot.budget)}</p>
            </div>
            <div className="rounded-2xl bg-verified/15 py-3 text-center">
              <p className="text-xs text-ink-2">Paid</p>
              <p className="text-lg font-bold text-[#1f8a3d]">{formatINR(paidTotal)}</p>
            </div>
            <div className="rounded-2xl bg-pending/15 py-3 text-center">
              <p className="text-xs text-ink-2">Outstanding</p>
              <p className="text-lg font-bold text-[#9a4a00]">{formatINR(Number(pilot.budget) - paidTotal)}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-ink-3">
            Payments are released only after independent verification of milestone exit criteria.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-black/5 pt-4 text-xs text-ink-2 dark:border-white/10">
            <p>Location: <span className="font-medium text-ink">{pilot.location || "-"}</span></p>
            <p>Duration: <span className="font-medium text-ink">{pilot.duration_months} months</span></p>
            {pilot.contract_manager && (
              <p>Contract Manager: <span className="font-medium text-ink">{pilot.contract_manager}</span></p>
            )}
          </div>
        </Card>
      </div>

      <Card
        title={`Milestones (${milestones.length})`}
        action={
          <span className="text-xs text-ink-3">
            {milestones.filter((m) => m.status === "paid").length} paid ·{" "}
            {milestones.filter((m) => m.status === "verified").length} verified
          </span>
        }
      >
        {milestones.length === 0 ? (
          <p className="text-sm text-ink-2">No milestones defined. Add milestone-based payment tranches below.</p>
        ) : (
          <div className="space-y-3">
            {milestones.map((m) => (
              <div key={m.id} className="glass-chip rounded-2xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-ink">{m.title}</p>
                    <p className="text-xs text-ink-3">
                      Due {formatDate(m.due_date)} · Value: {formatINR(m.amount)}
                    </p>
                  </div>
                  <StatusBadge tone={milestoneStatusTone[m.status] ?? "neutral"} icon={milestoneStatusIcon[m.status]}>
                    {milestoneStatusLabels[m.status] ?? m.status}
                  </StatusBadge>
                </div>
                {m.description && <p className="mt-2 text-sm text-ink-2">{m.description}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {m.status === "pending" && (
                    <form action={updateMilestone} className="inline">
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="action" value="verify" />
                      <button className="inline-flex items-center gap-1.5 rounded-2xl border border-pending/40 bg-transparent px-3 py-1.5 text-xs font-medium text-[#9a4a00] transition-colors hover:bg-pending/10">
                        <Check className="h-3.5 w-3.5" aria-hidden />
                        Mark Verified
                      </button>
                    </form>
                  )}
                  {m.status === "verified" && (
                    <form action={updateMilestone} className="inline-flex flex-wrap items-center gap-2">
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="action" value="pay" />
                      <input
                        type="text"
                        name="payment_ref"
                        placeholder="PFMS reference"
                        className={inputCls + " w-40 py-1.5 text-xs"}
                      />
                      <SubmitButton size="sm">Release Payment ({formatINR(m.amount)})</SubmitButton>
                    </form>
                  )}
                  {m.status === "paid" && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-ink-3">
                      <ShieldCheck className="h-3.5 w-3.5 text-verified" aria-hidden />
                      Released {formatDate(m.paid_at)}
                      {m.payment_ref ? ` · ${m.payment_ref}` : ""}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Add Milestone">
        <form action={addMilestone} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="pilot_id" value={pilot.id} />
          <div className="sm:col-span-2">
            <Field label="Milestone Title">
              <input type="text" name="title" required className={inputCls} placeholder="e.g. M4 - Final validation & scale recommendation" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Exit Criteria / Description">
              <textarea name="description" rows={2} className={inputCls} placeholder="Verifiable acceptance criteria for this tranche..." />
            </Field>
          </div>
          <Field label="Due Date">
            <input type="date" name="due_date" className={inputCls} />
          </Field>
          <Field label="Milestone Amount (₹)">
            <input type="number" name="amount" min={0} required className={inputCls} />
          </Field>
          <div className="sm:col-span-2 flex justify-end">
            <SubmitButton variant="secondary">Add Milestone</SubmitButton>
          </div>
        </form>
      </Card>

      <Card title="Independent Validation & Scale-Up Decision">
        {scaleDecision ? (
          <div className="rounded-2xl border border-verified/25 bg-verified/10 p-5">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-[#1f8a3d]">
              <Medal className="h-4 w-4" aria-hidden />
              Decision: {scaleDecisionLabels[scaleDecision.decision] ?? scaleDecision.decision}
            </p>
            <p className="mt-1.5 text-sm text-ink-2">{scaleDecision.validation_notes}</p>
            <p className="mt-2 text-xs text-ink-3">
              Pathway: {scaleDecision.procurement_pathway} · Districts: {scaleDecision.districts}
            </p>
          </div>
        ) : (
          <form action={submitScaleDecision} className="space-y-4">
            <input type="hidden" name="pilot_id" value={pilot.id} />
            <Field label="Decision">
              <select name="decision" className={inputCls} defaultValue="scale">
                <option value="scale">Scale Up (recommend procurement across districts)</option>
                <option value="trial">Extend Pilot (one more phase)</option>
                <option value="not_scale">Do Not Scale (end after pilot)</option>
              </select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Target Districts for Scale">
                <input type="text" name="districts" className={inputCls} placeholder="e.g. Pune, Nashik, Aurangabad" />
              </Field>
              <Field label="Procurement Pathway">
                <input
                  type="text"
                  name="procurement_pathway"
                  className={inputCls}
                  placeholder="e.g. GeM rate contract under Innovation Procurement"
                />
              </Field>
            </div>
            <Field label="Independent Validation Notes">
              <textarea
                name="validation_notes"
                rows={3}
                className={inputCls}
                placeholder="Summarise validated KPIs, third-party findings and recommendation evidence..."
              />
            </Field>
            <div className="flex justify-end">
              <SubmitButton>Record Scale-Up Decision</SubmitButton>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}