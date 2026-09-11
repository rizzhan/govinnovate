import { ExternalLink, Paperclip, Plus, Trash2 } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getAttachments, getStartupProfile } from "@/lib/data";
import { addAttachment, deleteAttachment, upsertStartupProfile } from "@/lib/actions/domain";
import { Card, Field, inputCls, SubmitButton } from "@/components/ui";

export default async function StartupProfilePage() {
  const user = await requireRole(["startup"]);
  const profile = await getStartupProfile(user.id);
  const attachments = await getAttachments(user.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Startup Profile</h1>
        <p className="mt-1 text-sm text-ink-2">
          Registered with DPIIT recognition. This profile powers discovery and eligibility screening on challenges.
        </p>
      </div>

      <Card title="Company / Founders Details">
        <form action={upsertStartupProfile} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company Legal Name">
              <input type="text" name="company_name" required className={inputCls} defaultValue={profile?.company_name ?? user.org} />
            </Field>
            <Field label="CIN (Company Identification No.)">
              <input type="text" name="cin" className={inputCls} defaultValue={profile?.cin ?? ""} />
            </Field>
            <Field label="DPIIT Recognition No.">
              <input type="text" name="dipit_number" className={inputCls} defaultValue={profile?.dipit_number ?? ""} />
            </Field>
            <Field label="Incorporation Year">
              <input type="number" name="incorporated_year" min={1900} max={2026} className={inputCls} defaultValue={profile?.incorporated_year ?? 2021} />
            </Field>
            <Field label="Sector">
              <input type="text" name="sector" className={inputCls} defaultValue={profile?.sector ?? ""} />
            </Field>
            <Field label="Funding Stage">
              <select name="stage" className={inputCls} defaultValue={profile?.stage ?? "Bootstrapped"}>
                {["Bootstrapped", "Pre-seed", "Seed", "Series A", "Series B+"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Funding Raised (₹)">
              <input type="number" name="funding_raised" min={0} className={inputCls} defaultValue={profile?.funding_raised ?? 0} />
            </Field>
            <Field label="Team Size">
              <input type="number" name="employee_count" min={1} className={inputCls} defaultValue={profile?.employee_count ?? 1} />
            </Field>
          </div>
          <Field label="Website">
            <input type="url" name="website" className={inputCls} defaultValue={profile?.website ?? ""} />
          </Field>
          <Field label="Active Locations / Offices">
            <input type="text" name="locations" className={inputCls} defaultValue={profile?.locations ?? ""} placeholder="e.g. Mumbai, Pune, Bengaluru" />
          </Field>
          <Field label="Short Pitch (what you solve, how, and proof)">
            <textarea name="pitch" rows={4} className={inputCls} defaultValue={profile?.pitch ?? ""} />
          </Field>
          {user.email && (
            <p className="text-xs text-ink-3">
              Sign-in identity: <span className="font-medium text-ink">{user.email}</span>
            </p>
          )}
          <div className="flex justify-end">
            <SubmitButton>Save Profile</SubmitButton>
          </div>
        </form>
      </Card>

      <Card title="Proof & Attachments">
        <p className="mb-4 text-sm text-ink-2">
          Link evidence that backs your claims — deployment reports, certifications, demo videos or
          press coverage. Evaluators and departments see these during screening.
        </p>
        {attachments.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-black/10 px-4 py-6 text-center text-sm text-ink-3 dark:border-white/10">
            No attachments yet. Add your first proof link below.
          </p>
        ) : (
          <ul className="divide-y divide-black/5 dark:divide-white/10">
            {attachments.map((a) => (
              <li key={a.id} className="flex items-center gap-3 py-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Paperclip className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{a.label}</p>
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-full items-center gap-1 truncate text-xs text-accent hover:text-accent-dark dark:hover:text-amber-300"
                  >
                    <span className="truncate">{String(a.url).replace(/^https?:\/\//, "")}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
                  </a>
                </div>
                <form action={deleteAttachment} className="shrink-0">
                  <input type="hidden" name="id" value={a.id} />
                  <button
                    type="submit"
                    aria-label={`Remove ${a.label}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-critical/10 hover:text-critical active:scale-95"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
        <form action={addAttachment} className="mt-4 grid gap-3 border-t border-black/5 pt-4 sm:grid-cols-[1fr_1.4fr_auto] sm:items-end dark:border-white/10">
          <Field label="Label">
            <input
              type="text"
              name="label"
              required
              maxLength={120}
              className={inputCls}
              placeholder="e.g. Pilot deployment report"
            />
          </Field>
          <Field label="Link (URL)">
            <input
              type="text"
              name="url"
              required
              maxLength={500}
              inputMode="url"
              className={inputCls}
              placeholder="https://…"
            />
          </Field>
          <SubmitButton variant="secondary">
            <Plus className="h-4 w-4" aria-hidden />
            Add
          </SubmitButton>
        </form>
      </Card>
    </div>
  );
}