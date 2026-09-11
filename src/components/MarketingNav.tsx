import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import BrandMark from "./BrandMark";
import { getCurrentUser } from "@/lib/auth";

const roleHome: Record<string, string> = {
  government: "/gov",
  startup: "/startup",
  evaluator: "/evaluator",
  admin: "/admin",
};

export default async function MarketingNav({
  back,
  backLabel = "Back to home",
  themeToggle = true,
  section = "home",
}: {
  back?: string;
  backLabel?: string;
  themeToggle?: boolean;
  section?: "home" | "templates";
}) {
  const user = back ? null : await getCurrentUser();
  const primaryCls =
    "inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_8px_20px_rgba(180,83,9,0.35)] transition-colors hover:bg-accent-dark active:scale-[0.97]";
  const navLinkCls =
    "hidden rounded-full px-4 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-black/5 hover:text-ink sm:inline-flex dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white";
  return (
    <header className="relative z-10 mx-auto max-w-6xl px-6 pt-5">
      <nav className="glass flex items-center justify-between rounded-full py-2.5 pl-4 pr-2.5 sm:py-2">
        <BrandMark size="sm" name="GovInnovate" />
        {back ? (
          <div className="flex items-center gap-1.5">
            {themeToggle && <ThemeToggle light />}
            <Link
              href={back}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-black/5 hover:text-ink dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">{backLabel}</span>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            {section === "templates" ? (
              <Link href="/" className={navLinkCls}>
                Home
              </Link>
            ) : (
              <Link href="/templates" className={navLinkCls}>
                Templates
              </Link>
            )}
            {themeToggle && <ThemeToggle light />}
            {user ? (
              <Link href={roleHome[user.role] ?? "/"} className={primaryCls}>
                Open dashboard
              </Link>
            ) : (
              <Link href="/login" className={primaryCls}>
                Sign in
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}