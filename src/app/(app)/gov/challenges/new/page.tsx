import { requireRole } from "@/lib/auth";
import { createChallenge } from "@/lib/actions/domain";
import { Card, Field, inputCls, SubmitButton } from "@/components/ui";

export default async function NewChallengePage() {
  const user = await requireRole(["government"]);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Create an Outcome-Based Challenge</h1>
        <p className="mt-1.5 text-sm text-ink-2">
          Frame the problem as a measurable outcome — let startups propose the innovation.
        </p>
      </div>

      <form action={createChallenge} className="space-y-5">
        <Card title="Problem Definition">
          <div className="space-y-5">
            <Field label="Challenge Title" hint="e.g. Intelligent Water Quality Monitoring for Urban Lakes">
              <input type="text" name="title" required className={inputCls} placeholder="A clear, outcome-focused title" />
            </Field>

            <Field label="Problem Description">
              <textarea
                name="description"
                rows={4}
                required
                className={inputCls}
                placeholder="Describe the operational problem, who it affects and why it matters..."
              />
            </Field>

            <Field label="Desired Outcome (measurable & time-bound)">
              <textarea
                name="outcome_statement"
                rows={3}
                required
                className={inputCls}
                placeholder="e.g. Deploy a pilot covering 5 lakes with 95% sensor uptime and alerts within 15 minutes..."
              />
            </Field>
          </div>
        </Card>

        <Card title="Scope & Budget">
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Sector">
                <input type="text" name="sector" required className={inputCls} placeholder="e.g. Environment & Water" />
              </Field>
              <Field label="Department">
                <input type="text" name="department" className={inputCls} placeholder={user.department} defaultValue={user.department} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Minimum Budget (₹)">
                <input type="number" name="budget_min" min={0} className={inputCls} placeholder="2500000" />
              </Field>
              <Field label="Maximum Budget (₹)">
                <input type="number" name="budget_max" min={0} className={inputCls} placeholder="7500000" />
              </Field>
            </div>

            <Field label="Timeline / Pilot Duration">
              <input type="text" name="timeline" className={inputCls} placeholder="e.g. 6-month pilot with 4 milestone payments" />
            </Field>

            <div className="flex items-center justify-end gap-3 border-t border-black/5 pt-4 dark:border-white/10">
              <a href="/gov" className="rounded-full px-4 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10">
                Cancel
              </a>
              <SubmitButton>Save Challenge (Draft)</SubmitButton>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}