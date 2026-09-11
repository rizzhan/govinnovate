import { CheckCircle2, ClipboardCheck, FilePen, FlaskConical, Radar, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { challengeStatusLabels } from "@/lib/format";

const stages: { key: string; icon: LucideIcon }[] = [
  { key: "draft", icon: FilePen },
  { key: "open", icon: Radar },
  { key: "evaluate", icon: ClipboardCheck },
  { key: "piloting", icon: FlaskConical },
  { key: "scaling", icon: Rocket },
  { key: "completed", icon: CheckCircle2 },
];

export default function PipelineVisual({ currentStatus }: { currentStatus: string }) {
  const currentIndex = stages.findIndex((s) => s.key === currentStatus);
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max items-start gap-1.5">
        {stages.map((stage, i) => {
          const info = challengeStatusLabels[stage.key] ?? { label: stage.key };
          const reached = i <= currentIndex || currentIndex === -1;
          const isCurrent = i === currentIndex;
          const IconCmp = stage.icon;
          return (
            <div key={stage.key} className="flex items-center">
              <div
                className={`flex flex-col items-center rounded-2xl border px-3.5 py-3 text-center backdrop-blur transition-all ${
                  isCurrent
                    ? "border-accent/30 bg-accent/8 shadow-[0_8px_24px_rgba(180,83,9,0.18)]"
                    : reached
                      ? "glass-chip"
                      : "border-black/5 bg-white/30 opacity-50 dark:bg-white/5"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isCurrent
                      ? "bg-accent text-white shadow-[0_4px_12px_rgba(180,83,9,0.35)]"
                      : reached
                        ? "bg-white/80 text-accent dark:bg-white/15 dark:text-amber-300"
                        : "bg-white/60 text-ink-3 dark:bg-white/10 dark:text-white/40"
                  }`}
                >
                  <IconCmp className="h-4 w-4" strokeWidth={1.9} aria-hidden />
                </span>
                <p
                  className={`mt-1.5 max-w-[96px] text-[11px] font-medium leading-tight ${
                    isCurrent
                      ? "text-accent"
                      : reached
                        ? "text-ink dark:text-white/80"
                        : "text-ink-3 dark:text-white/40"
                  }`}
                >
                  {info.label}
                </p>
              </div>
              {i < stages.length - 1 && (
                <div
                  className={`mx-1 mb-6 h-0.5 w-5 rounded-full ${
                    i < currentIndex ? "bg-accent/50" : "bg-black/10 dark:bg-white/15"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}