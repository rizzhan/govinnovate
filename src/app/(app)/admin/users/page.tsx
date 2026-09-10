import { CheckCircle2, XCircle } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getAllUsers } from "@/lib/data";
import { Card, Field, inputCls, SubmitButton } from "@/components/ui";
import { roleLabels } from "@/lib/format";
import { createUser, resetUserPassword, updateUserRole, deleteUser } from "@/lib/actions/domain";

const notices: Record<string, { ok: boolean; text: string }> = {
  "saved=password-reset": { ok: true, text: "Temporary password set. Share it with the user through a separate channel." },
  "error=password-short": { ok: false, text: "Temporary password must be at least 8 characters." },
  "error=user-missing": { ok: false, text: "That user no longer exists." },
};

export default async function AdminUsers({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  await requireRole(["admin"]);
  const users = await getAllUsers();
  const sp = await searchParams;
  const flash = sp.saved ? notices[`saved=${sp.saved}`] : sp.error ? notices[`error=${sp.error}`] : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Users & Roles</h1>
        <p className="mt-1 text-sm text-ink-2">
          Manage registry of departments, startups, evaluators and platform admins.
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

      <Card title="Add User">
        <form action={createUser} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Full Name">
            <input type="text" name="name" required className={inputCls} placeholder="Name" />
          </Field>
          <Field label="Email">
            <input type="email" name="email" required className={inputCls} placeholder="person@example.org" />
          </Field>
          <Field label="Role">
            <select name="role" className={inputCls} defaultValue="startup">
              {Object.entries(roleLabels).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </Field>
          <Field label="Organisation">
            <input type="text" name="org" className={inputCls} placeholder="Org" />
          </Field>
          <Field label="Department">
            <input type="text" name="department" className={inputCls} placeholder="Department" />
          </Field>
          <Field label="Temporary Password">
            <input type="text" name="password" className={inputCls} defaultValue="demo1234" />
          </Field>
          <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
            <SubmitButton>Add User</SubmitButton>
          </div>
        </form>
      </Card>

      <Card title={`Registered Users (${users.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-ink-3 dark:border-white/10">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Organisation</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-2.5 pr-4 font-medium text-ink">{u.name}</td>
                  <td className="py-2.5 pr-4 text-ink-2">{u.email}</td>
                  <td className="py-2.5 pr-4">
                    <form action={updateUserRole} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={u.id} />
                      <select name="role" defaultValue={u.role} className="rounded-full border border-black/10 bg-transparent px-2 py-1 text-xs dark:border-white/15">
                        {Object.entries(roleLabels).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                      <SubmitButton variant="secondary" size="sm">Save</SubmitButton>
                    </form>
                  </td>
                  <td className="py-2.5 pr-4 text-ink-2">{u.org || "-"}</td>
                  <td className="py-2.5">
                    <form action={deleteUser} className="inline">
                      <input type="hidden" name="id" value={u.id} />
                      <SubmitButton variant="ghost" size="sm" className="text-[#c22f2f]">Delete</SubmitButton>
                    </form>
                    <form action={resetUserPassword} className="mt-1.5 flex items-center gap-1.5">
                      <input type="hidden" name="id" value={u.id} />
                      <input
                        type="text"
                        name="temp_password"
                        required
                        minLength={8}
                        autoComplete="off"
                        placeholder="Temp password"
                        aria-label={`Temporary password for ${u.email}`}
                        className="w-32 rounded-full border border-black/10 bg-transparent px-2 py-1 text-xs dark:border-white/15"
                      />
                      <SubmitButton variant="ghost" size="sm">Reset</SubmitButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}