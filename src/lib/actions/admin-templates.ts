"use server";

import { revalidatePath } from "next/cache";
import { db } from "../db";
import { requireRole } from "../auth";

function int(v: FormDataEntryValue | null): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export async function addTemplate(formData: FormData) {
  await requireRole(["admin"]);
  db.prepare(
    `INSERT INTO templates (title, category, description, content, icon)
     VALUES (?, ?, ?, ?, ?)`
  ).run(
    String(formData.get("title") || ""),
    String(formData.get("category") || "Pilot"),
    String(formData.get("description") || ""),
    String(formData.get("content") || ""),
    String(formData.get("icon") || "file-text")
  );
  revalidatePath("/admin");
  revalidatePath("/admin/templates");
  revalidatePath("/templates");
}

export async function deleteTemplate(formData: FormData) {
  await requireRole(["admin"]);
  db.prepare("DELETE FROM templates WHERE id=?").run(int(formData.get("id")));
  revalidatePath("/admin");
  revalidatePath("/admin/templates");
  revalidatePath("/templates");
}