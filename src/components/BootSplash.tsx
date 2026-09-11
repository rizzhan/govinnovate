"use client";

import { useEffect, useState } from "react";
import BrandMark from "./BrandMark";

/**
 * Boot splash: covers first paint while fonts and chunks settle, then fades.
 * Dismisses on window load (or immediately if already loaded) with a hard
 * timeout fallback so the app can never trap the user behind it.
 */
export default function BootSplash() {
  const [visible, setVisible] = useState(true);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let finished = false;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let removeTimer: ReturnType<typeof setTimeout> | undefined;
    const finish = () => {
      if (finished) return;
      finished = true;
      hideTimer = setTimeout(() => {
        setVisible(false);
        removeTimer = setTimeout(() => setGone(true), 500);
      }, 350);
    };
    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
      removeTimer = setTimeout(finish, 3000);
    }
    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      data-testid="boot-splash"
      role="status"
      aria-label="Loading GovInnovate"
      className={`fixed inset-0 z-[70] flex flex-col items-center justify-center gap-5 bg-[var(--page-bg)] transition-opacity duration-500 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <BrandMark size="md" name="GovInnovate" />
      <div className="h-1 w-40 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
        <div className="animate-boot-bar h-full w-1/3 rounded-full bg-gradient-to-r from-[#EA6A0A] via-[#C07F16] to-[#0E7A3C]" />
      </div>
      <p className="text-xs text-ink-3">Preparing your workspace</p>
    </div>
  );
}
