import { getDb } from "./db";
import { checkRateLimit as checkMemory } from "./rate-limit";

/**
 * Shared rate limiter backed by MongoDB, so limits hold across instances.
 * Expired buckets are pruned lazily on each check.
 */
export async function checkRateLimitMongo(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now()
): Promise<{ ok: boolean; retryAfterMs: number }> {
  const db = await getDb();
  const coll = db.collection<{ _id: string; hits: number[] }>("rate_limits");
  const cutoff = now - windowMs;
  await coll.updateOne({ _id: key }, { $pull: { hits: { $lt: cutoff } } }, { upsert: true });
  const doc = await coll.findOne({ _id: key });
  const hits = (doc?.hits ?? []).filter((t: number) => t >= cutoff);
  if (hits.length < limit) {
    await coll.updateOne({ _id: key }, { $push: { hits: now } });
    return { ok: true, retryAfterMs: 0 };
  }
  const oldest = Math.min(...hits);
  return { ok: false, retryAfterMs: Math.max(0, oldest + windowMs - now) };
}

/**
 * Login gate: uses the shared Mongo limiter when RATE_LIMIT_STORE=mongo,
 * otherwise the in-process limiter. Same interface either way.
 */
export async function checkLoginLimit(key: string, limit: number, windowMs: number) {
  if (process.env.RATE_LIMIT_STORE === "mongo") {
    return checkRateLimitMongo(key, limit, windowMs);
  }
  return checkMemory(key, limit, windowMs);
}
