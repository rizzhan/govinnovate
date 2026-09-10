"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

export type SideNavItem = { href: string; label: string; icon: LucideIcon };
export type SideNavGroup = { heading?: string; items: SideNavItem[] };

export default function SideNav({ groups }: { groups: SideNavGroup[] }) {
  const pathname = usePathname();
  const allHrefs = groups.flatMap((g) => g.items.map((i) => i.href));
  const matches = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
  // Longest-prefix wins so a section root (e.g. /gov) doesn't stay
  // highlighted when a deeper page (e.g. /gov/applications) is active.
  const isActive = (href: string) =>
    matches(href) && !allHrefs.some((o) => o !== href && o.length > href.length && matches(o));

  return (
    <nav className="flex-1 overflow-y-auto px-3 pb-6">
      {groups.map((g, gi) => (
        <div key={gi} className="mt-3">
          {g.heading && (
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
              {g.heading}
            </p>
          )}
          <ul className="space-y-0.5">
            {g.items.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-all duration-150 active:scale-[0.98] ${
                      active
                        ? "bg-white/14 text-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <item.icon
                      className={`h-[18px] w-[18px] transition-opacity ${
                        active ? "text-accent" : "opacity-80 group-hover:opacity-100"
                      }`}
                      strokeWidth={1.9}
                      aria-hidden
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}