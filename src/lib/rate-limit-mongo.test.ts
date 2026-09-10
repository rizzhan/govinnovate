import { MongoClient, type Db } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setTestDb } from "./db";
import { checkRateLimitMongo } from "./rate-limit-mongo";

let mongod: MongoMemoryServer;
let db: Db;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const client = new MongoClient(mongod.getUri());
  await client.connect();
  db = client.db("ratelimit-test");
  setTestDb(db);
}, 180000);

afterAll(async () => {
  await mongod.stop();
});

describe("shared (mongo) rate limiter", () => {
  it("allows under the limit then blocks with retry delay", async () => {
    for (let i = 0; i < 3; i++) {
      expect((await checkRateLimitMongo("k1", 3, 60000, 1000)).ok).toBe(true);
    }
    const blocked = await checkRateLimitMongo("k1", 3, 60000, 1001);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it("slides the window forward", async () => {
    expect((await checkRateLimitMongo("k2", 1, 1000, 0)).ok).toBe(true);
    expect((await checkRateLimitMongo("k2", 1, 1000, 500)).ok).toBe(false);
    expect((await checkRateLimitMongo("k2", 1, 1000, 1001)).ok).toBe(true);
  });

  it("isolates keys", async () => {
    expect((await checkRateLimitMongo("a", 1, 60000, 0)).ok).toBe(true);
    expect((await checkRateLimitMongo("b", 1, 60000, 0)).ok).toBe(true);
    expect((await checkRateLimitMongo("a", 1, 60000, 0)).ok).toBe(false);
  });
});
