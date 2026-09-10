import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/* ---- Buttons ---------------------------------------------------------- */

const btnBase =
  "inline-flex items-center justify-center gap-1.5 rounded-full text-sm font-medium transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const btnVariants: Record<string, string> = {
  primary:
    "bg-accent text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_8px_20px_rgba(0,113,227,0.35)] hover:bg-accent-dark hover:shadow-[0_2px_4px_rgba(0,0,0,0.12),0_12px_28px_rgba(0,113,227,0.45)]",
  secondary:
    "glass-chip text-ink hover:bg-white/80 hover:-translate-y-px dark:text-white/90",
  ghost:
    "text-accent hover:bg-black/5 dark:hover:bg-white/10",
  danger:
    "glass-chip text-critical hover:bg-white/80 hover:-translate-y-px",
};

const btnSizes: Record<string, string> = {
  md: "px-4 py-2",
  sm: "px-3 py-1.5 text-xs",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <Link href={href} className={`${btnBase} ${btnVariants[variant]} ${btnSizes[size]} ${className}`}>
      {children}
    </Link>
  );
}

export function SubmitButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`${btnBase} ${btnVariants[variant]} ${btnSizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

/** Plain action button (non-submit), e.g. icon-only controls inside client components. */
export function IconButton({
  label,
  icon: IconCmp,
  onClick,
  className = "",
}: {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-black/5 hover:text-ink active:scale-95 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white ${className}`}
    >
      <IconCmp className="h-4 w-4" aria-hidden />
    </button>
  );
}

/* ---- Status system ----------------------------------------------------- */

export type Tone = "neutral" | "info" | "violet" | "success" | "warning" | "danger";

const toneStyles: Record<Tone, string> = {
  neutral: "bg-black/5 text-ink-2 dark:bg-white/10 dark:text-white/65",
  info: "bg-accent/10 text-accent-dark dark:bg-accent/20 dark:text-sky-300",
  violet: "bg-violet/10 text-violet dark:bg-violet/25 dark:text-[#a5a5ff]",
  success: "bg-verified/15 text-[#1f8a3d] dark:bg-verified/20 dark:text-[#32d74b]",
  warning: "bg-pending/15 text-[#9a4a00] dark:bg-pending/20 dark:text-[#ffd60a]",
  danger: "bg-critical/15 text-[#c2231a] dark:bg-critical/22 dark:text-[#ff453a]",
};

export function StatusBadge({
  tone = "neutral",
  icon: IconCmp,
  children,
  className = "",
}: {
  tone?: Tone;
  icon?: LucideIcon;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${toneStyles[tone]} ${className}`}
    >
      {IconCmp && <IconCmp className="h-3.5 w-3.5" aria-hidden />}
      {children}
    </span>
  );
}

/** Generic pill with raw className passthrough (legacy callers). Prefer StatusBadge. */
export function Badge({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

/* ---- Surfaces ----------------------------------------------------------- */

export function Card({
  title,
  children,
  action,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass lift overflow-hidden rounded-3xl ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-black/5 px-6 py-4 dark:border-white/10">
          {title && <h3 className="text-sm font-semibold tracking-tight text-ink">{title}</h3>}
          {action}
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

export function IconTile({
  icon: IconCmp,
  className = "bg-accent/10 text-accent",
  size = "md",
}: {
  icon: LucideIcon;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const box =
    size === "sm" ? "h-8 w-8 rounded-xl" : size === "lg" ? "h-12 w-12 rounded-2xl" : "h-10 w-10 rounded-2xl";
  const iconSize = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";
  return (
    <span className={`flex ${box} shrink-0 items-center justify-center backdrop-blur ${className}`}>
      <IconCmp className={iconSize} aria-hidden />
    </span>
  );
}

export function StatCard({
  label,
  value,
  icon: IconCmp,
  accent = "bg-accent/10 text-accent",
}: {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  accent?: string;
}) {
  return (
    <div className="glass lift rounded-3xl p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-medium tracking-tight text-ink-2">{label}</p>
        {IconCmp && (
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${accent}`}>
            <IconCmp className="h-5 w-5" aria-hidden />
          </span>
        )}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-ink tabular-nums">{value}</p>
    </div>
  );
}

/* ---- Forms --------------------------------------------------------------- */

export function Field({
  label,
  children,
  className = "",
  hint,
}: {
  label?: string;
  children: ReactNode;
  className?: string;
  hint?: string;
}) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="mb-1.5 block text-[13px] font-medium text-ink-2">{label}</span>}
      {children}
      {hint && <span className="mt-1.5 block text-xs text-ink-3">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full resize-none rounded-2xl border border-black/10 bg-white/70 px-4 py-2.5 text-sm text-ink backdrop-blur-md transition-colors placeholder:text-ink-3 focus:border-accent/60 focus:outline-none focus:ring-4 focus:ring-accent/10 dark:border-white/10 dark:bg-white/5 dark:text-white";

/* ---- State surfaces ------------------------------------------------------- */

export function EmptyState({
  icon: IconCmp,
  title,
  body,
}: {
  icon?: LucideIcon;
  title: string;
  body?: string;
}) {
  return (
    <div className="glass rounded-3xl border border-dashed border-black/10 px-6 py-14 text-center dark:border-white/10">
      {IconCmp && <IconCmp className="mx-auto h-8 w-8 text-ink-3/70" aria-hidden />}
      <p className="mt-3 text-[15px] font-semibold tracking-tight text-ink">{title}</p>
      {body && <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink-2">{body}</p>}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-black/5 dark:bg-white/10 ${className}`} />;
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-[15px] text-ink-2">{subtitle}</p>}
      </div>
      {action && <div className="flex shrink-0 gap-2">{action}</div>}
    </div>
  );
}