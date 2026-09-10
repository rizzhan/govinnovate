import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import BrandMark from "./BrandMark";

export default function MarketingNav({
  back,
  backLabel = "Back to home",
}: {
  back?: string;
  backLabel?: string;
}) {
  return (
    <header className="relative z-10 mx-auto max-w-6xl px-6 pt-5">
      <nav className="glass flex items-center justify-between rounded-full py-2.5 pl-4 pr-2.5 sm:py-2">
        <BrandMark size="sm" name="GovInnovate" />
        {back ? (
          <div className="flex items-center gap-1.5">
            <ThemeToggle light />
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
            <Link
              href="/templates"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-black/5 hover:text-ink sm:inline-flex dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              Templates
            </Link>
            <ThemeToggle light />
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_8px_20px_rgba(0,113,227,0.35)] transition-colors hover:bg-accent-dark active:scale-[0.97]"
            >
              Sign in
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}