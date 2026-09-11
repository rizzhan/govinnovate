"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Keeps server-rendered data fresh without user action: revalidates the
 * current route on an interval, but only while the tab is visible.
 * Client-side state (accordions, filters, modals) is preserved across
 * refreshes by React reconciliation.
 */
export default function AutoRefresh({ intervalMs = 20000 }: { intervalMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);
  return null;
}
