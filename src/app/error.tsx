"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

/** Route-level safety net: a crashing section shows a recovery panel, not a blank page. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error.digest ?? "", error.message);
  }, [error]);

  return (
    <div className="glass mx-auto max-w-lg rounded-[1.75rem] p-8 text-center">
      <TriangleAlert className="mx-auto h-8 w-8 text-pending" aria-hidden />
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink">Something went wrong</h2>
      <p className="mt-2 text-sm text-ink-2">
        This section failed to load. Your data is safe — try again, or go back and continue elsewhere.
      </p>
      {error.digest && <p className="mt-2 font-mono text-[11px] text-ink-3">Ref: {error.digest}</p>}
      <button
        type="button"
        onClick={reset}
        className="mt-5 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-dark active:scale-[0.97]"
      >
        Try again
      </button>
    </div>
  );
}
