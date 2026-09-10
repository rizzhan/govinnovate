import { MongoClient, type Db } from "mongodb";
import { getMongoDbName, getMongoUri } from "./env";
import { runMigrations } from "./migrate";

export type Role = "admin" | "government" | "startup" | "evaluator";

type GlobalMongo = {
  __mongoClient?: MongoClient;
  __mongoDb?: Db;
  __migrated?: boolean;
};

const globalForMongo = globalThis as unknown as GlobalMongo;

async function connect(uri: string): Promise<Db> {
  const client = new MongoClient(uri);
  await client.connect();
  globalForMongo.__mongoClient = client;
  return client.db(getMongoDbName());
}

/**
 * Returns the shared database handle, running pending migrations on first
 * connect. Pass an explicit URI in tests to target an isolated database.
 */
export async function getDb(uri?: string): Promise<Db> {
  if (!uri && globalForMongo.__mongoDb) return globalForMongo.__mongoDb;
  const db = await connect(uri ?? getMongoUri());
  if (!uri) globalForMongo.__mongoDb = db;
  await ensureMigrated(db);
  return db;
}

/** Test hook: drops the cached handle so the next getDb() reconnects. */
export function resetDbCache() {
  globalForMongo.__mongoDb = undefined;
  globalForMongo.__mongoClient = undefined;
  globalForMongo.__migrated = undefined;
}

/** Test hook: points the data layer at an isolated database. */
export function setTestDb(db: Db) {
  globalForMongo.__mongoDb = db;
  globalForMongo.__migrated = true;
}

let migrating: Promise<void> | null = null;

async function ensureMigrated(db: Db): Promise<void> {
  if (globalForMongo.__migrated) return;
  // Single-flight: concurrent first-connects share one migration run.
  if (!migrating) {
    migrating = runMigrations(db).then(
      () => {
        globalForMongo.__migrated = true;
        migrating = null;
      },
      (e) => {
        migrating = null;
        throw e;
      }
    );
  }
  await migrating;
}

/** Document shape: free-form fields plus the numeric _id this app uses. */
export type Doc = Record<string, any> & { _id: number };

/** Typed collection handle: numeric _id, known fields where provided. */
export async function col<T extends Record<string, any> = Doc>(name: string) {
  const db = await getDb();
  return db.collection<T & { _id: number }>(name);
}

/**
 * Numeric auto-increment ids (preserved from the SQL schema so every route,
 * from /gov/challenges/1 to /templates/3, keeps working unchanged).
 */
export async function getNextId(collection: string): Promise<number> {
  const db = await getDb();
  const res = await db
    .collection<{ _id: string; seq: number }>("counters")
    .findOneAndUpdate({ _id: collection }, { $inc: { seq: 1 } }, { upsert: true, returnDocument: "after" });
  return (res as unknown as { seq: number }).seq;
}

/** Current ISO-8601 timestamp for created/updated fields. */
export function nowIso(): string {
  return new Date().toISOString();
}
