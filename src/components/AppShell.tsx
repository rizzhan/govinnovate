"use client";

import { Building2, ClipboardCheck, Compass, FileText, FlaskConical, Inbox, LayoutDashboard, LogOut, PlusCircle, Users } from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { roleLabels } from "@/lib/format";
import type { Role } from "@/lib/db";
import MobileNav, { type MobileNavItem } from "./MobileNav";
import SideNav, { type SideNavGroup } from "./SideNav";
import { ThemeToggle } from "./ThemeToggle";
import BrandMark from "./BrandMark";

const navConfig: Record<Role, SideNavGroup[]> = {
  government: [
    {
      heading: "Procurement Pipeline",
      items: [
        { href: "/gov", label: "Dashboard", icon: LayoutDashboard },
        { href: "/gov/challenges/new", label: "New Challenge", icon: PlusCircle },
        { href: "/gov/applications", label: "Applications", icon: Inbox },
        { href: "/gov/pilots", label: "Pilots", icon: FlaskConical },
      ],
    },
    {
      heading: "Resources",
      items: [{ href: "/templates", label: "Standard Templates", icon: FileText }],
    },
  ],
  startup: [
    {
      heading: "Opportunities",
      items: [
        { href: "/startup", label: "Dashboard", icon: LayoutDashboard },
        { href: "/startup/challenges", label: "Browse Challenges", icon: Compass },
        { href: "/startup/applications", label: "My Applications", icon: Inbox },
        { href: "/startup/pilots", label: "My Pilots", icon: FlaskConical },
      ],
    },
    {
      heading: "Account",
      items: [{ href: "/startup/profile", label: "Startup Profile", icon: Building2 }],
    },
  ],
  evaluator: [
    {
      heading: "Evaluation",
      items: [{ href: "/evaluator", label: "Workspace", icon: ClipboardCheck }],
    },
    {
      heading: "Resources",
      items: [{ href: "/templates", label: "Standard Templates", icon: FileText }],
    },
  ],
  admin: [
    {
      heading: "Administration",
      items: [
        { href: "/admin", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/users", label: "Users & Roles", icon: Users },
        { href: "/admin/templates", label: "Templates", icon: FileText },
      ],
    },
  ],
};

const mobileItems: Record<Role, MobileNavItem[]> = {
  government: [
    { href: "/gov", label: "Dashboard", icon: LayoutDashboard },
    { href: "/gov/challenges/new", label: "New", icon: PlusCircle },
    { href: "/gov/applications", label: "Apps", icon: Inbox },
    { href: "/gov/pilots", label: "Pilots", icon: FlaskConical },
  ],
  startup: [
    { href: "/startup", label: "Dashboard", icon: LayoutDashboard },
    { href: "/startup/challenges", label: "Browse", icon: Compass },
    { href: "/startup/applications", label: "Apps", icon: Inbox },
    { href: "/startup/pilots", label: "Pilots", icon: FlaskConical },
  ],
  evaluator: [
    { href: "/evaluator", label: "Workspace", icon: ClipboardCheck },
    { href: "/templates", label: "Templates", icon: FileText },
  ],
  admin: [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/templates", label: "Templates", icon: FileText },
  ],
};

export default function AppShell({
  user,
  children,
}: {
  user: { name: string; role: Role; org?: string; email?: string };
  children: React.ReactNode;
}) {
  const groups = navConfig[user.role] ?? [];
  return (
    <div className="min-h-screen">
      {/* Floating side rail */}
      <aside className="glass-dark fixed inset-y-4 left-4 z-20 hidden w-[15.5rem] flex-col overflow-hidden rounded-[1.75rem] lg:flex">
        <div className="flex items-center gap-3 px-5 py-6">
          <BrandMark size="sm" />
          <div>
            <p className="text-[15px] font-semibold tracking-tight text-white">GovInnovate</p>
            <p className="text-[11px] font-medium text-white/50">Innovation Procurement</p>
          </div>
        </div>
        <SideNav groups={groups} />
        <div className="border-t border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-violet text-sm font-semibold text-white">
              {user.name.charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              <p className="truncate text-[11px] text-white/50">
                {roleLabels[user.role]} {user.org ? `· ${user.org}` : ""}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-[18rem] lg:pr-6 lg:pt-4">
        {/* Frosted header */}
        <header className="sticky top-0 z-10 border-b border-white/50 bg-white/55 backdrop-blur-2xl lg:top-4 lg:rounded-2xl lg:border lg:shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-[#1c1c1e]/60">
          <div className="flex items-center justify-between px-5 py-3 lg:px-4">
            <div className="flex items-center gap-2.5 lg:hidden">
              <BrandMark size="sm" />
              <span className="text-[15px] font-semibold tracking-tight text-ink">GovInnovate</span>
            </div>

            <div className="hidden items-center gap-4 lg:flex">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/40 px-3.5 py-1 text-xs font-medium text-accent backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-sky-300">
                {roleLabels[user.role]} Portal
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="text-right lg:hidden">
                <p className="text-xs font-medium text-ink">{user.name}</p>
                <p className="text-[11px] text-ink-2">{roleLabels[user.role]}</p>
              </div>
              <ThemeToggle />
              <form action={logout}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/70 px-3.5 py-2 text-sm font-medium text-ink backdrop-blur transition-colors hover:bg-white active:scale-[0.97] dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 py-8 lg:px-4 lg:py-6">{children}</main>

        {/* Spacer so mobile content clears the floating tab bar */}
        <div className="h-24 lg:h-0" />

        <footer className="hidden px-4 pb-6 text-center text-xs text-ink-3 lg:block">
          GovInnovate · Startup-friendly Public Procurement Mechanism · Smart India Hackathon 2026
        </footer>
      </div>

      <MobileNav items={mobileItems[user.role] ?? []} />
    </div>
  );
}