"use client";

/**
 * Last-resort boundary for root layout failures. Must define its own
 * <html>/<body> and cannot use app components or styles.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#0d0d0f", color: "#f5f5f7" }}>
        <div style={{ maxWidth: 480, margin: "10vh auto", textAlign: "center", padding: 24 }}>
          <h2>GovInnovate failed to load</h2>
          <p style={{ opacity: 0.7 }}>Please reload the page. If this keeps happening, contact the platform admin.</p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 16, padding: "10px 24px", borderRadius: 999, border: 0,
              background: "#B45309", color: "#fff", fontWeight: 600, cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
