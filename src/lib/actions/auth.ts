"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getDb, Doc } from "../db";
import { createSession, deleteSession } from "../session";
import { checkLoginLimit } from "../rate-limit-mongo";
import { normalizeEmail } from "../validate";
import { logAudit } from "../audit";
import { getCurrentUser } from "../auth";

export type LoginState = {
  error?: string;
  email?: string;
} | undefined;

function getHomeForRole(role: string) {
  switch (role) {
    case "admin":
      return "/admin";
    case "government":
      return "/gov";
    case "evaluator":
      return "/evaluator";
    case "startup":
      return "/startup";
    default:
      return "/";
  }
}

export async function login(_prev: LoginState, formData: FormData) {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required.", email };
  }

  // Brute-force protection: per-account window (10 attempts / 10 min).
  // Network-level throttling belongs at the edge (Vercel Firewall,
  // Cloudflare, nginx) in front of multi-instance deployments.
  if (!(await checkLoginLimit(`login:email:${email}`, 10, 10 * 60 * 1000)).ok) {
    return { error: "Too many sign-in attempts for this account. Please try again in a few minutes.", email };
  }

  const db = await getDb();
  const user = (await db.collection<Doc>("users").findOne({ email })) as
    | { _id: number; name: string; email: string; password_hash: string; role: string }
    | null;

  if (!user) {
    logAudit(db, { actor_user_id: 0, actor_name: email, actor_role: "unknown", action: "auth.login_failed", entity: "user", meta: { reason: "unknown-email" } });
    return { error: "No account found with that email.", email };
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    logAudit(db, { actor_user_id: user._id, actor_name: user.name, actor_role: user.role, action: "auth.login_failed", entity: "user", entity_id: user._id, meta: { reason: "wrong-password" } });
    return { error: "Incorrect password.", email };
  }

  logAudit(db, { actor_user_id: user._id, actor_name: user.name, actor_role: user.role, action: "auth.login_success", entity: "user", entity_id: user._id, meta: {} });
  await createSession(user._id, user.role as any, user.name);
  redirect(getHomeForRole(user.role));
}

export async function logout() {
  const user = await getCurrentUser();
  const db = await getDb();
  await deleteSession();
  if (user) {
    logAudit(db, { actor_user_id: user.id, actor_name: user.name, actor_role: user.role, action: "auth.logout", entity: "user", entity_id: user.id, meta: {} });
  }
  redirect("/login");
}
