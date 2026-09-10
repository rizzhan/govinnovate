import type { Db } from "mongodb";
import { nowIso, type Doc } from "./db";

export type AuditAction =
  | "challenge.published"
  | "challenge.deleted"
  | "challenge.created"
  | "application.status_changed"
  | "evaluation.submitted"
  | "pilot.created"
  | "pilot.status_changed"
  | "milestone.added"
  | "milestone.verified"
  | "milestone.paid"
  | "scale_decision.recorded"
  | "template.added"
  | "template.deleted"
  | "user.created"
  | "user.role_changed"
  | "user.deleted"
  | "user.password_reset"
  | "account.updated"
  | "account.password_changed"
  | "attachment.added"
  | "attachment.deleted";

export type AuditEntry = {
  actor_user_id: number;
  actor_name: string;
  actor_role: string;
  action: AuditAction;
  entity: string;
  entity_id?: number | string;
  meta?: Record<string, any>;
};

/**
 * Append-only audit record. Failures to write audit must never break the
 * underlying operation, so callers should not await this on the hot path —
 * fire and forget, errors are swallowed after a console report.
 */
export function logAudit(db: Db, entry: AuditEntry): void {
  db.collection("audit_log")
    .insertOne({ ...entry, created_at: nowIso() })
    .catch((e) => console.error("[audit] write failed:", e?.message ?? e));
}

/** Synchronous variant for tests and scripts. */
export async function logAuditSync(db: Db, entry: AuditEntry) {
  await db.collection("audit_log").insertOne({ ...entry, created_at: nowIso() });
}

export async function getAuditLog(db: Db, limit = 100) {
  const docs = await db.collection<Doc>("audit_log").find({}).sort({ _id: -1 }).limit(limit).toArray();
  return docs.map((d) => {
    const { _id, ...rest } = d;
    return { id: _id, ...rest };
  }) as (AuditEntry & { id: number; created_at: string })[];
}
