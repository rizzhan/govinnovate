import { requireRole } from "@/lib/auth";
import { getStartupProfile } from "@/lib/data";
import { upsertStartupProfile } from "@/lib/actions/domain";
import { Card, Field, inputCls, SubmitButton } from "@/components/ui";

export default async function StartupProfilePage() {
  const user = await requireRole(["startup"]);
  const profile = getStartupProfile(user.id);

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
    </div>
  );
}