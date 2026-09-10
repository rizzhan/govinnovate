/**
 * Small input validators shared by server actions. Pure functions so they
 * are trivially unit-testable.
 */

/** Normalizes a user-supplied link. Returns null when unusable. */
export function normalizeUrl(raw: unknown): string | null {
  const v = String(raw ?? "").trim().slice(0, 500);
  if (!v) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withScheme);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return withScheme;
  } catch {
    return null;
  }
}

/** Normalizes an email to its canonical lookup form. */
export function normalizeEmail(raw: unknown): string {
  return String(raw ?? "").trim().toLowerCase().slice(0, 160);
}
