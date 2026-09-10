import { MongoClient, type Db } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getAuditLog, logAuditSync } from "./audit";
import { setTestDb } from "./db";

let mongod: MongoMemoryServer;
let db: Db;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const client = new MongoClient(mongod.getUri());
  await client.connect();
  db = client.db("audit-test");
  setTestDb(db);
}, 180000);

afterAll(async () => {
  await mongod.stop();
});

describe("audit log", () => {
  it("appends entries newest-first", async () => {
    await logAuditSync(db, {
      actor_user_id: 2, actor_name: "Officer", actor_role: "government",
      action: "milestone.paid", entity: "milestone", entity_id: 7, meta: { amount: 1500000, payment_ref: "PFMS-1" },
    });
    await logAuditSync(db, {
      actor_user_id: 2, actor_name: "Officer", actor_role: "government",
      action: "challenge.published", entity: "challenge", entity_id: 3, meta: {},
    });
    const entries = await getAuditLog(db, 10);
    expect(entries.length).toBe(2);
    expect(entries[0].action).toBe("challenge.published");
    expect(entries[1].action).toBe("milestone.paid");
    expect(entries[1].entity_id).toBe(7);
    expect(entries[0].created_at).toBeTruthy();
  });
});
