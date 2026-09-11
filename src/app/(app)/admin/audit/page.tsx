import { ScrollText, TriangleAlert } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getAuditLog, getErrorEvents } from "@/lib/audit";
import { Card, EmptyState, StatusBadge } from "@/components/ui";
import { formatDate } from "@/lib/format";

function toneFor(action: string): "success" | "warning" | "danger" | "neutral" {
  if (/(^|\.)paid$/.test(action) || action.endsWith(".submitted") || action.endsWith(".created")) return "success";
  if (/deleted|password|failed/.test(action)) return "danger";
  if (/role_changed|status_changed|scale_decision/.test(action)) return "warning";
  return "neutral";
}

function timeOf(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function metaSummary(meta: Record<string, any> | undefined): string {
  if (!meta) return "";
  return Object.entries(meta)
    .filter(([, v]) => v !== "" && v !== null && v !== undefined)
    .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
    .join(" · ")
    .slice(0, 140);
}

export default async function AdminAudit() {
  await requireRole(["admin"]);
  const db = await getDb();
  const [entries, errors] = await Promise.all([getAuditLog(db, 100), getErrorEvents(db, 20)]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Audit Log</h1>
        <p className="mt-1 text-sm text-ink-2">
          Append-only record of governance and payment events — newest first, last 100 entries.
        </p>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="No audit events yet"
          body="Publishing, approvals, payments and admin actions will appear here."
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-ink-3 dark:border-white/10">
                  <th className="py-2 pr-4">Time</th>
                  <th className="py-2 pr-4">Actor</th>
                  <th className="py-2 pr-4">Event</th>
                  <th className="py-2 pr-4">Target</th>
                  <th className="py-2">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td className="whitespace-nowrap py-2.5 pr-4 text-xs text-ink-3">
                      {formatDate(e.created_at)} · {timeOf(e.created_at)}
                    </td>
                    <td className="py-2.5 pr-4">
                      <p className="font-medium text-ink">{e.actor_name}</p>
                      <p className="text-xs capitalize text-ink-3">{e.actor_role}</p>
                    </td>
                    <td className="py-2.5 pr-4">
                      <StatusBadge tone={toneFor(e.action)}>{e.action}</StatusBadge>
                    </td>
                    <td className="whitespace-nowrap py-2.5 pr-4 font-mono text-xs text-ink-2">
                      {e.entity}
                      {e.entity_id !== undefined ? ` #${e.entity_id}` : ""}
                    </td>
                    <td className="max-w-xs truncate py-2.5 text-xs text-ink-3" title={metaSummary(e.meta)}>
                      {metaSummary(e.meta) || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <div>
        <h2 className="text-lg font-semibold tracking-tight text-ink">Recent system errors</h2>
        <p className="mt-1 text-sm text-ink-2">
          Server-side failures from the last stretch, newest first. Match the digest with user reports.
        </p>
      </div>

      {errors.length === 0 ? (
        <Card>
          <p className="text-sm text-ink-2">No errors recorded. Quiet is good.</p>
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-black/5 dark:divide-white/10">
            {errors.map((e) => (
              <li key={e.id} className="flex items-start gap-3 py-2.5">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-critical" aria-hidden />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{e.message}</p>
                  <p className="mt-0.5 truncate font-mono text-[11px] text-ink-3">
                    {e.created_at} · {e.route || e.path}
                    {e.digest ? ` · ${e.digest}` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
