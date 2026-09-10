import { requireRole } from "@/lib/auth";
import { getTemplates } from "@/lib/data";
import { Badge, ButtonLink, Card, Field, inputCls, SubmitButton } from "@/components/ui";
import { addTemplate, deleteTemplate } from "@/lib/actions/admin-templates";
import { templateIconOptions, templateIcons } from "@/components/template-icons";
import { FilePlus2, FileText } from "lucide-react";

const categories = ["Challenge", "Evaluation", "Pilot", "Legal & Compliance", "Procurement", "Scale-up"];

export default async function AdminTemplates() {
  await requireRole(["admin"]);
  const templates = getTemplates();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Templates Library</h1>
        <p className="mt-1 text-sm text-ink-2">Standard, compliant templates used across all stages of the pathway.</p>
      </div>

      <Card title="Add Template">
        <form action={addTemplate} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Title">
              <input type="text" name="title" required className={inputCls} />
            </Field>
            <Field label="Category">
              <select name="category" className={inputCls} defaultValue="Challenge">
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Icon">
              <select name="icon" className={inputCls} defaultValue="file-text">
                {templateIconOptions.map((o) => (
                  <option key={o.key} value={o.key}>{o.label}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Description">
            <input type="text" name="description" className={inputCls} />
          </Field>
          <Field label="Content">
            <textarea name="content" rows={6} required className={inputCls} />
          </Field>
          <div className="flex justify-end">
            <SubmitButton>
              <FilePlus2 className="h-4 w-4" aria-hidden />
              Save Template
            </SubmitButton>
          </div>
        </form>
      </Card>

      <Card title={`Templates (${templates.length})`}>
        <div className="divide-y divide-black/5 dark:divide-white/10">
          {templates.map((t) => {
            const Icon = templateIcons[String(t.icon ?? "file-text").toLowerCase()] ?? FileText;
            return (
              <div key={t.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon className="h-4.5 w-4.5" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{t.title}</p>
                    <p className="truncate text-xs text-ink-2">{t.description}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge>{t.category}</Badge>
                  <ButtonLink href={`/templates/${t.id}`} variant="ghost" size="sm">View</ButtonLink>
                  <form action={deleteTemplate} className="inline">
                    <input type="hidden" name="id" value={t.id} />
                    <SubmitButton variant="ghost" size="sm" className="text-[#c22f2f]">Delete</SubmitButton>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}