import type { Migration } from "../migrate";

/** Capped collection for recent server errors (self-trimming, max 500 docs). */
export const migration003: Migration = {
  version: 3,
  name: "error-events-capped",
  async run(db) {
    const existing = await db.listCollections({ name: "error_events" }).toArray();
    if (existing.length === 0) {
      await db.createCollection("error_events", { capped: true, size: 1048576, max: 500 });
    }
    await db.collection("error_events").createIndex({ created_at: -1 });
  },
};
