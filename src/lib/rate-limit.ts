/**
 * In-memory sliding-window rate limiter. Single-instance scope: sufficient
 * for one-server deployments; put the app behind sticky sessions or move
 * to a shared store if you ever scale horizontally.
 */

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

const MAX_KEYS = 10000;

function prune(now: number) {
  if (store.size <= MAX_KEYS) return;
  for (const [k, e] of store) {
    if (now >= e.resetAt) store.delete(k);
  }
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now()
): { ok: boolean; retryAfterMs: number } {
  prune(now);
  const entry = store.get(key);
  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterMs: 0 };
  }
  if (entry.count < limit) {
    entry.count += 1;
    return { ok: true, retryAfterMs: 0 };
  }
  return { ok: false, retryAfterMs: Math.max(0, entry.resetAt - now) };
}

/** Test hook: clears all counters. */
export function resetRateLimits() {
  store.clear();
}
