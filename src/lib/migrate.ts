import type { Db } from "mongodb";
import { migrations } from "./migrations";

export type Migration = {
  version: number;
  name: string;
  run(db: Db): Promise<void>;
};

/**
 * Versioned migrations, tracked in the `schema_migrations` collection.
 * Idempotent: already-applied versions are skipped, so this is safe to run
 * on every connect and on every deploy.
 */
export async function runMigrations(db: Db): Promise<number[]> {
  await db.collection("schema_migrations").createIndex({ version: 1 }, { unique: true });
  const applied = new Set<number>(
    (await db.collection("schema_migrations").find({}).toArray()).map((d) => d.version as number)
  );
  const done: number[] = [];
  for (const m of [...migrations].sort((a, b) => a.version - b.version)) {
    if (applied.has(m.version)) continue;
    await m.run(db);
    await db
      .collection("schema_migrations")
      .insertOne({ version: m.version, name: m.name, applied_at: new Date().toISOString() });
    done.push(m.version);
  }
  return done;
}
