"use server";

import { revalidatePath } from "next/cache";
import { getDb, getNextId, nowIso, Doc } from "../db";
import { requireRole } from "../auth";
import { logAudit } from "../audit";

function int(v: FormDataEntryValue | null): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export async function addTemplate(formData: FormData) {
  const user = await requireRole(["admin"]);
  const db = await getDb();
  const title = String(formData.get("title") || "");
  const category = String(formData.get("category") || "Pilot");
  const r = await db.collection<Doc>("templates").insertOne({
    _id: await getNextId("templates"),
    title,
    category,
    description: String(formData.get("description") || ""),
    content: String(formData.get("content") || ""),
    icon: String(formData.get("icon") || "file-text"),
    created_at: nowIso(),
  });
  logAudit(db, { actor_user_id: user.id, actor_name: user.name, actor_role: user.role, action: "template.added", entity: "template", entity_id: r.insertedId as number, meta: { title, category } });
  revalidatePath("/admin");
  revalidatePath("/admin/templates");
  revalidatePath("/templates");
}

export async function deleteTemplate(formData: FormData) {
  const user = await requireRole(["admin"]);
  const db = await getDb();
  const id = int(formData.get("id"));
  const doomed = await db.collection<Doc>("templates").findOne({ _id: id });
  await db.collection<Doc>("templates").deleteOne({ _id: id });
  logAudit(db, { actor_user_id: user.id, actor_name: user.name, actor_role: user.role, action: "template.deleted", entity: "template", entity_id: id, meta: { title: doomed?.title ?? "" } });
  revalidatePath("/admin");
  revalidatePath("/admin/templates");
  revalidatePath("/templates");
}
