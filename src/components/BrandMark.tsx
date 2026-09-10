import { Landmark } from "lucide-react";

export default function BrandMark({ size = "md", name }: { size?: "sm" | "md"; name?: string }) {
  const box = size === "sm" ? "h-8 w-8 rounded-xl" : "h-10 w-10 rounded-2xl";
  const icon = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex ${box} shrink-0 items-center justify-center bg-gradient-to-br from-accent to-violet text-white shadow-[0_8px_20px_rgba(0,113,227,0.35)]`}
      >
        <Landmark className={icon} strokeWidth={1.75} aria-hidden />
      </span>
      {name && <span className="text-lg font-semibold tracking-tight text-ink">{name}</span>}
    </div>
  );
}