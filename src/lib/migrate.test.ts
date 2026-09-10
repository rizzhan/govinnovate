import { MongoClient, type Db } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { runMigrations } from "./migrate";

let mongod: MongoMemoryServer;
let db: Db;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const client = new MongoClient(mongod.getUri());
  await client.connect();
  db = client.db("migrate-race-test");
}, 180000);

afterAll(async () => {
  await mongod.stop();
});

describe("migration runner", () => {
  it("survives many parallel runners (cold-start race)", async () => {
    const results = await Promise.all(Array.from({ length: 10 }, () => runMigrations(db)));
    // Every caller resolves; version 1 is recorded exactly once.
    expect(results.flat()).toContain(1);
    const records = await db.collection("schema_migrations").find({ version: 1 }).toArray();
    expect(records.length).toBe(1);
    expect(await db.collection("counters").countDocuments()).toBeGreaterThan(0);
  });

  it("is a no-op once applied", async () => {
    expect(await runMigrations(db)).toEqual([]);
  });
});
