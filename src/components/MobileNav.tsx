"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

export type MobileNavItem = { href: string; label: string; icon: LucideIcon };

export default function MobileNav({ items }: { items: MobileNavItem[] }) {
  const pathname = usePathname();
  const allHrefs = items.map((i) => i.href);
  const matches = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
  // Longest-prefix wins so a section root doesn't stay highlighted
  // when a deeper page is active.
  const isActive = (href: string) =>
    matches(href) && !allHrefs.some((o) => o !== href && o.length > href.length && matches(o));

  return (
    <nav
      aria-label="Primary"
      className="glass-strong fixed inset-x-4 bottom-4 z-30 rounded-[1.75rem] px-1 pb-[max(env(safe-area-inset-bottom),0.4rem)] pt-2 lg:hidden"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
    >
      <ul className="flex items-center justify-around">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 text-[10px] font-semibold transition-all duration-200 ${
                  active
                    ? "bg-accent/12 text-accent dark:bg-accent/20 dark:text-sky-300"
                    : "text-ink-2 hover:bg-black/5 hover:text-ink dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" strokeWidth={1.9} aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}