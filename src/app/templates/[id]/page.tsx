import { FileText } from "lucide-react";
import { getTemplate } from "@/lib/data";
import { notFound } from "next/navigation";
import MarketingNav from "@/components/MarketingNav";
import { templateIcons } from "@/components/template-icons";

export default async function TemplateDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = getTemplate(Number(id));
  if (!template) notFound();

  const Icon = templateIcons[String(template.icon ?? "file-text").toLowerCase()] ?? FileText;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fog-blob left-[-8%] top-[-10%] h-[480px] w-[480px] bg-accent/26" />

      <MarketingNav back="/templates" backLabel="All templates" />

      <main className="relative z-10 mx-auto max-w-4xl px-6 py-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/50 px-3.5 py-1 text-xs font-medium text-accent backdrop-blur dark:border-white/10 dark:bg-white/5">
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {template.category}
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{template.title}</h1>
        <p className="mt-3 text-[15px] text-ink-2">{template.description}</p>

        <div className="glass mt-8 rounded-[2rem] p-6 sm:p-8">
          <pre className="whitespace-pre-wrap font-sans text-[15px] leading-7 text-ink">{template.content}</pre>
        </div>
      </main>

      <footer className="relative z-10 border-t border-black/5 py-10 text-center text-sm text-ink-3 dark:border-white/5">
        GovInnovate · Smart India Hackathon 2026
      </footer>
    </div>
  );
}