"use client";

import { Moon, Sun } from "lucide-react";

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})();`;

export function ThemeInit({ nonce }: { nonce?: string }) {
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}

export function ThemeToggle({ light = false }: { light?: boolean }) {
  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  };

  const base = light
    ? "inline-flex items-center justify-center rounded-full border border-black/10 bg-white/60 p-2.5 text-ink backdrop-blur transition-all duration-200 hover:bg-white active:scale-95 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
    : "inline-flex items-center justify-center rounded-full border border-black/10 bg-white/55 p-2.5 text-ink backdrop-blur transition-all duration-200 hover:bg-white active:scale-95 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className={base}
    >
      <Sun className="hidden h-4 w-4 dark:inline" aria-hidden />
      <Moon className="inline h-4 w-4 dark:hidden" aria-hidden />
    </button>
  );
}