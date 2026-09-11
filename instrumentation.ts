/**
 * Runs once when the server boots. Migrations themselves run lazily on
 * first database connect (see lib/db.ts), so there is nothing to do here
 * besides confirming the hook is wired.
 */
export async function register() {}

/**
 * Central server-error sink: persists a trimmed record of every request
 * error (server actions, route handlers, renders) into a capped collection
 * surfaced on /admin/audit. Best-effort by design — it must never break
 * error handling itself (including edge-runtime invocations).
 */
export async function onRequestError(
  err: unknown,
  request: { path: string; method: string },
  context: { routerKind: string; routePath: string }
) {
  try {
    const { getDb } = await import("./src/lib/db");
    const db = await getDb();
    const e = err as Error & { digest?: string };
    await db.collection("error_events").insertOne({
      message: String(e?.message ?? err).slice(0, 500),
      digest: typeof e?.digest === "string" ? e.digest : "",
      route: context?.routePath ?? "",
      path: request?.path ?? "",
      created_at: new Date().toISOString(),
    });
  } catch {
    // swallow: error reporting must not fail the request
  }
}
