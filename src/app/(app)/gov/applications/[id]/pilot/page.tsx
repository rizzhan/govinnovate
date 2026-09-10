import { requireRole } from "@/lib/auth";
import { getApplication, getPilots } from "@/lib/data";
import { notFound } from "next/navigation";
import { ButtonLink, Card, Field, inputCls, SubmitButton } from "@/components/ui";
import { formatINR } from "@/lib/format";
import { createPilot } from "@/lib/actions/domain";

export default async function PilotFormPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["government"]);
  const { id: appId } = await params;
  const app = await getApplication(Number(appId));
  if (!app || app.status !== "shortlisted") notFound();

  const existing = (await getPilots()).find((p) => p.application_id === app.id);
  const suggestedBudget = Math.round((app.ask_amount || 2500000) * 0.4);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Structure Pilot & Contract</h1>
        <p className="mt-1.5 text-sm text-ink-2">
          {app.startup_name} · {app.challenge_title}
        </p>
      </div>

      {existing ? (
        <Card>
          <p className="text-sm text-ink-2">
            A pilot for this application already exists. You can manage it from the pilot page.
          </p>
          <div className="mt-4">
            <ButtonLink href={`/gov/pilots/${existing.id}`} variant="secondary">
              Open Existing Pilot
            </ButtonLink>
          </div>
        </Card>
      ) : (
        <form action={createPilot} className="space-y-5">
          <input type="hidden" name="id" value={app.id} />
          <Card title="Contract Details">
            <div className="space-y-5">
              <Field label="Pilot Title">
                <input type="text" name="title" required className={inputCls} placeholder={`Pilot: ${app.startup_name} in ${app.challenge_title}`} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Start Date">
                  <input type="date" name="start_date" required className={inputCls} />
                </Field>
                <Field label="Duration (months)">
                  <input type="number" name="duration_months" min={1} required className={inputCls} placeholder="6" />
                </Field>
              </div>
              <Field label="Pilot Budget (₹)" hint={`Suggested initial allocation: ${formatINR(suggestedBudget)} based on the funding ask`}>
                <input type="number" name="budget" min={0} required className={inputCls} defaultValue={suggestedBudget} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Location">
                  <input type="text" name="location" className={inputCls} placeholder="Scope of operations" />
                </Field>
                <Field label="Department Representative">
                  <input type="text" name="client_name" className={inputCls} placeholder="Contract owner" />
                </Field>
              </div>
            </div>
          </Card>

          <Card title="Implementation Scope">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-ink">Scope of Work</p>
                <textarea
                  name="scope"
                  rows={11}
                  required
                  className={inputCls}
                  defaultValue={app.solution_summary}
                  placeholder="What will the startup deploy, integrate and operate during the pilot?"
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-ink">Proposed Milestones</p>
                <p className="mb-3 text-xs text-ink-3">
                  JSON list with a title, amount (₹) and timeline for each payment milestone.
                </p>
                <textarea
                  name="milestones"
                  rows={7}
                  required
                  className={inputCls}
                  defaultValue={JSON.stringify(
                    [
                      { title: "Mobilization & deployment", amount: Math.round(suggestedBudget * 0.25), timeline: "Month 1" },
                      { title: "Live pilot demonstration", amount: Math.round(suggestedBudget * 0.35), timeline: "Month 3" },
                      { title: "Outcome reporting & handover", amount: Math.round(suggestedBudget * 0.4), timeline: "Month 6" },
                    ],
                    null,
                    2
                  )}
                />
              </div>
            </div>
          </Card>

          <Card title="Contract Manager">
            <Field label="Contract Manager (from your department)">
              <input type="text" name="contract_manager" className={inputCls} placeholder="Person accountable for delivery" />
            </Field>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <a href={`/gov/applications/${app.id}`} className="rounded-full px-4 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10">
              Cancel
            </a>
            <SubmitButton>Create Pilot & Contract</SubmitButton>
          </div>
        </form>
      )}
    </div>
  );
}