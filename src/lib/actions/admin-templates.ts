"use server";

import { revalidatePath } from "next/cache";
import { getDb, getNextId, nowIso, Doc } from "../db";
import { requireRole } from "../auth";

function int(v: FormDataEntryValue | null): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export async function addTemplate(formData: FormData) {
  await requireRole(["admin"]);
  const db = await getDb();
  await db.collection<Doc>("templates").insertOne({
    _id: await getNextId("templates"),
    title: String(formData.get("title") || ""),
    category: String(formData.get("category") || "Pilot"),
    description: String(formData.get("description") || ""),
    content: String(formData.get("content") || ""),
    icon: String(formData.get("icon") || "file-text"),
    created_at: nowIso(),
  });
  revalidatePath("/admin");
  revalidatePath("/admin/templates");
  revalidatePath("/templates");
}

export async function deleteTemplate(formData: FormData) {
  await requireRole(["admin"]);
  const db = await getDb();
  await db.collection<Doc>("templates").deleteOne({ _id: int(formData.get("id")) });
  revalidatePath("/admin");
  revalidatePath("/admin/templates");
  revalidatePath("/templates");
}
