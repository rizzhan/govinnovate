import { CheckCircle2, XCircle } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { changePassword, updateAccount } from "@/lib/actions/domain";
import { roleLabels } from "@/lib/format";
import { Card, Field, inputCls, SubmitButton } from "@/components/ui";

const messages: Record<string, { ok: boolean; text: string }> = {
  "saved=profile": { ok: true, text: "Account details updated." },
  "saved=password": { ok: true, text: "Password changed successfully." },
  "error=missing": { ok: false, text: "Name and email are required." },
  "error=email-taken": { ok: false, text: "That email is already registered to another account." },
  "error=current-password": { ok: false, text: "Current password is incorrect." },
  "error=password-mismatch": { ok: false, text: "New passwords do not match." },
  "error=password-short": { ok: false, text: "New password must be at least 8 characters." },
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const flash = sp.saved ? messages[`saved=${sp.saved}`] : sp.error ? messages[`error=${sp.error}`] : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Account Settings</h1>
        <p className="mt-1 text-sm text-ink-2">
          {roleLabels[user.role]} account{user.org ? ` · ${user.org}` : ""} — manage your sign-in
          identity and password.
        </p>
      </div>

      {flash && (
        <div
          role={flash.ok ? "status" : "alert"}
          className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${
            flash.ok
              ? "border-verified/25 bg-verified/10 text-[#1f8a3d] dark:border-verified/25 dark:bg-verified/15 dark:text-[#32d74b]"
              : "border-critical/25 bg-critical/10 text-[#c22f2f] dark:border-critical/30 dark:bg-critical/15 dark:text-[#ff6961]"
          }`}
        >
          {flash.ok ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          ) : (
            <XCircle className="h-4 w-4 shrink-0" aria-hidden />
          )}
          {flash.text}
        </div>
      )}

      <Card title="Profile">
        <form action={updateAccount} className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name">
            <input type="text" name="name" required maxLength={120} className={inputCls} defaultValue={user.name} />
          </Field>
          <Field label="Email (sign-in identity)">
            <input type="email" name="email" required maxLength={160} className={inputCls} defaultValue={user.email} />
          </Field>
          <div className="flex justify-end sm:col-span-2">
            <SubmitButton>Save Changes</SubmitButton>
          </div>
        </form>
      </Card>

      <Card title="Change Password">
        <form action={changePassword} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Current Password">
              <input type="password" name="current_password" required autoComplete="current-password" className={inputCls} />
            </Field>
          </div>
          <Field label="New Password (min 8 characters)">
            <input type="password" name="new_password" required minLength={8} autoComplete="new-password" className={inputCls} />
          </Field>
          <Field label="Confirm New Password">
            <input type="password" name="confirm_password" required minLength={8} autoComplete="new-password" className={inputCls} />
          </Field>
          <div className="flex justify-end sm:col-span-2">
            <SubmitButton variant="secondary">Update Password</SubmitButton>
          </div>
        </form>
      </Card>
    </div>
  );
}