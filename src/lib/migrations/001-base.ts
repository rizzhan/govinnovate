import type { Db } from "mongodb";
import type { Migration } from "../migrate";
import type { Doc } from "../db";

/**
 * Base indexes + id counters. Counters keep the numeric ids the whole app
 * (routes, forms, seed data) already uses, now backed by atomic $inc.
 */
export const migration001: Migration = {
  version: 1,
  name: "base-indexes-and-counters",
  async run(db: Db) {
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("challenges").createIndex({ status: 1 });
    await db.collection("challenges").createIndex({ created_by: 1 });
    await db.collection("applications").createIndex({ challenge_id: 1 });
    await db.collection("applications").createIndex({ startup_user_id: 1 });
    await db.collection("applications").createIndex({ status: 1 });
    await db.collection("evaluations").createIndex({ application_id: 1 });
    await db.collection("pilots").createIndex({ challenge_id: 1 });
    await db.collection("pilots").createIndex({ startup_user_id: 1 });
    await db.collection("milestones").createIndex({ pilot_id: 1 });
    await db.collection("templates").createIndex({ category: 1 });
    await db.collection("startup_attachments").createIndex({ startup_user_id: 1 });

    const collections = [
      "users",
      "startup_profiles",
      "challenges",
      "applications",
      "evaluations",
      "pilots",
      "milestones",
      "scale_up_decisions",
      "templates",
      "startup_attachments",
    ];
    for (const name of collections) {
      const top = await db.collection<Doc>(name).find({}).sort({ _id: -1 }).limit(1).toArray();
      const seq = top[0]?._id ?? 0;
      await db
        .collection<{ _id: string; seq: number }>("counters")
        .updateOne({ _id: name }, { $setOnInsert: { seq } }, { upsert: true });
    }
  },
};
