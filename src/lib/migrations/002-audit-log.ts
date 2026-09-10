import type { Migration } from "../migrate";

/** Audit log collection + retention-friendly indexes. */
export const migration002: Migration = {
  version: 2,
  name: "audit-log",
  async run(db) {
    await db.collection("audit_log").createIndex({ created_at: -1 });
    await db.collection("audit_log").createIndex({ entity: 1, entity_id: 1 });
    await db.collection("audit_log").createIndex({ actor_user_id: 1 });
  },
};
